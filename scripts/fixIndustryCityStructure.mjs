// scripts/fixIndustryCityStructure.mjs
import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";

// 25 industries — update if you expand later
import industries from "./_industryList25.js"; 
// (If you don't have this file, I can generate it again.)

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFileIfMissing(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// ========= FIXER ==========
console.log("🔧 Running Industry/City Fixer…");

let createdPages = 0;
let createdMeta = 0;
let existingPages = 0;
let existingMeta = 0;

for (const stateSlug in stateCityMap) {
  const state = stateCityMap[stateSlug];

  for (const city of state.cities) {
    for (const ind of industries) {
      const industrySlug = ind.slug;

      // --- Paths ---
      const pageDir = path.join(
        "app/state-loans",
        stateSlug,
        city.slug,
        "industry",
        industrySlug
      );

      const pagePath = path.join(pageDir, "page.js");

      const metaDir = path.join(
        "data/industry-city",
        stateSlug,
        city.slug
      );

      const metaPath = path.join(metaDir, `${industrySlug}.json`);

      // --- Ensure dirs exist ---
      ensureDir(pageDir);
      ensureDir(metaDir);

      // --- PAGE CONTENT ---
      const pageContent = `
import IndustryCityTemplate from "@/components/IndustryCityTemplate";

export const metadata = {
  title: "${city.name} ${ind.title}",
  description: "${ind.intro}"
};

export default function Page() {
  return (
    <IndustryCityTemplate
      city="${city.name}"
      state="${state.stateName}"
      industry="${ind.title.replace(" Business Loans","")}"
      intro="${ind.intro}"
      bestFor={${JSON.stringify(ind.bestFor)}}
      stats={${JSON.stringify(ind.stats)}}
    />
  );
}
`;

      // --- METADATA ---
      const metaObj = {
        state: state.stateName,
        city: city.name,
        industry: industrySlug,
        title: `${city.name} ${ind.title}`,
        intro: ind.intro,
        bestFor: ind.bestFor,
        stats: ind.stats
      };

      // --- Write if missing ---
      if (writeFileIfMissing(pagePath, pageContent)) {
        createdPages++;
        console.log(`🆕 Created page: ${pagePath}`);
      } else {
        existingPages++;
      }

      if (writeFileIfMissing(metaPath, JSON.stringify(metaObj, null, 2))) {
        createdMeta++;
        console.log(`🆕 Created metadata: ${metaPath}`);
      } else {
        existingMeta++;
      }
    }
  }
}

console.log("\n===== FIXER SUMMARY =====");
console.log(`Pages Created:       ${createdPages}`);
console.log(`Pages Already OK:    ${existingPages}`);
console.log(`Metadata Created:    ${createdMeta}`);
console.log(`Metadata Already OK: ${existingMeta}`);
console.log("==========================\n");
console.log("✅ Fixer complete!");