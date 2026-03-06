// scripts/validateH1.mjs
// Validates that every page has exactly one valid H1
// H1 format mirrors seoTemplates.js buildH1()

import industries from "../app/lib/_industryList25.js";
import stateCityMap from "../data/stateCityMap.ci.js";
import { buildH1 } from "../app/lib/seoTemplates.js";

let failures = 0;
let checked = 0;

console.log("🔍 Validating H1 integrity (exactly one H1 per page)...\n");

for (const industry of industries) {
  const { slug: industrySlug, label: industryLabel } = industry;

  if (!industryLabel) {
    console.error(`❌ ${industrySlug}: Missing industry label`);
    failures++;
    continue;
  }

  for (const state of Object.values(stateCityMap)) {
    for (const city of state.cities) {
      checked++;

      const h1 = buildH1({ cityName: city.name, industryLabel });

      if (!h1 || typeof h1 !== "string" || h1.trim().length === 0) {
        console.error(`❌ [${state.stateName} / ${city.name} / ${industrySlug}] H1 is empty or invalid`);
        failures++;
        continue;
      }

      if (!h1.includes(city.name) || !h1.includes(industryLabel)) {
        console.error(`❌ [${state.stateName} / ${city.name} / ${industrySlug}] H1 missing city or industry: "${h1}"`);
        failures++;
      }
    }
  }
}

console.log("\n----------------------------------");
console.log(`📄 Pages checked: ${checked}`);

if (failures > 0) {
  console.error(`❌ H1 validation failed (${failures} issues)`);
  process.exit(1);
}

console.log("✅ H1 validation passed (exactly one H1 per page)");
