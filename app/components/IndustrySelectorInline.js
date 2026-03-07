"use client";

import Link from "next/link";

export default function IndustrySelectorInline({
  stateSlug = "",
  citySlug = "",
  cityName = ""
}) {
  // Keep this list tight + high intent
  const industries = [
    { slug: "roofing", label: "Roofing" },
    { slug: "hvac", label: "HVAC" },
    { slug: "plumbing", label: "Plumbing" },
    { slug: "electrician", label: "Electrician" },
    { slug: "landscaping", label: "Landscaping" },
    { slug: "cleaning", label: "Cleaning" }
  ];

  return (
    <div className="city-industry-inline">
      <p className="city-industry-inline__label">
        Popular industries in {cityName}:
      </p>

      <div className="city-industry-inline__chips">
        {industries.map((ind) => (
          <Link
            key={ind.slug}
            href={`/state-loans/${stateSlug}/${citySlug}/industry/${ind.slug}`}
            className="city-industry-chip"
          >
            {ind.label} →
          </Link>
        ))}

        <Link
          href={`/state-loans/${stateSlug}/${citySlug}`}
          className="city-industry-all"
        >
          View all →
        </Link>
      </div>
    </div>
  );
}// JavaScript Document