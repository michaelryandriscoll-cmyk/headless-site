// scripts/logIndustrySummary.mjs
import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";
import industries from "./_industryList25.js";

console.log("\nSEO LOGGER — Industry Page Audit\n");

let stateCount = 0;
let cityCount = 0;
let pageExistingCount = 0;

for (const stateSlug in stateCityMap) {
  stateCount++;
  const state = stateCityMap[stateSlug];

  for (const city of state.cities) {
    cityCount++;

    for (const ind of industries) {
      const pagePath = path.join(
        "app/state-loans",
        stateSlug,
        city.slug,
        "industry",
        ind.slug,
        "page.js"
      );
      if (fs.existsSync(pagePath)) {
        pageExistingCount++;
      }
    }
  }
}

console.log(`✔ States: ${stateCount}`);
console.log(`✔ Cities: ${cityCount}`);
console.log(`✔ Industries: ${industries.length}`);
console.log(`✔ Total Pages Existing: ${pageExistingCount}\n`);

const summary = {
  generatedAt: new Date().toISOString(),
  states: stateCount,
  cities: cityCount,
  industries: industries.length,
  pagesExisting: pageExistingCount
};

// ensure logs dir
const logsDir = "logs";
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const outPath = path.join(logsDir, "seo-summary.json");
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));

console.log("SEO summary saved → logs/seo-summary.json");