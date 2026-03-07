"use client";

import { useEffect } from "react";
import "@/app/city-loans.css";
import "@/app/styles/state-loans.css";
import LeadForm from "@/components/LeadForm";
import Link from "next/link";
import Image from "next/image";

import { getIndustryImages } from "@/app/lib/industryImages";
import { getIndustryTestimonials } from "@/app/lib/industryTestimonials";
import getRelatedIndustries from "@/app/lib/getRelatedIndustries";
import getNearbyCities from "@/app/lib/getNearbyCities";

/* ---------------------------------------------------------
   Contractor Industry Cluster (GLOBAL CONSTANT)
--------------------------------------------------------- */
const CONTRACTOR_CLUSTER = [
  "hvac",
  "roofing",
  "plumbing",
  "electrician",
  "solar",
  "general-contractors",
];

export default function IndustryCityTemplate({
  city = "",
  citySlug = "",
  state = "",
  stateSlug = "",
  industry = "",
  industrySlug = "",
  intro = "",
  bestFor = [],
  stats = {},
}) {

  /* ---------------------------------------------------------
     Utilities
  --------------------------------------------------------- */

  const safeString = (val, fallback = "") => {
    if (typeof val === "string") return val;
    if (val == null) return fallback;
    try {
      return JSON.stringify(val);
    } catch {
      return fallback;
    }
  };

  const safeSlug = (val = "") => {
    if (!val || typeof val !== "string") return "";
    return val.toLowerCase().trim().replace(/^\/+|\/+$/g, "");
  };

  const titleCase = (str = "") =>
    str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()).trim();

  const cleanSlug = (str = "") =>
    titleCase(str.replace(/-business-loans?$/i, "").replace(/-loans?$/i, ""));


  /* ---------------------------------------------------------
     Stats
  --------------------------------------------------------- */

  const credit = safeString(stats.credit, "580+");
  const speed = safeString(stats.speed, "24–72 Hours");
  const terms = safeString(stats.terms, "6–24 Months");

  const quickSummary = `Typical approvals from ${credit} credit, with funding often in ${speed
    .toLowerCase()
    .trim()} and terms around ${terms.toLowerCase().trim()}.`;


  /* ---------------------------------------------------------
     Industry Key Mapping
  --------------------------------------------------------- */

  const rawIndustry = industry?.toLowerCase() || "";

  const industryKey =
    rawIndustry.includes("roof")
      ? "roofing"
      : rawIndustry.includes("hvac")
      ? "hvac"
      : rawIndustry.includes("plumb")
      ? "plumbing"
      : rawIndustry.includes("electric")
      ? "electrician"
      : rawIndustry.includes("landscap")
      ? "landscaping"
      : rawIndustry.includes("clean")
      ? "cleaning"
      : rawIndustry.includes("solar")
      ? "solar"
      : rawIndustry.includes("general")
      ? "general-contractors"
      : rawIndustry.replace(/ business loans?/g, "").replace(/\s+/g, "-");

  const computedIndustrySlug = safeSlug(industryKey);


  /* ---------------------------------------------------------
     Canonical Slugs
  --------------------------------------------------------- */

  const finalStateSlug =
    safeSlug(stateSlug) || safeSlug(state.replace(/\s+/g, "-"));

  const finalCitySlug =
    safeSlug(citySlug) || safeSlug(city.replace(/\s+/g, "-"));

  const finalIndustrySlug = safeSlug(industrySlug) || computedIndustrySlug;


  /* ---------------------------------------------------------
     Nearby Cities
  --------------------------------------------------------- */

  const nearbyCities = getNearbyCities({
    stateSlug: finalStateSlug,
    citySlug: finalCitySlug,
    max: 4,
  });


  /* ---------------------------------------------------------
     Contractor Industries
  --------------------------------------------------------- */

  const contractorIndustries = CONTRACTOR_CLUSTER
    .filter((i) => i !== finalIndustrySlug)
    .slice(0, 4);
	  
/* ---------------------------------------------------------
   Related Industries
--------------------------------------------------------- */

const relatedIndustries = [...new Set(getRelatedIndustries({
  state: finalStateSlug,
  city: finalCitySlug,
  industry: finalIndustrySlug,
  max: 4,
}))];

  /* ---------------------------------------------------------
     Testimonials
  --------------------------------------------------------- */

  const testimonials = getIndustryTestimonials(industryKey);


  /* ---------------------------------------------------------
     Industry Images
  --------------------------------------------------------- */

  const industryImages = getIndustryImages(finalIndustrySlug, city, state);

  /* ---------------------------------------------------------
   Best For Normalization
--------------------------------------------------------- */

