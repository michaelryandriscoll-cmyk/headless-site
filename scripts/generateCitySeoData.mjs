// scripts/generateCitySeoData.mjs
// Node script to generate SEO JSON for every state + city in stateCityMap

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your map (adjust path if needed)
import stateCityMap from "../app/lib/stateCityMap.js";

const OUTPUT_DIR = path.join(__dirname, "..", "data", "city-loans");

// Basic helpers
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

function buildCitySeo(stateKey, stateObj, cityObj) {
  const stateName = stateObj.stateName;
  const cityName = cityObj.name;
  const citySlug = cityObj.slug;

  const title = `${cityName} Small Business Loans (${stateName}) | Small Business Capital`;
  const metaDescription = `Get fast ${cityName}, ${stateName} small business funding. Same-day approvals, working capital, equipment financing and business lines of credit with flexible terms.`;

  const h1 = `${cityName}, ${stateName} Small Business Loans`;
  const heroIntro = `Access fast, flexible business funding in ${cityName}, ${stateName}. We connect local businesses with a national network of private lenders for working capital, equipment financing and revolving credit lines — without the slow, collateral-heavy process of traditional banks.`;

  const cityOverview = [
    `Whether you run a restaurant near downtown ${cityName}, manage a growing trades business, or operate a professional services firm, access to reliable capital is critical. Our lending partners evaluate real revenue and cash flow — not just collateral — to help your business stay ahead of payroll, inventory, and growth opportunities.`,
    `Because we work with a national network of lenders, ${cityName} businesses can compare multiple offers side-by-side, choose terms that fit their cash flow, and secure funding without spending weeks chasing bank approvals.`,
  ];

  const loanUseCases = [
    `Bridge cash flow while waiting on invoices or seasonal revenue in ${cityName}.`,
    `Purchase or upgrade equipment, vehicles, or specialized tools for your business.`,
    `Renovate your location, open a new branch, or expand your service area in ${stateName}.`,
    `Buy inventory in bulk to secure better pricing and higher margins.`,
    `Cover payroll, marketing campaigns, or contractor costs during growth pushes.`,
  ];

  const comparisonBlock = {
    heading: `Why ${cityName} Businesses Use Private Lending vs. Banks`,
    bullets: [
      `Banks often require real estate or hard collateral — many ${cityName} business owners don’t have or don’t want to risk it.`,
      `Traditional underwriting can take weeks; our network can issue decisions in as little as 2–24 hours.`,
      `Programs are built around real revenue and deposits, not just credit scores.`,
      `Flexible renewals and top-up options keep funding available as your ${cityName} business grows.`,
    ],
  };

  const faqs = [
    {
      question: `How fast can I get funded in ${cityName}?`,
      answer: `Many ${cityName} businesses receive same-day approvals and can be funded in as little as 24–48 hours once documents are complete. Timing depends on your industry, revenue consistency, and the specific program selected.`,
    },
    {
      question: `What credit score do I need for a small business loan in ${cityName}?`,
      answer: `Our lending network looks at more than just credit scores. While stronger credit can unlock better rates and terms, we also consider time-in-business, monthly revenue, and recent banking activity for ${cityName} companies.`,
    },
    {
      question: `Do I need collateral to qualify for funding in ${cityName}?`,
      answer: `Most programs we arrange for ${cityName}, ${stateName} businesses do not require traditional real estate collateral. Many are based on cash flow, receivables, or business performance instead.`,
    },
    {
      question: `Can startups in ${cityName} qualify for funding?`,
      answer: `Some programs require at least 6–12 months in business, but certain lenders may consider younger ${cityName} businesses with strong personal credit, contracts, or documented revenue projections.`,
    },
  ];

  const reviewBlock = {
    rating: 4.9,
    reviewCount: 248,
    exampleReviews: [
      {
        authorType: "Restaurant Owner",
        text: `“We expanded our ${cityName} location without putting our home up as collateral. Funding was fast and the terms were clear.”`,
      },
      {
        authorType: "Trades & Services",
        text: `“Equipment financing helped us add another crew and take on more jobs across ${stateName}. Application was straightforward.”`,
      },
    ],
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `${cityName} Small Business Loans`,
    areaServed: `${cityName}, ${stateName}`,
    serviceType: "Working Capital, Equipment Financing, Credit Lines",
    provider: {
      "@type": "Organization",
      name: "Small Business Capital",
      url: "https://smallbusiness.capital",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "248",
    },
    review: [
      {
        "@type": "Review",
        author: "Local Café Owner",
        reviewBody:
          "Fast funding and great communication — we were approved in 36 hours!",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
      },
      {
        "@type": "Review",
        author: "Logistics Company",
        reviewBody: "Equipment financing helped us scale quickly.",
        reviewRating: { "@type": "Rating", ratingValue: "5" },
      },
    ],
  };

  return {
    stateKey,
    stateName,
    cityName,
    citySlug,
    title,
    metaDescription,
    h1,
    heroIntro,
    cityOverview,
    loanUseCases,
    comparisonBlock,
    faqs,
    reviewBlock,
    schemaOrg,
  };
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function safeFileName(stateKey, citySlug) {
  return `${stateKey}__${citySlug}.json`;
}

async function main() {
  ensureDirExists(OUTPUT_DIR);

  let count = 0;

  for (const [stateKey, stateObj] of Object.entries(stateCityMap)) {
    if (!stateObj?.cities || !Array.isArray(stateObj.cities)) continue;

    for (const city of stateObj.cities) {
      const data = buildCitySeo(stateKey, stateObj, city);
      const fileName = safeFileName(stateKey, city.slug);
      const filePath = path.join(OUTPUT_DIR, fileName);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      count++;
    }
  }

  console.log(`✅ Generated SEO data for ${count} city pages into ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("❌ Error generating city SEO data:", err);
  process.exit(1);
});// JavaScript Document