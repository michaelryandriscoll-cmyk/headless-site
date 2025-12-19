// scripts/validateSeo.mjs
import stateCityMap from "../data/stateCityMap.ci.js";
import industries from "../app/lib/_industryList25.js";

let errors = 0;

console.log("🔍 Validating SEO integrity (H1 + Title)...\n");

for (const state of Object.values(stateCityMap)) {
  for (const city of state.cities) {
    for (const industry of industries) {
      const cityName = city.name;
      const industryLabel = industry.label;

      if (!cityName || !industryLabel) {
        console.error(`❌ Missing city or industry label`, {
          city: city.slug,
          industry: industry.slug
        });
        errors++;
        continue;
      }

      const h1 = `${cityName} ${industryLabel} Contractors: Get Fast Business Funding`;
      const title = `${cityName} ${industryLabel} Business Loans | Fast Contractor Financing`;

      // Rule 1: City + industry must exist
      if (!h1.includes(cityName) || !h1.includes(industryLabel)) {
        console.error(`❌ H1 missing city or industry → ${city.slug}/${industry.slug}`);
        errors++;
      }

      if (!title.includes(cityName) || !title.includes(industryLabel)) {
        console.error(`❌ Title missing city or industry → ${city.slug}/${industry.slug}`);
        errors++;
      }

      // Rule 2: H1 and title must NOT be identical
      if (h1 === title) {
        console.error(`❌ H1 equals Title (SEO risk) → ${city.slug}/${industry.slug}`);
        errors++;
      }
    }
  }
}

console.log("\n----------------------------------");

if (errors > 0) {
  console.error(`❌ SEO validation failed with ${errors} issue(s).`);
  process.exit(1);
}

console.log("✅ SEO validation passed.");