const normalizedBestForObjects = Array.isArray(bestFor)
  ? bestFor
      .map((item) => {
        if (typeof item === "string") {
          return { label: item, type: "core" };
        }

        if (item?.label) {
          return item;
        }

        return null;
      })
      .filter(Boolean)
  : [];
  const coreUses = normalizedBestForObjects.filter((i) => i.type !== "growth");
  const growthUses = normalizedBestForObjects.filter((i) => i.type === "growth");
  const hasSplit = coreUses.length && growthUses.length;
  const hasAnyBestFor = normalizedBestForObjects.length > 0;


  /* ---------------------------------------------------------
     JSON-LD
  --------------------------------------------------------- */

  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${city} ${industry} Business Loans`,
    areaServed: `${city}, ${state}`,
    provider: {
      "@type": "Organization",
      name: "Small Business Capital",
    },
  };

  return (
    <main className="city-loan-page">

      {/* ================= HERO ================= */}
      <header className="city-hero section-lg bg-white" id="top">
        <div className="section-inner hero-layout">

          <div className="hero-content">

            <span className="hero-tag">
              {city.toUpperCase()}, {state.toUpperCase()} • {industry.toUpperCase()}
            </span>

            <h1>
              Fast Funding for <span className="accent-text">{city}</span>{" "}
              {industry} Contractors
            </h1>

            <p className="hero-subtitle">
              Working capital, equipment financing, or a flexible line of credit —
              approved in 24–72 hours.
            </p>

            <div className="hero-cta-group">
              <a href="#lead-form" className="btn-primary">
                Check Your Funding Options
              </a>
              <span className="btn-muted">Takes 2 minutes</span>
            </div>

            <div className="hero-trust">
              <span>No obligation</span>
              <span>No credit impact</span>
              <span>Fast decisions</span>
            </div>

          </div>

        </div>
      </header>

      {/* ================= TRUST STRIP ================= */}
      <section className="trust-strip bg-dark section-sm">
        <div className="section-inner trust-strip-inner">
          <div className="trust-item">
            <strong>{credit}</strong>
            <span>Min Credit Score</span>
          </div>
          <div className="trust-item">
            <strong>{speed}</strong>
            <span>Funding Speed</span>
          </div>
          <div className="trust-item">
            <strong>$10K–$500K</strong>
            <span>Funding Range</span>
          </div>
          <div className="trust-item">
            <strong>{terms}</strong>
            <span>Typical Terms</span>
          </div>
        </div>
      </section>
  
  	  {/* ===================== STICKY MINI NAV ===================== */}
      <nav className="industry-sticky-nav" aria-label="On-page navigation">
        <a href="#overview">Overview</a>
        <a href="#lead-form">Apply</a>
        <a href="#best-for">Best Uses</a>
        <a href="#comparison">Compare</a>
        <a href="#related">Related</a>
        <a href="#reviews">Reviews</a>
        <a href="#faq">FAQ</a>
        <a href="#top" className="industry-sticky-nav__top">
          ↑ Top
        </a>
      </nav>

      {/* ===================== INDUSTRY IMAGES ===================== */}
      {industryImages?.length > 0 && (
        <section className="industry-images fade-in">
          <div className="industry-image-grid">
            {industryImages.map((img, i) => (
              <div key={i} className="industry-image">
                <div className="industry-image-frame">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="industry-image-img"
                    priority={i === 0} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= QUALIFY SECTION ================= */}
      <section id="overview" className="section-md bg-white">
        <div className="section-inner">
          <span className="section-eyebrow">WHO QUALIFIES</span>
  		  <h2>Need Funding for Your {industry} Business in {city}?</h2>

          <div className="qualify-grid">
            <div>✔ Approvals starting at 580+ credit</div>
            <div>✔ Funding from $10,000 to $500,000+</div>
            <div>✔ No collateral required for many programs</div>
            <div>✔ Same-week funding available</div>
          </div>

          <a href="#lead-form" className="btn-primary mt-32">
            Check Your Eligibility →
          </a>
        </div>
      </section>

      {/* ================= LEAD FORM ================= */}
      <section id="lead-form" className="section-lg bg-light">
        <div className="section-inner form-center">
          <div className="form-card">
            <h2>See Your {industry} Funding Options in {city}</h2>
            <p>
              Apply once to compare multiple funding offers — no impact to personal credit for initial review.
            </p>

            <LeadForm city={city} state={state} industry={industry} />

            <div className="form-trust">
              ✔ No obligation • ✔ No credit impact • ✔ Fast decisions
            </div>
          </div>
        </div>
      </section>

      {/* ================= BEST USES ================= */}
      {bestFor?.length > 0 && (
        <section id="best-for" className="section-md bg-white"> 
          <div className="section-inner">
            <span className="section-eyebrow">BEST USES</span>
  			<h2>Best Uses of Financing for {industry} Companies in {city}</h2>
            <div className="bestuse-grid">
              {bestFor.map((item, i) => (
                <div key={i} className="bestuse-card">
                  {typeof item === "string" ? item : item.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= TESTIMONIALS ================= */}
      {testimonials?.length > 0 && (
        <section id="reviews" className="section-lg bg-light">
          <div className="section-inner">
            <span className="section-eyebrow">REAL RESULTS</span>
   			<h2>Trusted by {industry} Businesses Across {city}</h2>
            <p className="section-subhead">
              Real businesses in {city}. Real results.
            </p>

            <div className="testimonial-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <p className="quote">“{t.quote}”</p>
                  <div className="author">
                    <strong>{t.author}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= COMPARISON ================= */}
      <section id="comparison" className="section-md bg-white">
        <div className="section-inner">
          <span className="section-eyebrow">PROGRAM COMPARISON</span>
  		  <h2>Loan Program Comparison</h2>

          <div className="comparison-table">
            <div className="row header">
              <div>Program</div>
              <div>Best For</div>
              <div>Funding Speed</div>
              <div>Terms</div>
            </div>

            <div className="row">
              <div>Working Capital</div>
              <div>Payroll, invoices, delays</div>
              <div><span className="pill">{speed}</span></div>
              <div>6–24 months</div>
            </div>

            <div className="row">
              <div>Business Line of Credit</div>
              <div>Seasonal swings</div>
              <div><span className="pill">2–7 Days</span></div>
              <div>Revolving</div>
            </div>

            <div className="row">
              <div>Equipment Financing</div>
              <div>Vehicles, tools</div>
              <div><span className="pill">3–7 Days</span></div>
              <div>12–72 months</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="faq-section section-md bg-light">
        <div className="section-inner">
          <span className="section-eyebrow">COMMON QUESTIONS</span>
  		  <h2>{industry} Loan FAQ – {city}</h2>
          <details><summary>How fast can we get approved?</summary><p>Most businesses receive decisions in 24–72 hours.</p></details>
          <details><summary>Will applying affect credit?</summary><p>No impact for initial review.</p></details>
          <details><summary>Do we need collateral?</summary><p>Many programs are unsecured.</p></details>
        </div>
      </section>
	  
      {/* ============================================================
         SEO INTERNAL LINKING BLOCKS
      ============================================================ */}

      <div className="seo-silo-group">

        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <section className="seo-silo mini">
            <div className="section-inner">
              <p className="silo-label">NEARBY CITIES</p>
              <ul className="silo-list mini">
                {nearbyCities.map((slug) => (
                  <li key={`nearby-${slug}`}>
                    <Link href={`/state-loans/${finalStateSlug}/${slug}/industry/${finalIndustrySlug}`}>
                      <span className="silo-arrow">›</span>{cleanSlug(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Related Contractors */}
        {contractorIndustries.length > 0 && (
          <section className="seo-silo mini">
            <div className="section-inner">
              <p className="silo-label">CONTRACTORS</p>
              <ul className="silo-list mini">
                {contractorIndustries.map((slug) => (
                  <li key={`contractor-${slug}`}>
                    <Link href={`/state-loans/${finalStateSlug}/${finalCitySlug}/industry/${slug}`}>
                      <span className="silo-arrow">›</span>{titleCase(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Related Industries */}
        {relatedIndustries.length > 0 && (
          <section className="seo-silo mini">
            <div className="section-inner">
              <p className="silo-label">RELATED INDUSTRIES</p>
              <ul className="silo-list mini">
                {relatedIndustries.map((slug) => (
                  <li key={`related-${slug}`}>
                    <Link href={`/state-loans/${finalStateSlug}/${finalCitySlug}/industry/${slug}`}>
                      <span className="silo-arrow">›</span>{titleCase(slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* State Hub */}
        <section className="seo-silo mini">
          <div className="section-inner">
            <p className="silo-label">STATE HUB</p>
            <ul className="silo-list mini">
              <li><Link href={`/state-loans/${finalStateSlug}/industry/${finalIndustrySlug}`}><span className="silo-arrow">›</span>{state} {industry}</Link></li>
              <li><Link href={`/state-loans/${finalStateSlug}`}><span className="silo-arrow">›</span>All {state} Loans</Link></li>
              <li><Link href="/industries"><span className="silo-arrow">›</span>All Industries</Link></li>
            </ul>
          </div>
        </section>

      </div>

	 {/* ===================== CTA ===================== */}
     <section className="city-cta">
	  <div className="section-inner text-center">
		<h2>
		  Get Matched with {city} {industry} Funding Options
		</h2>

		<p>
		  One quick application. Competitive offers. Fast approvals.
		</p>

		<div className="city-cta-buttons">
		  <Link href="/apply" className="btn-primary">
			Start Application
		  </Link>

		  <a href="tel:18883657999" className="btn-outline">
			Speak With a {industry} Funding Specialist
		  </a>
		</div>
	  </div>
	</section>
	  
	 

    </main>
  );
}