"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function StateSearchFilter({ states = [] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return states;

    return states.filter((s) =>
      s.name.toLowerCase().includes(q)
    );
  }, [query, states]);

  return (
    <>
      <div className="industry-selector__search">
        <input
          type="text"
          placeholder="Search a state (ex: Texas, Florida, New York)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search states"
        />
      </div>

      <div
        className="industry-selector__grid"
        style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
      >
        {filtered.map((st) => (
          <Link
            key={st.slug}
            href={`/state-loans/${st.slug}`}
            className="industry-chip"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 900 }}>
              {st.name}
            </span>

            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "rgba(11,18,32,0.62)",
              }}
            >
              {st.citiesCount} cities
            </span>

            <span className="industry-chip__arrow" style={{ marginTop: 4 }}>
              View funding pages →
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="industry-selector__empty">
          No states matched your search. Try “Texas” or “Florida”.
        </p>
      )}
    </>
  );
}