// app/state-loans/page.js
import "@/app/styles/state-loans.css";

import Link from "next/link";
import stateCityMap from "@/app/lib/stateCityMap";
import StateSearchFilter from "@/app/components/StateSearchFilter";

const titleCase = (str = "") =>
  str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();

export const dynamic = "force-static";

export const metadata = {
  title: "State Business Loans | Browse Funding by State",
  description:
    "Explore small business loans by state. Compare working capital, credit lines, and equipment financing programs across the U.S.",
  alternates: {
    canonical: "https://smallbusiness.capital/state-loans",
  },
};

export default function StateLoansHubPage() {
  const allStates = Object.keys(stateCityMap || {})
    .map((slug) => {
      const S = stateCityMap[slug];
      return {
        slug,
        name: S?.stateName || titleCase(slug),
        citiesCount: S?.cities?.length || 0,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
   <main className="city-loan-page" style={{ paddingTop: 88 }}>
      <header className="city-header">
        <h1>Business Loans by State</h1>
        <p>
          Browse state-level small business funding pages. Choose your state to
          explore working capital, equipment financing, credit lines, and city +
          industry loan programs.
        </p>
      </header>

      <section
        className="industry-selector"
        style={{ marginTop: 18, marginBottom: 24 }}
      >
        <div className="industry-selector__head">
          <h2>Find Your State</h2>
          <p>
            Start at the state level, then drill down into cities and industries
            for highly targeted funding pages.
          </p>
          <p className="industry-selector__hint">
            {allStates.length} states available
          </p>
        </div>
        <StateSearchFilter states={allStates} />
      </section>

      <section className="seo-silo" style={{ marginTop: 8 }}>
        <h2>Popular State Loan Pages</h2>
        <p>
          These are some of the most searched state-level funding hubs. If your
          state isn't listed below, use the search box above.
        </p>
        <ul className="silo-list">
          {["texas", "florida", "california", "new-york", "illinois", "georgia"]
            .filter((slug) => stateCityMap?.[slug])
            .map((slug) => (
              <li key={slug}>
                <Link href={`/state-loans/${slug}`}>
                  {stateCityMap[slug]?.stateName || titleCase(slug)} Small
                  Business Loans
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="city-cta">
        <h2>Get Matched With Funding Options</h2>
        <p>
          One application, multiple lender options. Qualification review does not
          affect personal credit.
        </p>
        <Link href="/apply" className="cta-apply-btn">
          Start Online Application
        </Link>
        <a href="tel:18883657999" className="cta-call-btn">
          Speak With a Funding Advisor
        </a>
      </section>
    </main>
  );
}