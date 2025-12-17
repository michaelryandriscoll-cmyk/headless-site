/* scripts/validateRoutes.js */

import stateCityMap from "../app/lib/stateCityMap.js";
import { industryMap, getIndustryConfig } from "../app/lib/industryMap.js";

console.log("🔍 Validating city × industry routes...\n");

let errorCount = 0;
let total = 0;

for (const [stateSlug, stateData] of Object.entries(stateCityMap)) {
  if (!stateData?.cities || !Array.isArray(stateData.cities)) {
    console.error(`❌ State "${stateSlug}" has no valid cities array`);
    errorCount++;
    continue;
  }

  for (const city of stateData.cities) {
    if (!city?.slug || !city?.name) {
      console.error(
        `❌ Invalid city object in state "${stateSlug}":`,
        city
      );
      errorCount++;
      continue;
    }

    for (const industry of Object.values(industryMap)) {
      total++;

      const industryConfig = getIndustryConfig(industry.slug);

      if (!industryConfig) {
        console.error(
          `❌ Missing industry config: ${industry.slug}`
        );
        errorCount++;
        continue;
      }

      const route = `/state-loans/${stateSlug}/${city.slug}/${industry.slug}`;

      // Optional sanity checks
      if (!industryConfig.h1 || !industryConfig.shortLabel) {
        console.error(
          `❌ Incomplete industry config for "${industry.slug}" → ${route}`
        );
        errorCount++;
        continue;
      }

      console.log(`✅ ${route}`);
    }
  }
}

console.log("\n----------------------------------");
console.log(`Routes checked: ${total}`);

if (errorCount === 0) {
  console.log("🎉 ALL city × industry routes are valid.");
} else {
  console.error(`🚨 ${errorCount} issues detected.`);
  process.exit(1);
}