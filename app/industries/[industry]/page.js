// app/industries/[industry]/page.js

import "@/app/city-loans.css";
import "@/app/styles/industries.css";
import "@/app/styles/industry-detail.css";
// ← state-loans.css removed — was overriding city-loans.css

import { notFound } from "next/navigation";
import Link from "next/link";
import industries from "@/app/lib/_industryList25";

export const dynamic = "force-dynamic";

/* --------------------------------------------
   Helpers
-------------------------------------------- */

const titleCase = (str = "") =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const safeSlug = (val = "") =>
  val?.toLowerCase().trim().replace(/^\/+|\/+$/g, "");

/* --------------------------------------------
   Static Params
-------------------------------------------- */

export async function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

/* --------------------------------------------
   Metadata
-------------------------------------------- */

export async function generateMetadata({ params }) {
  const { industry } = await params;
  const slug = safeSlug(industry);
  const industryData = industries.find((i) => i.slug === slug);

  if (!industryData) {
    return { title: "Industry Business Loans | Small Business Capital" };
  }

  return {
    title: `${industryData.industry} Business Loans | Funding Options`,
    description: `Compare working capital, equipment financing, and credit line options for ${industryData.industry.toLowerCase()} businesses nationwide.`,
  };
}

/* --------------------------------------------
   Page
-------------------------------------------- */

export default function IndustryPage({ params }) {
  const slug = safeSlug(params.industry);
  const industryData = industries.find((i) => i.slug === slug);

  if (!industryData) notFound();

  const {
    industry,
    title,
    introTemplates,
    bestForCore = [],
    bestForExtras = [],
    stats = {},
  } = industryData;

  const credit = stats?.credit || "580+";
  const speed  = stats?.speed  || "24–72 Hours";
  const terms  = stats?.terms  || "6–24 Months";

  const intro =
    introTemplates?.[0]
      ?.replace("{{city}}", "your area")
      ?.replace("{{state}}", "your state") ||
    `Flexible funding options available for ${industry} businesses.`;

  const allUses = [...bestForCore, ...bestForExtras];

  return (
    <main className="industry-detail-page">

      {/* ── HERO ── */}
      <header className="idp-hero">
        <div className="idp-hero__inner">
          <span className="section-eyebrow">BUSINESS FUNDING</span>
          <h1>{industry} Business Loans</h1>
          <p>{intro}</p>
          <div className="idp-hero__cta">
            <a href="#cta" className="btn-primary">
              Check Your Funding Options
            </a>
            <span className="btn-muted">Takes 2 minutes</span>
          </div>
        </div>
      </header>

      {/* ── STATS STRIP ── */}
      <section className="idp-stats">
        <div className="idp-stats__inner">
          <div className="idp-stat">
            <strong>{credit}</strong>
            <span>Min Credit Score</span>
          </div>
          <div className="idp-stat">
            <strong>{speed}</strong>
            <span>Funding Speed</span>
          </div>
          <div className="idp-stat">
            <strong>$10K–$500K</strong>
            <span>Funding Range</span>
          </div>
          <div className="idp-stat">
            <strong>{terms}</strong>
            <span>Typical Terms</span>
          </div>
        </div>
      </section>

      {/* ── BEST USES ── */}
      {allUses.length > 0 && (
        <section className="idp-section bg-white">
          <div className="idp-inner">
            <span className="section-eyebrow">BEST USES</span>
            <h2>Common Uses of {industry} Financing</h2>
            <div className="idp-use-grid">
              {allUses.map((item, i) => (
                <div key={i} className="idp-use-card">
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCAL FUNDING ── */}
      <section className="idp-local">
        <div className="idp-inner">
          <div className="idp-local__content">
            <div>
              <span className="section-eyebrow">LOCAL FUNDING</span>
              <h2>Find {industry} Loans in Your State</h2>
              <p>
                Funding availability and approval requirements vary by state
                and city. Select your location to see local lenders, rates,
                and programs available in your market.
              </p>
              <Link href="/state-loans" className="btn-primary">
                Browse State Loan Pages →
              </Link>
            </div>
            <div className="idp-local__stats">
              <div className="idp-local__stat">
                <strong>50</strong>
                <span>States covered</span>
              </div>
              <div className="idp-local__stat">
                <strong>500+</strong>
                <span>Cities available</span>
              </div>
              <div className="idp-local__stat">
                <strong>24hr</strong>
                <span>Typical decision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="idp-cta" id="cta">
        <div className="idp-cta__inner">
          <h2>Compare {industry} Funding Options</h2>
          <p>One application. Multiple lenders. Fast decisions.</p>
          <div className="idp-cta__buttons">
            <Link href="/apply" className="btn-primary">
              Start Online Application
            </Link>
            <a href="tel:18883657999" className="btn-outline">
              Speak With a Funding Specialist
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
