"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function CityIndustryDropdownClient({
  stateSlug,
  citySlug,
  cityName,
  industries = [],
}) {
  const [selected, setSelected] = useState("");

  const industryOptions = useMemo(() => {
    return (industries || [])
      .filter((i) => i?.slug)
      .map((i) => ({
        slug: i.slug,
        label:
          i.industry ||
          i.label ||
          i.title ||
          i.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      }));
  }, [industries]);

  const href = selected
    ? `/state-loans/${stateSlug}/${citySlug}/industry/${selected}`
    : "";

  return (
    <div className="city-industry-dropdown">
      <div className="city-industry-dropdown__top">
        <p className="city-industry-dropdown__label">
          Choose an industry in {cityName}:
        </p>

        <Link className="city-industry-dropdown__all" href={`/state-loans/${stateSlug}`}>
          Back to state →
        </Link>
      </div>

      <div className="city-industry-dropdown__row">
        <select
          className="city-industry-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-label={`Choose an industry in ${cityName}`}
        >
          <option value="">Select an industry…</option>
          {industryOptions.map((ind) => (
            <option key={ind.slug} value={ind.slug}>
              {ind.label}
            </option>
          ))}
        </select>

        {href ? (
          <a className="city-industry-go" href={href}>
            View →
          </a>
        ) : (
          <button className="city-industry-go disabled" type="button" disabled>
            View →
          </button>
        )}
      </div>

      {/* Optional “Popular” quick chips */}
      {industryOptions.length > 0 && (
        <div className="city-industry-mini">
          Popular:
          {industryOptions.slice(0, 4).map((ind) => (
            <Link
              key={ind.slug}
              className="city-industry-mini__chip"
              href={`/state-loans/${stateSlug}/${citySlug}/industry/${ind.slug}`}
            >
              {ind.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}