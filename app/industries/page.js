// app/industries/page.js
import "@/app/styles/industries.css";
import "@/app/city-loans.css";
import Link from "next/link";
import industries from "@/app/lib/_industryList25";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Business Loans by Industry | Small Business Capital",
  description:
    "Explore business loan options by industry. Compare funding programs for contractors, restaurants, medical practices, retail, and more.",
};

// Short descriptors for each industry — replaces the duplicate title
const industryDescriptors = {
  "auto-repair":            "Fleet & shop financing",
  "childcare":              "Working capital & equipment",
  "cleaning":               "Growth & payroll funding",
  "construction":           "Equipment & project capital",
  "ecommerce":              "Inventory & ad spend",
  "electrician":            "Tools, vans & payroll",
  "fitness":                "Equipment & expansion",
  "food-service":           "Kitchen, staff & supplies",
  "food-truck":             "Vehicle & startup costs",
  "franchise":              "Build-out & working capital",
  "general-contractors":    "Materials & subcontractor pay",
  "hvac":                   "Vans, tools & seasonal gaps",
  "landscaping":            "Equipment & crew costs",
  "manufacturing":          "Machinery & operations",
  "medical":                "Equipment & practice growth",
  "nonprofit":              "Bridge & program funding",
  "pharmacy":               "Inventory & compliance costs",
  "plumbing":               "Vans, parts & payroll",
  "professional-services":  "Cash flow & growth capital",
  "real-estate":            "Bridge loans & renovations",
  "restaurants":            "Equipment, staff & supplies",
  "retail":                 "Inventory & seasonal capital",
  "roofing":                "Materials & crew financing",
  "salon-spa":              "Equipment & buildout",
  "solar":                  "Panels, install & cash flow",
  "technology":             "R&D, payroll & growth",
  "trucking":               "Fleet, fuel & maintenance",
  "wholesale":              "Inventory & fulfillment",
};

export default function IndustriesHubPage() {
  const sortedIndustries = [...industries].sort((a, b) =>
    (a.label || a.industry || "").localeCompare(b.label || b.industry || "")
  );

  return (
    <main className="industries-hub">

      {/* ── HERO ── */}
      <header className="ihub-hero">
        <div className="ihub-hero__inner">
          <span className="section-eyebrow">FUNDING BY INDUSTRY</span>
          <h1>Business Loans by Industry</h1>
          <p>
            Select your industry to explore funding programs, approval
            requirements, and real-world use cases — working capital, credit
            lines, equipment financing and more.
          </p>
        </div>
      </header>

      {/* ── GRID ── */}
      <section className="ihub-grid-section">
        <div className="ihub-grid-inner">
          <div className="ihub-grid-header">
            <h2>Select Your Industry</h2>
            <span className="ihub-count">{sortedIndustries.length} industries</span>
          </div>
          <div className="ihub-grid">
            {sortedIndustries.map((ind) => {
              const slug = ind.slug;
              const label = ind.label || ind.industry;
              const descriptor = industryDescriptors[slug] || "Funding options available";
              return (
                <Link key={slug} href={`/industries/${slug}`} className="ihub-card">
                  <div className="ihub-card__body">
                    <span className="ihub-card__name">{label}</span>
                    <span className="ihub-card__desc">{descriptor}</span>
                  </div>
                  <span className="ihub-card__arrow">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ihub-cta">
        <div className="ihub-cta__inner">
          <h2>Not Sure Which Program Fits?</h2>
          <p>
            Submit one application and compare multiple funding offers tailored
            to your industry.
          </p>
          <div className="ihub-cta__buttons">
            <Link href="/apply" className="btn-primary">
              Start Online Application
            </Link>
            <a href="tel:18883657999" className="btn-outline">
              Speak With a Funding Advisor
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
