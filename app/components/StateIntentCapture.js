"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const KEY = "sbc_intent_v1";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function setCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function getCookie(name) {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function setIntent(intent) {
  const payload = JSON.stringify(intent);
  try {
    localStorage.setItem(KEY, payload);
  } catch {}
  setCookie(KEY, payload, MAX_AGE_SECONDS);
}

function getIntent() {
  // Prefer localStorage, fallback cookie
  try {
    const ls = localStorage.getItem(KEY);
    if (ls) return safeJsonParse(ls);
  } catch {}

  const ck = getCookie(KEY);
  if (ck) return safeJsonParse(ck);

  return null;
}

function normalizeSlug(s) {
  return (s || "").trim().toLowerCase();
}

function parseIntentFromPath(pathname) {
  // pathname examples:
  // /state-loans/texas
  // /state-loans/texas/dallas
  // /loans/texas
  // /loans/texas/dallas
  // /[state]/[city] (you also have app/[state]/[city]/page.js)

  const parts = pathname.split("/").filter(Boolean);

  // helpers
  const build = (state, city, source) => ({
    state: state ? normalizeSlug(state) : null,
    city: city ? normalizeSlug(city) : null,
    source,
    path: pathname,
    ts: Date.now(),
  });

  // /state-loans/:state/:city?
  const iStateLoans = parts.indexOf("state-loans");
  if (iStateLoans !== -1) {
    const state = parts[iStateLoans + 1] || null;
    const city = parts[iStateLoans + 2] || null;
    if (state) return build(state, city, "route:state-loans");
  }

  // /loans/:state/:city?
  const iLoans = parts.indexOf("loans");
  if (iLoans !== -1) {
    const state = parts[iLoans + 1] || null;
    const city = parts[iLoans + 2] || null;
    if (state) return build(state, city, "route:loans");
  }

  // /:state/:city? (your app/[state]/[city])
  if (parts.length >= 1) {
    const first = parts[0];
    const second = parts[1] || null;

    // avoid treating known top-level routes as a "state"
    const reserved = new Set([
      "apply",
      "industries",
      "sitemap",
      "_cities",
      "_state",
      "api",
      "components",
    ]);

    if (!reserved.has(first)) {
      return build(first, second, "route:top-level");
    }
  }

  return null;
}

function parseIntentFromHref(href) {
  if (!href) return null;

  // ignore tel/sms/mailto/etc
  if (
    href.startsWith("tel:") ||
    href.startsWith("sms:") ||
    href.startsWith("mailto:")
  ) {
    return null;
  }

  try {
    const url = href.startsWith("http")
      ? new URL(href)
      : new URL(href, window.location.origin);

    return parseIntentFromPath(url.pathname);
  } catch {
    return null;
  }
}

function applyIntentToApplyLinks(intent) {
  if (!intent?.state) return;

  const links = document.querySelectorAll('a[href^="/apply"], a[href^="https://"]');

  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    // only rewrite site /apply links
    const isApply =
      href === "/apply" ||
      href.startsWith("/apply?") ||
      href.startsWith(window.location.origin + "/apply");

    if (!isApply) return;

    try {
      const url = href.startsWith("http")
        ? new URL(href)
        : new URL(href, window.location.origin);

      url.searchParams.set("state", intent.state);
      if (intent.city) url.searchParams.set("city", intent.city);

      // keep relative if original was relative
      const nextHref = href.startsWith("http")
        ? url.toString()
        : url.pathname + url.search;

      a.setAttribute("href", nextHref);
    } catch {}
  });
}

export default function StateIntentCapture() {
  const pathname = usePathname();

  useEffect(() => {
    // A) Capture intent from current route (when user lands on a state/city page)
    const routeIntent = parseIntentFromPath(pathname);
    if (routeIntent?.state) setIntent(routeIntent);

    // B) Apply intent to /apply links (so user carries state into the funnel)
    const currentIntent = routeIntent?.state ? routeIntent : getIntent();
    if (currentIntent?.state) applyIntentToApplyLinks(currentIntent);

    // C) Capture intent from clicks anywhere (homepage grid, nav, internal links)
    const onClick = (e) => {
      const anchor = e.target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const clickIntent = parseIntentFromHref(href);
      if (clickIntent?.state) setIntent(clickIntent);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}