// scripts/validateSeo.mjs
import stateCityMap from "../data/stateCityMap.ci.js";
import industries from "../app/lib/_industryList25.js";
import { buildH1, buildTitle, buildDescription } from "../app/lib/seoTemplates.js";

let errors = 0;
console.log("🔍 Validating SEO integrity (H1 + Title + Description)...\n");

for (const state of Object.values(stateCityMap)) {
  for (const city of state.cities) {
    for (const industry of industries) {
      const cityName = city.name;
      const stateName = state.stateName;
      const industryLabel = industry.label;
      const audience = industry.audience;
      const stats = industry.stats || {};

      if (!cityName || !industryLabel) {
        console.error(`❌ Missing city or industry label`, {
          city: city.slug,
          industry: industry.slug,
        });
        errors++;
        continue;
      }

      const h1 = buildH1({ cityName, industryLabel });
      const title = buildTitle({ cityName, industryLabel });
      const description = buildDescription({ cityName, stateName, industryLabel, audience, stats });

      // Rule 1: H1 must contain city and industry
      if (!h1.includes(cityName) || !h1.includes(industryLabel)) {
        console.error(`❌ H1 missing city or industry → ${city.slug}/${industry.slug}`);
        errors++;
      }

      // Rule 2: Title must contain city and industry
      if (!title.includes(cityName) || !title.includes(industryLabel)) {
        console.error(`❌ Title missing city or industry → ${city.slug}/${industry.slug}`);
        errors++;
      }

      // Rule 3: H1 and title must NOT be identical
      if (h1 === title) {
        console.error(`❌ H1 equals Title (SEO risk) → ${city.slug}/${industry.slug}`);
        errors++;
      }

      // Rule 4: Description must contain city and industry
      if (!description.includes(cityName) || !description.includes(industryLabel)) {
        console.error(`❌ Description missing city or industry → ${city.slug}/${industry.slug}`);
        errors++;
      }

      // Rule 5: Description must not be too short
      if (description.length < 80) {
        console.error(`❌ Description too short (${description.length} chars) → ${city.slug}/${industry.slug}`);
        errors++;
      }

      // Rule 6: Description must not be too long (Google truncates at ~160)
      if (description.length > 165) {
        console.warn(`⚠️  Description may be too long (${description.length} chars) → ${city.slug}/${industry.slug}`);
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
