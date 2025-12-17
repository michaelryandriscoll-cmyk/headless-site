// scripts/validateRoutes.mjs

import stateCityMap from "../data/stateCityMap.ci.js";
import industries from "../app/lib/_industryList25.js";

let errors = 0;

for (const [stateSlug, state] of Object.entries(stateCityMap)) {
  if (!state.cities || !Array.isArray(state.cities)) {
    console.error(`❌ ${stateSlug}: missing cities array`);
    errors++;
    continue;
  }

  for (const city of state.cities) {
    if (!city.slug) {
      console.error(`❌ ${stateSlug}: city missing slug`);
      errors++;
      continue;
    }

    for (const industry of industries) {
      if (!industry.slug) {
        console.error(`❌ industry missing slug`);
        errors++;
      }
    }
  }
}

if (errors) {
  console.error(`\n❌ Route validation failed with ${errors} errors`);
  process.exit(1);
}

console.log("✅ All state × city × industry routes are valid");