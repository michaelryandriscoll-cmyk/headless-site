// app/state-loans/layout.js
"use client";

import "@/app/city-loans.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const titleCase = (str = "") =>
  str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\b(Business Loans?|Loans?)\b/gi, "")
    .trim();

export default function StateLoansLayout({ children }) {
  const pathname = usePathname();

  // Build breadcrumb segments from the URL
  // e.g. /state-loans/new-york/new-york-city/industry/roofing
  const segments = pathname.split("/").filter(Boolean);
  // segments: ["state-loans", "new-york", "new-york-city", "industry", "roofing"]

  const crumbs = [{ label: "Home", href: "/" }];

  segments.forEach((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label =
      seg === "state-loans"
        ? "State Loans"
        : seg === "industry"
        ? null // skip "industry" segment — it's not meaningful as a crumb
        : titleCase(seg);

    if (label) crumbs.push({ label, href });
  });

  return (
    <>
      {/* ── TOP BAR: breadcrumb + CTA buttons ── */}
      <div className="sl-topbar">
        <div className="sl-topbar__inner">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="sl-breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={crumb.href}>
                {i > 0 && <span className="sl-breadcrumb__sep">›</span>}
                {i === crumbs.length - 1 ? (
                  <strong>{crumb.label}</strong>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="sl-topbar__actions">
            <Link href="/apply" className="sl-topbar__btn sl-topbar__btn--primary">
              Apply Now →
            </Link>
            <a href="tel:18883657999" className="sl-topbar__btn sl-topbar__btn--secondary">
              Call 1-888-365-7999
            </a>
          </div>

        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      {children}
    </>
  );
}
