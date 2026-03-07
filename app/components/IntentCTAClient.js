"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function IntentCTAClient({
  city,
  state,
  industry,
  variant = "city", // "city" | "industry"
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shown = false;

    const onScroll = () => {
      const scrollPct =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);

      if (!shown && scrollPct > 0.45) {
        shown = true;
        setVisible(true);
      }
    };

    const idleTimer = setTimeout(() => {
      if (!shown) {
        shown = true;
        setVisible(true);
      }
    }, 9000);

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleTimer);
    };
  }, []);

  if (!visible) return null;

  const headline =
    variant === "industry"
      ? `Get ${industry} Funding in ${city}`
      : `Check Funding Options in ${city}`;

  const sub =
    variant === "industry"
      ? `Fast approvals for ${industry.toLowerCase()} businesses`
      : `Compare programs available in ${city}, ${state}`;

  return (
    <div className="intent-cta">
      <div className="intent-cta-inner">
        <div>
          <strong>{headline}</strong>
          <p>{sub}</p>
        </div>

        <Link href="/apply" className="intent-cta-btn">
          Get Started →
        </Link>
      </div>
    </div>
  );
}