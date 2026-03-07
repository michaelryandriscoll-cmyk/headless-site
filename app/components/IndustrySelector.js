"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function IndustrySelector({
  stateSlug = "",
  citySlug = "",
  cityName = "",
  title = "Browse Funding by Industry",
  subtitle = "Pick your industry to view loan options tailored to your business type."
}) {
  const [query, setQuery] = useState("");

  // 🔥 Your top converting industries (keep short + contractor-heavy)
  const industries = useMemo(
    () => [
      { slug: "roofing", label: "Roofing" },
      { slug: "hvac", label: "HVAC" },
      { slug: "plumbing", label: "Plumbing" },
      { slug: "electrician", label: "Electrician" },
      { slug: "landscaping", label: "Landscaping" },
      { slug: "cleaning", label: "Cleaning" },
      { slug: "construction", label: "Construction" },
      { slug: "general-contractors", label: "General Contractors" },
      { slug: "solar", label: "Solar" },
      { slug: "trucking", label: "Trucking" },
      { slug: "restaurant", label: "Restaurant" },
      { slug: "retail", label: "Retail" }
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return industries;
    return industries.filter((i) => i.label.toLowerCase().includes(q));
  }, [query, industries]);

  const baseHref = `/state-loans/${stateSlug}/${citySlug}/industry`;

  return (
    <section className="industry-selector">
      <div className="industry-selector__head">
        <h2>{title}</h2>
        <p>
          {subtitle}{" "}
          <span className="industry-selector__hint">
            {cityName ? `For ${cityName}.` : ""}
          </span>
        </p>
      </div>

      <div className="industry-selector__search">
        <input
          type="text"
          value={query}
          placeholder="Search an industry… (roofing, hvac, plumbing)"
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search industries"
        />
      </div>

      <div className="industry-selector__grid">
        {filtered.map((ind) => (
          <Link
            key={ind.slug}
            href={`${baseHref}/${ind.slug}`}
            className="industry-chip"
          >
            <span className="industry-chip__label">{ind.label}</span>
            <span className="industry-chip__arrow">→</span>
          </Link>
        ))}
      </div>

      {!filtered.length && (
        <p className="industry-selector__empty">
          No industries match that search. Try “roofing” or “hvac”.
        </p>
      )}
    </section>
  );
}// JavaScript Document