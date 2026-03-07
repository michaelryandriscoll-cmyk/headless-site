"use client";

import { useState } from "react";
import Link from "next/link";

export default function CityIndustryPicker({
  cityBase = "",
  cityName = "",
  stateName = "",
  stateSlug = "",
  industries = [],
}) {
  const [selected, setSelected] = useState("");

  const goHref = selected ? `${cityBase}/industry/${selected}` : "";

  return (
    <div className="city-industry-dropdown">
      <div className="city-industry-dropdown__top">
        <p className="city-industry-dropdown__label">
          Choose an industry in {cityName}:
        </p>

        <Link className="city-industry-dropdown__all" href={`/state-loans/${stateSlug}`}>
          Back to {stateName} →
        </Link>
      </div>

      <div className="city-industry-dropdown__row">
        <select
          className="city-industry-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select an industry…</option>
          {industries.map((ind) => (
            <option key={ind.slug} value={ind.slug}>
              {ind.label}
            </option>
          ))}
        </select>

        <Link
          href={goHref || "#"}
          className={`city-industry-go ${!selected ? "disabled" : ""}`}
          onClick={(e) => {
            if (!selected) e.preventDefault();
          }}
        >
          View →
        </Link>
      </div>

      <div className="city-industry-mini">
        Popular:
        {industries.slice(0, 4).map((ind) => (
          <Link
            key={ind.slug}
            className="city-industry-mini__chip"
            href={`${cityBase}/industry/${ind.slug}`}
          >
            {ind.label}
          </Link>
        ))}
      </div>
    </div>
  );
}// JavaScript Document