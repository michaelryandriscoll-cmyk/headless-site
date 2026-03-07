// scripts/generateIndustryCitySeoData.mjs
// Node script to generate SEO JSON for Industry x City pages

import fs from "node:fs/promises";
import path from "node:path";
import stateCityMap from "../app/lib/stateCityMap.js";
import { industries } from "../app/lib/industryConfig.js";

async function main() {
  const outDir = path.join(process.cwd(), "data", "industry-city-loans");

  await fs.mkdir(outDir, { recursive: true });

  const entries = [];

  for (const [stateSlug, stateConfig] of Object.entries(stateCityMap)) {
    const stateName = stateConfig.stateName;
    const cities = stateConfig.cities || [];

    for (const city of cities) {
      const cityName = city.name;
      const citySlug = city.slug;

      for (const industry of industries) {
        const key = `${stateSlug}__${citySlug}__${industry.slug}`;
        entries.push({ stateSlug, stateName, cityName, citySlug, industry });

        const seoData = {
          stateSlug,
          stateName,
          citySlug,
          cityName,
          industrySlug: industry.slug,
          industryLabel: industry.label,
          title: `${cityName} ${industry.shortName} Business Loans | ${stateName}`,
          description: `Compare ${industry.shortName.toLowerCase()} business loans, working capital and equipment financing available in ${cityName}, ${stateName}.`,
          h1: `${cityName} ${industry.shortName} Business Loans`,
          intro:
            `Access working capital, credit lines and equipment financing designed for ${industry.shortName.toLowerCase()} businesses in ${cityName}, ${stateName}.`,
          schema: {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: `${cityName} ${industry.shortName} Business Loans`,
            areaServed: `${cityName}, ${stateName}`,
            serviceType:
              "Working Capital, Business Line of Credit, Equipment Financing",
            provider: {
              "@type": "Organization",
              name: "Small Business Capital"
            },
            category: industry.label
          }
        };

        const filePath = path.join(outDir, `${key}.json`);
        await fs.writeFile(filePath, JSON.stringify(seoData, null, 2), "utf8");
      }
    }
  }

  console.log(
    `✅ Generated ${entries.length} industry-city SEO files into ${outDir}`
  );
}

main().catch((err) => {
  console.error("❌ Error generating industry-city SEO data:", err);
  process.exit(1);
});// JavaScript Document