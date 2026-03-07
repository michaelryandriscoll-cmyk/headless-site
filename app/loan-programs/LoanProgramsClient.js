"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const CATEGORY_DEFS = [
  { key: "fast", label: "Fast funding" },
  { key: "lowdocs", label: "Low docs" },
  { key: "newbiz", label: "New business" },
  { key: "badcredit", label: "Bad credit" },
];

// Slug → chip categories mapping (edit as needed)
const SLUG_CATEGORIES = {
  "working-capital-loans": ["fast"],
  "no-doc-loans": ["fast", "lowdocs"],
  "startup-loans": ["newbiz"],
  "bad-credit-loans": ["badcredit"],
  "revenue-based-financing": ["fast"],
};

function matchesCategory(program, activeCats) {
  if (activeCats.size === 0) return true;
  const cats = SLUG_CATEGORIES[program.slug] || [];
  return [...activeCats].every((k) => cats.includes(k));
}

export default function LoanProgramsClient({ loanPrograms, featuredSlugs }) {
  const [q, setQ] = useState("");
  const [activeCats, setActiveCats] = useState(new Set());

  const hasFilters = q.trim().length > 0 || activeCats.size > 0;

  const toggleCat = (key) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearFilters = () => {
    setQ("");
    setActiveCats(new Set());
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return loanPrograms.filter((p) => {
      const haystack = `${p.title} ${p.slug}`.toLowerCase();
      const matchesQuery = query ? haystack.includes(query) : true;
      const matchesCats = matchesCategory(p, activeCats);
      return matchesQuery && matchesCats;
    });
  }, [loanPrograms, q, activeCats]);

  // Featured first (in the order you defined), then alphabetical for the rest
  const featuredPrograms = useMemo(() => {
    const map = new Map(filtered.map((p) => [p.slug, p]));
    return featuredSlugs.map((s) => map.get(s)).filter(Boolean);
  }, [filtered, featuredSlugs]);

  const otherPrograms = useMemo(() => {
    const featuredSet = new Set(featuredSlugs);

    return filtered
      .filter((p) => !featuredSet.has(p.slug))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [filtered, featuredSlugs]);

  return (
    <>
      {/* ================= SEARCH + CHIPS ================= */}
      <div className="loan-programs-controls">
        <div className="loan-programs-searchRow">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search loan programs (ex: startup, no doc, revenue)…"
            className="loan-programs-search-input"
            aria-label="Search loan programs"
          />

          {hasFilters ? (
            <button
              type="button"
              className="loan-programs-clear-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          ) : (
            <span className="loan-programs-search-hint">Tip: try “startup”</span>
          )}
        </div>

        <div className="loan-programs-chips" role="group" aria-label="Category filters">
          {CATEGORY_DEFS.map((c) => {
            const active = activeCats.has(c.key);
            return (
              <button
                key={c.key}
                type="button"
                className={`loan-chip ${active ? "is-active" : ""}`}
                onClick={() => toggleCat(c.key)}
                aria-pressed={active}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: "1.25rem",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            background: "#fff",
          }}
        >
          <p style={{ margin: 0 }}>No loan programs match your filters.</p>
        </div>
      ) : (
        <>
          {/* ================= FEATURED ================= */}
          {featuredPrograms.length > 0 && (
            <section className="loan-programs-featured">
              <header className="loan-programs-featured-header">
                <span className="section-eyebrow">Popular picks</span>
                <h2>Featured loan programs</h2>
                <p>Start here if you want the fastest path to funding.</p>
              </header>

              <div className="loan-programs-featured-grid">
                {featuredPrograms.map((p) => (
                  <Link
                    key={p.slug}
                    href={p.href}
                    className="loan-program-featured-card"
                  >
                    <div className="loan-program-featured-top">
                      <h3 className="loan-program-featured-title">{p.title}</h3>
                      <span className="loan-program-featured-badge">
                        Featured
                      </span>
                    </div>

                    <p className="loan-program-featured-desc">
                      Learn how {p.title} works, who it’s best for, and how to
                      apply.
                    </p>

                    <div className="loan-program-featured-cta">
                      View program <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ================= ALL PROGRAMS ================= */}
          <div style={{ marginTop: "2rem" }}>
            <header className="loan-how-header" style={{ marginBottom: "1.25rem" }}>
              <span className="section-eyebrow">All programs</span>
              <h2 style={{ marginBottom: "0.5rem" }}>
                Browse all loan programs
              </h2>

              {hasFilters && (
                <p style={{ marginTop: "0.5rem", maxWidth: "70ch" }}>
                  Showing <strong>{filtered.length}</strong> result
                  {filtered.length === 1 ? "" : "s"}.
                </p>
              )}
            </header>

            {otherPrograms.length === 0 ? (
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                }}
              >
                <p style={{ margin: 0 }}>
                  No additional loan programs found.
                </p>
              </div>
            ) : (
              <div className="loan-programs-grid">
                {otherPrograms.map((p) => (
                  <Link key={p.slug} href={p.href} className="loan-program-card">
                    <div className="loan-program-card-top">
                      <h3 className="loan-program-title">{p.title}</h3>
                      <span className="loan-program-pill">Loan Program</span>
                    </div>

                    <p className="loan-program-desc">
                      Learn how {p.title} works, who it’s best for, and how to apply.
                    </p>

                    <div className="loan-program-cta">
                      View program <span aria-hidden="true">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}