// app/state-loans/[state]/[city]/page.js
import "@/app/styles/state-loans.css";

import Link from "next/link";
import stateCityMap from "@/app/lib/stateCityMap";
import industries from "@/app/lib/_industryList25";
import { getIndustryOrder } from "@/app/lib/getIndustryOrder";
import IntentCTAClient from "@/app/components/IntentCTAClient";

export const dynamic = "force-static";

const normalizeSlug = (slug = "") => slug.toLowerCase().trim();

const titleCase = (str = "") =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).trim();

export async function generateStaticParams() {
  const params = [];
  Object.keys(stateCityMap).forEach((state) => {
    const S = stateCityMap[state];
    (S?.cities || []).forEach((c) => {
      params.push({ state, city: c.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }) {
  const p = await params;
  const stateSlug = normalizeSlug(p?.state);
  const citySlug = normalizeSlug(p?.city);

  const S = stateCityMap[stateSlug];
  const C = S?.cities?.find((c) => c.slug === citySlug);

  if (!S || !C) {
    return {
      title: "City Business Loans | Small Business Capital",
      description: "Explore fast working capital, equipment financing and business credit lines by city and industry.",
    };
  }

  return {
    title: `${C.name} Small Business Loans | Funding Options & Industries`,
    description: `Explore working capital, equipment financing, and business credit lines in ${C.name}, ${S.stateName}. Compare funding options by industry.`,
    alternates: {
      canonical: `https://smallbusiness.capital/state-loans/${stateSlug}/${citySlug}`,
    },
  };
}

export default async function CityLoansPage({ params }) {
  const p = await params;
  const stateSlug = normalizeSlug(p?.state || "");
  const citySlug = normalizeSlug(p?.city || "");

  const S = stateCityMap[stateSlug];
  if (!S) return <main className="city-loan-page"><h1>State Not Found</h1></main>;

  const C = S.cities.find((c) => c.slug === citySlug);
  if (!C) return <main className="city-loan-page"><h1>City Not Found</h1></main>;

  const cityName = C.name;
  const cityHref = `/state-loans/${stateSlug}/${C.slug}`;

  const credit = S?.creditScore || "580+ (varies by program)";
  const speed = S?.processingTime || "24–72 Hours";
  const terms = S?.terms || "6–24 Months";

  const popularityOrder = getIndustryOrder({ state: stateSlug, city: citySlug }) || [];

  const availableIndustries = (industries || [])
    .filter((i) => i?.slug)
    .sort((a, b) => {
      const ai = popularityOrder.indexOf(a.slug);
      const bi = popularityOrder.indexOf(b.slug);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .map((i) => ({
      slug: i.slug,
      label: i.label || i.industry || titleCase(i.slug),
    }));

  const industryGroups = [
    {
      label: "Construction & Trades",
      slugs: ["roofing", "construction", "plumbing", "electrician", "hvac", "landscaping", "general-contractors"],
    },
    {
      label: "Food & Hospitality",
      slugs: ["restaurants", "food-truck", "food-services", "salon-spa"],
    },
    {
      label: "Professional & Business Services",
      slugs: ["professional-services", "franchise", "nonprofit", "real-estate", "ecommerce", "technology", "wholesale", "manufacturing"],
    },
    {
      label: "Retail & Consumer",
      slugs: ["retail", "auto-repair", "cleaning", "childcare", "fitness", "pharmacy", "medical"],
    },
  ];

  const faqs = [
    { q: `How fast can I get a business loan in ${cityName}?`, a: `Many funding options offer same-day approval, with funding often available within ${speed}.` },
    { q: `What credit score is needed to qualify?`, a: `Some programs start around ${credit}, but approval also depends on revenue and cash flow.` },
    { q: `Do I need collateral?`, a: `Not always. Many working capital and line-of-credit programs are unsecured.` },
    { q: `Can newer businesses qualify for funding?`, a: `Yes. Some lenders work with newer businesses if revenue is consistent.` },
    { q: `What can business funding be used for?`, a: `Payroll, equipment, inventory, marketing, repairs, and expansion.` },
    { q: `Will applying affect my credit?`, a: `Initial qualification often uses a soft pull or no-impact review.` },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="city-loan-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="city-header" id="overview">
        <h1>{cityName} Small Business Loans</h1>
        <p>Compare working capital, equipment financing, and business credit lines available in {cityName}, {S.stateName}.</p>
      </header>

      <nav className="city-sticky-nav" aria-label="City page navigation">
        <a href="#overview">Overview</a>
        <a href="#industries">Industries</a>
        <a href="#faq">FAQ</a>
        <a href="#apply" className="cta">Apply</a>
      </nav>

      <section className="loan-stats">
        <p><strong>Min Credit:</strong> {credit}</p>
        <p><strong>Speed:</strong> {speed}</p>
        <p><strong>Terms:</strong> {terms}</p>
      </section>

      <section className="seo-silo" id="industries">
        <h2>{cityName} Business Loans by Industry</h2>
        <p>Select your industry to explore targeted funding options.</p>
        {industryGroups.map((group) => {
          const groupIndustries = group.slugs
            .map((s) => availableIndustries.find((i) => i.slug === s))
            .filter(Boolean);
          if (!groupIndustries.length) return null;
          return (
            <div key={group.label} className="industry-group">
              <h3 className="industry-group__label">{group.label}</h3>
              <ul className="industry-group__list">
                {groupIndustries.map((ind) => (
                  <li key={ind.slug}>
                    <Link href={`${cityHref}/industry/${ind.slug}`}>{ind.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="seo-silo" id="faq">
        <h2>{cityName} Business Loans FAQ</h2>
        <div className="state-city-grid">
          {faqs.map((f) => (
            <div key={f.q} className="state-city-card">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="city-cta" id="apply">
        <h2>Start Your {cityName} Funding Review</h2>
        <p>One application. Multiple lenders. Fast decisions.</p>
        <Link href="/apply" className="cta-apply-btn">Start Online Application</Link>
        <a href="tel:18883657999" className="cta-call-btn">Speak With a Funding Advisor</a>
      </section>

      <IntentCTAClient city={cityName} state={S.stateName} variant="city" />
    </main>
  );
}