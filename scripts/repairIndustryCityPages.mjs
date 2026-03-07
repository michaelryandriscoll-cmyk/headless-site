// scripts/repairIndustryCityPages.mjs
import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";

const root = "app/state-loans";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ---- Detect if page is already using IndustryCityTemplate ----
function isNewFormat(content) {
  return content.includes("IndustryCityTemplate");
}

// ---- Build NEW standardized template ----
function buildTemplate({ city, stateName, industry, intro, bestFor, stats }) {
  return `
import IndustryCityTemplate from "@/components/IndustryCityTemplate";

export const metadata = {
  title: "${city} ${industry} Business Loans",
  description: "${intro}"
};

export default function Page() {
  return (
    <IndustryCityTemplate
      city="${city}"
      state="${stateName}"
      industry="${industry}"
      intro="${intro}"
      bestFor={${JSON.stringify(bestFor)}}
      stats={${JSON.stringify(stats)}}
    />
  );
}
`;
}

function backupFile(filePath) {
  const backup = filePath.replace("/page.js", "/page.backup.js");
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(filePath, backup);
  }
}

let repaired = 0;
let skipped = 0;

// =============== MAIN LOOP ==================
for (const stateSlug in stateCityMap) {
  const state = stateCityMap[stateSlug];

  for (const city of state.cities) {
    const cityDir = path.join(root, stateSlug, city.slug, "industry");
    if (!fs.existsSync(cityDir)) continue;

    const industries = fs.readdirSync(cityDir);

    for (const industrySlug of industries) {
      const pagePath = path.join(cityDir, industrySlug, "page.js");
      if (!fs.existsSync(pagePath)) continue;

      const content = fs.readFileSync(pagePath, "utf8");

      // Skip if already correct
      if (isNewFormat(content)) {
        skipped++;
        continue;
      }

      // Backup current
      backupFile(pagePath);

      // Build default params for rewrite
      const newContent = buildTemplate({
        city: city.name,
        stateName: state.stateName,
        industry: industrySlug
          .replace(/-/g, " ")
          .replace(/\b\w/g, x => x.toUpperCase()),
        intro: `Financing options for ${industrySlug} businesses in ${city.name}, ${state.stateName}.`,
        bestFor: [
          "Working capital",
          "Equipment purchases",
          "Hiring and payroll",
          "Expansion projects",
          "Unexpected expenses"
        ],
        stats: {
          credit: "580+",
          speed: "24–72 Hours",
          terms: "6–24 Months"
        }
      });

      fs.writeFileSync(pagePath, newContent);
      repaired++;
      console.log(`Repaired → ${pagePath}`);
    }
  }
}

console.log(`\nDONE — Repaired: ${repaired}, Skipped: ${skipped}`);