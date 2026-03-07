// app/state-loans/[state]/page.js
import "@/app/styles/state-loans.css";
import Link from "next/link";
import stateCityMap from "@/app/lib/stateCityMap";
import IndustrySelectorDropdown from "@/app/components/IndustrySelectorDropdown";

export const dynamic = "force-static";

const normalizeStateSlug = (slug = "") => slug.toLowerCase().trim();

export async function generateStaticParams() {
  return Object.keys(stateCityMap).map((state) => ({ state }));
}

export async function generateMetadata({ params }) {
  const { state } = await params;
  const normalizedState = normalizeStateSlug(state);
  const S = stateCityMap[normalizedState];

  if (!S) {
    return {
      title: "State Business Loans | Small Business Capital",
      description: "Explore fast working capital, equipment loans and business credit lines by state.",
    };
  }

  return {
    title: `${S.stateName} Small Business Loans | Funding Programs & Lenders`,
    description: `Working capital, credit lines, equipment financing and same-week funding available across ${S.stateName}. Compare programs and lenders by city.`,
    alternates: {
      canonical: `https://smallbusiness.capital/state-loans/${normalizedState}`,
    },
  };
}

export default async function StatePage({ params }) {
  const { state } = await params;
  const normalizedState = normalizeStateSlug(state);
  const allStates = Object.keys(stateCityMap);
  const S = stateCityMap[normalizedState];

  if (!S) {
    return (
      <main className="state-page" style={{ paddingTop: 120 }}>
        <h1>State Not Found</h1>
        <p>We couldn't find <strong>{String(state)}</strong> in your state map.</p>
        <p style={{ marginTop: 16 }}>Available states in <code>stateCityMap</code>:</p>
        <ul style={{ columns: 2, marginTop: 10 }}>
          {allStates.map((s) => (
            <li key={s}><Link href={`/state-loans/${s}`}>{s}</Link></li>
          ))}
        </ul>
      </main>
    );
  }

  const credit = S?.creditScore || "580+ (varies by program)";
  const speed = S?.processingTime || "24–72 Hours";
  const coverage = S?.stateName || "Statewide";
  const stateHref = `/state-loans/${normalizedState}`;

  return (
    <main className="state-page" style={{ paddingTop: 25 }}>
      <header className="state-hero">
        <h1>{S.stateName} Small Business Loans</h1>
        <p>
          Explore working capital, equipment financing, and business credit lines
          available across {S.stateName}. Compare funding options by city and industry.
        </p>
        <div className="state-stats">
          <div className="state-stat">
            <strong>Minimum Credit Score</strong>
            <span>{credit}</span>
          </div>
          <div className="state-stat">
            <strong>Average Processing Time</strong>
            <span>{speed}</span>
          </div>
          <div className="state-stat">
            <strong>Coverage</strong>
            <span>{coverage}</span>
          </div>
        </div>
      </header>

      <section className="seo-silo" style={{ marginTop: 18 }}>
        <h2>Business Loans by City in {S.stateName}</h2>
        <p>Select a city to view local funding options — then pick your industry.</p>
        <div className="state-city-grid">
          {S.cities.map((city, idx) => (
            <div key={idx} className="state-city-card">
              <div className="state-city-card__head">
                <h3>{city.name} Business Loans</h3>
                <Link href={`${stateHref}/${city.slug}`} className="state-city-card__link">
                  View City Page →
                </Link>
              </div>
              <IndustrySelectorDropdown
                stateSlug={normalizedState}
                citySlug={city.slug}
                cityName={city.name}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="state-cta">
        <h2>Start Your {S.stateName} Funding Review</h2>
        <p>One application, multiple lender options. Qualification review does not affect personal credit.</p>
        <div className="state-cta-actions">
          <Link href="/apply" className="state-btn-primary">Start Online Application</Link>
          <a href="tel:18883657999" className="state-btn-secondary">Speak With a Funding Advisor</a>
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          ✅ No obligation • ✅ Fast review • ✅ Doesn't impact personal credit
        </p>
      </section>
    </main>
  );
}