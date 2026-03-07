"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import industries from "@/app/lib/_industryList25";
import { getIndustryOrder } from "@/app/lib/getIndustryOrder";

export default function IndustrySelectorDropdown({
  stateSlug = "",
  citySlug = "",
  cityName = "",
}) {
  const [selected, setSelected] = useState("");

  const options = useMemo(() => {
    const popularityOrder =
      getIndustryOrder({
        state: stateSlug,
        city: citySlug,
      }) || [];

    return (industries || [])
      .filter((i) => i?.slug)
      .sort((a, b) => {
        const ai = popularityOrder.indexOf(a.slug);
        const bi = popularityOrder.indexOf(b.slug);

        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
      .map((ind) => ({
        slug: ind.slug,
        label: ind.label || ind.industry || ind.title,
      }));
  }, [stateSlug, citySlug]);

  const industryUrl =
    selected && stateSlug && citySlug
      ? `/state-loans/${stateSlug}/${citySlug}/industry/${selected}`
      : null;

  if (!options.length) return null;

  return (
    <div className="city-industry-dropdown">
      
      <div className="city-industry-dropdown__row">
        <select
          className="city-industry-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select an industry...</option>

          {options.map((opt) => (
            <option key={opt.slug} value={opt.slug}>
              {opt.label}
            </option>
          ))}
        </select>

        {industryUrl ? (
          <Link href={industryUrl} className="city-industry-go">
            View →
          </Link>
        ) : (
          <button className="city-industry-go disabled" disabled>
            View →
          </button>
        )}
      </div>

      <div className="city-industry-mini">
        Popular:
        {options.slice(0, 4).map((opt) => (
          <Link
            key={opt.slug}
            href={`/state-loans/${stateSlug}/${citySlug}/industry/${opt.slug}`}
            className="city-industry-mini__chip"
          >
            {opt.label}
          </Link>
        ))}
      </div>
    </div>
  );
}