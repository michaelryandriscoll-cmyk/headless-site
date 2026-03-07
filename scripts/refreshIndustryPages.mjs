// scripts/refreshIndustryPages.mjs
// Auto-Heal L3 + auto-detect for stateCityMap.js + industry validation

import fs from "fs";
import path from "path";
import url from "url";

// ----------------------------------------
// Resolve root directory
// ----------------------------------------
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// ----------------------------------------
// Auto-detect stateCityMap.js
// ----------------------------------------
const CITY_SOURCES = [
  "app/lib/stateCityMap.js",
  "lib/stateCityMap.js",
  "data/stateCityMap.js",
  "_data/stateCityMap.js",
  "app/data/stateCityMap.js",
];

function resolveStateCityMap() {
  for (const rel of CITY_SOURCES) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) {
      console.log(`🌎 Using stateCityMap: ${rel}`);
      return full;
    }
  }

  throw new Error(
    "❌ Auto-Heal L3 Failed: stateCityMap.js not found.\n" +
      "Please provide the path or run: find . -name stateCityMap.js"
  );
}

const stateCityMapPath = resolveStateCityMap();
const stateCityMap = (await import(url.pathToFileURL(stateCityMapPath))).default;

// ----------------------------------------
// Load industries
// ----------------------------------------
import industries from "./_industryList25.js";

// ----------------------------------------
// Helper functions
// ----------------------------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFileSafe(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

// ----------------------------------------
// Template picking
// ----------------------------------------
function pickTemplate(templates, stateSlug, citySlug) {
  if (!templates?.length) return "";
  const idx = (stateSlug.length * 7 + citySlug.length * 3) % templates.length;
  return templates[idx];
}

function pickExtras(extras, stateSlug, citySlug, count = 3) {
  if (!extras?.length) return [];
  const out = [];
  const base = extras.length;
  const start = (stateSlug.length * 11 + citySlug.length * 5) % base;

  for (let i = 0; i < count; i++) out.push(extras[(start + i) % base]);
  return out;
}

// ----------------------------------------
// MAIN ENGINE
// ----------------------------------------
async function run(industrySlug) {
  const ind = industries.find((x) => x.slug === industrySlug);

  if (!ind) {
    console.error(`❌ Industry not found: ${industrySlug}`);
    console.error("Available slugs:", industries.map((x) => x.slug).join(", "));
    process.exit(1);
  }

  console.log(`\n🔧 Regenerating industry pages for: ${industrySlug}\n`);

  let created = 0;
  let updated = 0;

  for (const stateSlug in stateCityMap) {
    const state = stateCityMap[stateSlug];
    const stateName = state.stateName;

    for (const city of state.cities) {
      const citySlug = city.slug;
      const cityName = city.name;

      // Pick template
      const template =
        pickTemplate(ind.introTemplates, stateSlug, citySlug) || ind.intro || "";
      const intro = template
        .replace(/{{city}}/g, cityName)
        .replace(/{{state}}/g, stateName);

      const core = ind.bestForCore || ind.bestFor || [];
      const extras = ind.bestForExtras
        ? pickExtras(ind.bestForExtras, stateSlug, citySlug)
        : [];

      const bestFor = [...core, ...extras];

      const stats =
        ind.stats || { credit: "580+", speed: "24–72 Hours", terms: "6–24 Months" };

      const industryName = ind.label || ind.title;

      const pageDir = path.join(
        "app/state-loans",
        stateSlug,
        citySlug,
        "industry",
        industrySlug
      );
      ensureDir(pageDir);

      const pagePath = path.join(pageDir, "page.js");

      const newContent = `import IndustryCityTemplate from "@/components/IndustryCityTemplate";

export const metadata = {
  title: "${cityName} ${ind.title}",
  description: ${JSON.stringify(intro)}
};

export default function Page() {
  return (
    <IndustryCityTemplate
      city="${cityName}"
      state="${stateName}"
      industry="${industryName}"
      intro={${JSON.stringify(intro)}}
      bestFor={${JSON.stringify(bestFor)}}
      stats={${JSON.stringify(stats)}}
    />
  );
}
`;

      const existed = fs.existsSync(pagePath);
      writeFileSafe(pagePath, newContent);

      existed ? updated++ : created++;

      // Metadata JSON
      const metaDir = path.join("data/industry-city", stateSlug, citySlug);
      ensureDir(metaDir);
      const metaPath = path.join(metaDir, `${industrySlug}.json`);

      writeFileSafe(
        metaPath,
        JSON.stringify(
          {
            state: stateName,
            city: cityName,
            industry: industrySlug,
            intro,
            bestFor,
            stats,
          },
          null,
          2
        )
      );
    }
  }

  console.log(`\n✅ Done.`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}\n`);
}

// ----------------------------------------
// CLI
// ----------------------------------------
const arg = process.argv[2];
if (!arg) {
  console.log("Usage: node refreshIndustryPages.mjs <industry-slug>");
  process.exit(0);
}

run(arg);