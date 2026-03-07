import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";
import industryList25 from "./_industryList25.js";

console.log("Validating industry pages…");

let missingPages = [];
let missingJson = [];

for (const stateSlug in stateCityMap) {
  const state = stateCityMap[stateSlug];

  for (const city of state.cities) {
    for (const ind of industryList25) {
      const pagePath = path.join(
        "app/state-loans",
        stateSlug,
        city.slug,
        "industry",
        ind.slug,
        "page.js"
      );

      if (!fs.existsSync(pagePath)) {
        missingPages.push(pagePath);
      }

      const jsonPath = path.join(
        "data/industry-city",
        stateSlug,
        city.slug,
        `${ind.slug}.json`
      );

      if (!fs.existsSync(jsonPath)) {
        missingJson.push(jsonPath);
      }
    }
  }
}

console.log("\nMissing Pages:");
console.log(missingPages.length ? missingPages : "None");

console.log("\nMissing JSON:");
console.log(missingJson.length ? missingJson : "None");

console.log("\nValidation complete.");