// app/page.js
import Link from "next/link";
import Script from "next/script";
import StaticHero from "./components/StaticHero";
import IconBusinesses from "./components/icons/IconBusinesses";
import IconFast from "./components/icons/IconFast";
import IconLenders from "./components/icons/IconLenders";
import IconNoCredit from "./components/icons/IconNoCredit";
import StateFilter from "./components/StateFilter";
import FaqAccordion from "./components/FaqAccordion";

/* =========================
   SEO METADATA
========================= */

export const metadata = {
  title: "Small Business Loans | Fast Approval | Small Business Capital",
  description:
    "Get small business loans fast. Working capital, equipment financing, lines of credit, and more. Apply in minutes - decisions in as little as 2 hours. No impact to credit.",
  alternates: {
    canonical: "https://smallbusiness.capital",
  },
  openGraph: {
    title: "Small Business Loans | Fast Approval | Small Business Capital",
    description:
      "Apply once and compare small business loan offers from 150+ lenders. No collateral required. No impact to credit.",
    url: "https://smallbusiness.capital",
    siteName: "Small Business Capital",
    type: "website",
  },
};

/* =========================
   TOP CITIES DATA
========================= */

const TOP_CITIES = [
  { name: "New York City", slug: "new-york-city", state: "new-york" },
  { name: "Los Angeles", slug: "los-angeles", state: "california" },
  { name: "Chicago", slug: "chicago", state: "illinois" },
  { name: "Houston", slug: "houston", state: "texas" },
  { name: "Phoenix", slug: "phoenix", state: "arizona" },
  { name: "Philadelphia", slug: "philadelphia", state: "pennsylvania" },
  { name: "San Antonio", slug: "san-antonio", state: "texas" },
  { name: "San Diego", slug: "san-diego", state: "california" },
  { name: "Dallas", slug: "dallas", state: "texas" },
  { name: "Jacksonville", slug: "jacksonville", state: "florida" },
  { name: "Austin", slug: "austin", state: "texas" },
  { name: "Fort Worth", slug: "fort-worth", state: "texas" },
  { name: "Columbus", slug: "columbus", state: "ohio" },
  { name: "Charlotte", slug: "charlotte", state: "north-carolina" },
  { name: "Indianapolis", slug: "indianapolis", state: "indiana" },
  { name: "San Francisco", slug: "san-francisco", state: "california" },
  { name: "Seattle", slug: "seattle", state: "washington" },
  { name: "Denver", slug: "denver", state: "colorado" },
  { name: "Nashville", slug: "nashville", state: "tennessee" },
  { name: "Miami", slug: "miami", state: "florida" },
];

/* =========================
   PAGE
========================= */

export default function HomePage() {

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://smallbusiness.capital/#business",
    name: "Small Business Capital",
    url: "https://smallbusiness.capital",
    telephone: "+18889008979",
    description:
      "Small Business Capital connects business owners with fast, flexible funding. Working capital loans, equipment financing, lines of credit, and more - nationwide.",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    priceRange: "$10,000 - $500,000",
    serviceType: [
      "Working Capital Loans",
      "Business Line of Credit",
      "Equipment Financing",
      "SBA Loans",
      "Merchant Cash Advance",
      "Business Loans for Bad Credit",
    ],
    sameAs: [
      "https://linkedin.com/company/smallbusinesscapital",
      "https://facebook.com/smallbusinesscapital",
      "https://instagram.com/smallbusiness.capital",
    ],
  };

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Small Business Capital",
    url: "https://smallbusiness.capital",
    telephone: "+1-888-900-8979",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Working Capital Loans",
      "Business Line of Credit",
      "Equipment Financing",
    ],
    sameAs: [
      "https://linkedin.com/company/smallbusinesscapital",
      "https://facebook.com/smallbusinesscapital",
      "https://instagram.com/smallbusiness.capital",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en-US",
    mainEntity: [
      {
        "@type": "Question",
        name: "Will this affect my credit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Checking your options does not impact your credit score. We use soft checks and revenue-based review - not hard inquiries.",
        },
      },
      {
        "@type": "Question",
        name: "How fast can I get approved?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most businesses receive decisions in as little as 2 hours, with funding available as soon as 24-48 hours after approval.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need collateral or perfect credit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No collateral is required. Approval is based on business revenue and cash flow, not just credit score.",
        },
      },
    ],
  };

  return (
    <main className="home">

      <Script
        id="local-business-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <Script
        id="financial-service-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />

      {/* HERO */}
      <StaticHero />

      {/* TRUST STRIP */}
      <section
        className="trust-strip"
        itemScope
        itemType="https://schema.org/FinancialService"
        aria-label="Trusted nationwide business funding network"
      >
        <div className="trust-strip__inner">

          <div className="trust-badge">
            <div className="trust-icon filled"><IconBusinesses /></div>
            <div className="trust-text">
              <strong>Businesses Funded</strong>
              <span>Nationwide</span>
            </div>
          </div>

          <div className="trust-badge">
            <div className="trust-icon filled"><IconFast /></div>
            <div className="trust-text">
              <strong>Fast Funding</strong>
              <span>24-48 Hours</span>
            </div>
          </div>

          <div className="trust-badge">
            <div className="trust-icon filled"><IconLenders /></div>
            <div className="trust-text">
              <strong>150+ Lenders</strong>
              <span>Private Network</span>
            </div>
          </div>

          <div className="trust-badge">
            <div className="trust-icon filled"><IconNoCredit /></div>
            <div className="trust-text">
              <strong>No Credit Impact</strong>
              <span>Soft Review</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="home-feature-row">
        <div className="container">
          <div className="home-feature-grid">

            <div className="feature-box">
              <svg width="40" height="40" fill="#00c684">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
              <h3>Fast Working Capital</h3>
              <p>Same-day approvals and flexible terms built for growth.</p>
              <Link href="/loan-programs/working-capital-loans" className="feature-link">Explore &rarr;</Link>
            </div>

            <div className="feature-box">
              <svg width="40" height="40" fill="#00c684">
                <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v2H2V7zm0 4h20v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6zm4 5h4v-2H6v2z" />
              </svg>
              <h3>Business Line of Credit</h3>
              <p>Draw what you need &amp; only pay when you use it.</p>
              <Link href="/loan-programs/business-line-of-credit" className="feature-link">Learn More &rarr;</Link>
            </div>

            <div className="feature-box">
              <svg width="38" height="38" fill="#00c684">
                <path d="M3 3h18v4H3V3zm2 6h14l1 12H4L5 9zm4 2v8m4-8v8" />
              </svg>
              <h3>Equipment Financing</h3>
              <p>Upgrade or expand without draining your cash flow.</p>
              <Link href="/loan-programs/equipment-financing" className="feature-link">View Options &rarr;</Link>
            </div>

          </div>
        </div>
      </section>

      {/* NO COLLATERAL */}
      <section className="performance-approval">
        <div className="container two-col">

          <div className="copy-col">
            <h2>Approved on Performance, Not Property</h2>
            <p>
              Most great businesses don&apos;t start with real estate or equipment.
              They start with revenue, momentum, and ambition.
            </p>
            <p>
              That&apos;s why our underwriting focuses on performance &mdash; not collateral.
              Same-day decisions. Flexible terms. No credit impact.
            </p>
            <Link href="/apply" className="btn-primary">Check Your Funding Options &rarr;</Link>
          </div>

          <div className="image-col">
            <img
              src="/hero/sba-loans.png"
              alt="Loan approved for small business owner"
              loading="lazy"
            />
          </div>

        </div>
      </section>

      {/* RESULTS */}
      <section className="home-results">
        <div className="container">
          <div className="home-results__inner">
            <h2>Proven Funding Performance</h2>
            <p className="home-results__lead">
              Over 90% approval success across industries nationwide.
            </p>
            <div className="home-results__stats">
              <div className="home-stat-card">
                <div className="home-stat-card__icon">150+</div>
                <p>Private Lending Partners</p>
              </div>
              <div className="home-stat-card">
                <div className="home-stat-card__icon">90%</div>
                <p>Approval Rate</p>
              </div>
              <div className="home-stat-card">
                <div className="home-stat-card__icon">1.5x</div>
                <p>Better Average Terms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="home-proof">
        <div className="container">
          <div className="home-proof__inner">

            <h2>Real Businesses. Real Funding.</h2>
            <p className="home-proof__lead">
              Business owners across the country trust us to move fast when it matters.
            </p>

            <div className="home-proof__grid">

              <div className="proof-card">
                <p className="proof-quote">
                  &ldquo;We were approved the same day and funded within 24 hours.
                  No collateral, no headaches &mdash; just real support.&rdquo;
                </p>
                <div className="proof-meta">
                  <strong>James R.</strong>
                  <span>Construction Company &middot; Texas</span>
                </div>
              </div>

              <div className="proof-card">
                <p className="proof-quote">
                  &ldquo;Banks kept saying no. These guys actually looked at our revenue
                  and made it happen. Huge difference.&rdquo;
                </p>
                <div className="proof-meta">
                  <strong>Melissa T.</strong>
                  <span>Retail Business &middot; California</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* TOP CITIES */}
      <section className="home-top-cities">
        <div className="container">
          <div className="home-top-cities__inner">
            <span className="section-eyebrow">Funding by city</span>
            <h2>Small Business Loans by City</h2>
            <p className="home-top-cities__lead">
              Fast funding for small businesses in every major U.S. city.
              Find working capital, equipment financing, and flexible credit
              lines near you.
            </p>
            <div className="home-top-cities__grid">
              {TOP_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/state-loans/${city.state}/${city.slug}`}
                  className="home-top-cities__chip"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="home-top-cities__cta">
              <Link href="/state-loans" className="home-top-cities__link">
                Browse all cities and states &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-final-cta full-bleed">
        <div className="container">
          <div className="home-final-cta__inner">
            <h2>Ready to Get Funded?</h2>
            <p>No impact to credit. Offers and decisions in as little as 2 hours.</p>
            <div className="home-final-cta__actions">
              <Link href="/apply" className="btn-primary final">
                Get Approved Today
              </Link>
            </div>
            <div className="form-microcopy">
              Takes under 2 minutes. No obligation. No impact on personal credit.
            </div>
            <p className="home-final-cta__phone">
              Prefer to talk? <a href="tel:18889008979">(888) 900-8979</a>
            </p>
          </div>
        </div>
      </section>

      {/* STATE FUNDING */}
      <section className="state-funding pro" aria-label="Funding by state">
        <div className="container">
          <div className="state-funding__inner">
            <h2>Funding Available in All 50 States</h2>
            <p className="state-funding__lead">
              Find fast working capital, equipment financing, and business credit
              lines in every U.S. state.{" "}
              <Link href="/state-loans">Browse state funding programs &rarr;</Link>
            </p>

            <div className="state-search">
              <input
                type="text"
                id="stateSearch"
                placeholder="Search for your state..."
                aria-label="Search for your state"
              />
              <div
                id="state-suggestions"
                className="state-suggestions"
                aria-live="polite"
              />
            </div>

            <div className="state-alpha" aria-label="Filter states by starting letter">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                <button
                  key={letter}
                  type="button"
                  className="alpha-btn"
                  aria-label={`Filter states starting with ${letter}`}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div id="state-recent-row" className="state-recent-row" aria-label="Recently viewed states" />

            <p id="state-empty-message" className="state-empty-message" style={{ display: "none" }}>
              No states match that search yet. Try another name, abbreviation, or pick a letter above.
            </p>

            <div className="state-pro-grid">
              <div className="state-pro-card" data-region="west">
                <div className="state-pro-card__header">
                  <h3>West</h3>
                  <p>High-growth hubs and coastal markets.</p>
                </div>
                <ul>
                  <li><Link href="/state-loans/alaska">Alaska</Link></li>
                  <li><Link href="/state-loans/arizona">Arizona</Link></li>
                  <li><Link href="/state-loans/california">California</Link></li>
                  <li><Link href="/state-loans/colorado">Colorado</Link></li>
                  <li><Link href="/state-loans/hawaii">Hawaii</Link></li>
                  <li><Link href="/state-loans/idaho">Idaho</Link></li>
                  <li><Link href="/state-loans/montana">Montana</Link></li>
                  <li><Link href="/state-loans/nevada">Nevada</Link></li>
                  <li><Link href="/state-loans/new-mexico">New Mexico</Link></li>
                  <li><Link href="/state-loans/oregon">Oregon</Link></li>
                  <li><Link href="/state-loans/utah">Utah</Link></li>
                  <li><Link href="/state-loans/washington">Washington</Link></li>
                  <li><Link href="/state-loans/wyoming">Wyoming</Link></li>
                </ul>
              </div>

              <div className="state-pro-card" data-region="midwest">
                <div className="state-pro-card__header">
                  <h3>Midwest</h3>
                  <p>Manufacturing, logistics, and Main Street businesses.</p>
                </div>
                <ul>
                  <li><Link href="/state-loans/illinois">Illinois</Link></li>
                  <li><Link href="/state-loans/indiana">Indiana</Link></li>
                  <li><Link href="/state-loans/iowa">Iowa</Link></li>
                  <li><Link href="/state-loans/kansas">Kansas</Link></li>
                  <li><Link href="/state-loans/michigan">Michigan</Link></li>
                  <li><Link href="/state-loans/minnesota">Minnesota</Link></li>
                  <li><Link href="/state-loans/missouri">Missouri</Link></li>
                  <li><Link href="/state-loans/nebraska">Nebraska</Link></li>
                  <li><Link href="/state-loans/north-dakota">North Dakota</Link></li>
                  <li><Link href="/state-loans/ohio">Ohio</Link></li>
                  <li><Link href="/state-loans/south-dakota">South Dakota</Link></li>
                  <li><Link href="/state-loans/wisconsin">Wisconsin</Link></li>
                </ul>
              </div>

              <div className="state-pro-card" data-region="south">
                <div className="state-pro-card__header">
                  <h3>South</h3>
                  <p>Growth markets, franchises, and service operators.</p>
                </div>
                <ul>
                  <li><Link href="/state-loans/alabama">Alabama</Link></li>
                  <li><Link href="/state-loans/arkansas">Arkansas</Link></li>
                  <li><Link href="/state-loans/florida">Florida</Link></li>
                  <li><Link href="/state-loans/georgia">Georgia</Link></li>
                  <li><Link href="/state-loans/kentucky">Kentucky</Link></li>
                  <li><Link href="/state-loans/louisiana">Louisiana</Link></li>
                  <li><Link href="/state-loans/maryland">Maryland</Link></li>
                  <li><Link href="/state-loans/mississippi">Mississippi</Link></li>
                  <li><Link href="/state-loans/north-carolina">North Carolina</Link></li>
                  <li><Link href="/state-loans/oklahoma">Oklahoma</Link></li>
                  <li><Link href="/state-loans/south-carolina">South Carolina</Link></li>
                  <li><Link href="/state-loans/tennessee">Tennessee</Link></li>
                  <li><Link href="/state-loans/texas">Texas</Link></li>
                  <li><Link href="/state-loans/virginia">Virginia</Link></li>
                  <li><Link href="/state-loans/west-virginia">West Virginia</Link></li>
                </ul>
              </div>

              <div className="state-pro-card" data-region="northeast">
                <div className="state-pro-card__header">
                  <h3>Northeast</h3>
                  <p>Professional services, retail, and coastal markets.</p>
                </div>
                <ul>
                  <li><Link href="/state-loans/connecticut">Connecticut</Link></li>
                  <li><Link href="/state-loans/delaware">Delaware</Link></li>
                  <li><Link href="/state-loans/maine">Maine</Link></li>
                  <li><Link href="/state-loans/massachusetts">Massachusetts</Link></li>
                  <li><Link href="/state-loans/new-hampshire">New Hampshire</Link></li>
                  <li><Link href="/state-loans/new-jersey">New Jersey</Link></li>
                  <li><Link href="/state-loans/new-york">New York</Link></li>
                  <li><Link href="/state-loans/pennsylvania">Pennsylvania</Link></li>
                  <li><Link href="/state-loans/rhode-island">Rhode Island</Link></li>
                  <li><Link href="/state-loans/vermont">Vermont</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StateFilter />

      {/* FAQ */}
      <section className="home-faq">
        <div className="container">

          <FaqAccordion />

          <Script
            id="faq-schema"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />

          <div className="home-faq__inner">

            <h2>Common Questions Before Applying</h2>

            <div className="faq-item">
              <button className="faq-question">
                Will this affect my credit?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  No. Checking your options does <strong>not impact your credit score</strong>.
                  We use soft checks and revenue-based review &mdash; not hard inquiries.
                </p>
              </div>
            </div>

            <div className="faq-item">
              <button className="faq-question">
                How fast can I get approved?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Most businesses receive decisions in as little as <strong>2 hours</strong>,
                  with funding available as soon as <strong>24-48 hours</strong> after approval.
                </p>
              </div>
            </div>

            <div className="faq-item">
              <button className="faq-question">
                Do I need collateral or perfect credit?
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  No collateral required. Approval is based on
                  <strong> business revenue and cash flow</strong>, not just credit score.
                </p>
              </div>
            </div>

            <div className="faq-callout">
              <h3>Prefer to Talk It Through?</h3>
              <p>
                Have a quick question before applying?{" "}
                <strong>Speak with a funding specialist</strong> &mdash; no pressure, no obligation.
              </p>
              <a href="tel:18889008979" className="faq-callout__cta">
                Call (888) 900-8979
              </a>
              <span className="faq-callout__meta">
                Typical wait time under 2 minutes during business hours.
              </span>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
