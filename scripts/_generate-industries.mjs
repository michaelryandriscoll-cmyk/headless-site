// scripts/_generate-industries.mjs
// Generate Industry + City pages wired to IndustryCityTemplate

import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";

// ---------------------------
// Config: Industries to build
// ---------------------------
const INDUSTRIES = [
  {
    slug: "roofing",
    label: "Roofing",
    bestForBase: [
      "Storm repair surges",
      "Hiring additional crews fast",
      "Upfront materials before insurance pays",
      "Dump trailers, ladders and safety equipment",
      "Marketing pushes during peak season"
    ],
    stats: { credit: "580+", speed: "24–72 Hours", terms: "6–24 Months" }
  },
  {
    slug: "trucking",
    label: "Trucking",
    bestForBase: [
      "Fuel and route expansion",
      "Down payment on additional trucks or trailers",
      "Repairs and maintenance between invoices",
      "Payroll during slow-pay cycles",
      "Permits, insurance and compliance"
    ],
    stats: { credit: "580+", speed: "24–72 Hours", terms: "6–24 Months" }
  },
  {
    slug: "solar",
    label: "Solar",
    bestForBase: [
      "Covering install labor between project draws",
      "Upfront panel and inverter purchases",
      "Door-to-door and inside sales teams",
      "Warehouse, trucks and equipment",
      "Bridge funding while incentives clear"
    ],
    stats: { credit: "600+", speed: "3–7 Business Days", terms: "12–36 Months" }
  }
];

// ---------------------------
// Helpers
// ---------------------------
const APP_ROOT = process.cwd();
const PAGES_ROOT = path.join(APP_ROOT, "app", "state-loans");
const META_ROOT = path.join(APP_ROOT, "data", "industry-city");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function escapeForJs(str = "") {
  return str.replace(/"/g, '\\"');
}

// ---------------------------
// Main generator
// ---------------------------
let created = 0;
let skipped = 0;

console.log("Building Industry-City Pages...");

for (const [stateSlug, stateConfig] of Object.entries(stateCityMap)) {
  const stateName = stateConfig.stateName;

  for (const city of stateConfig.cities) {
    const citySlug = city.slug;
    const cityName = city.name;

    for (const ind of INDUSTRIES) {
      const pageDir = path.join(
        PAGES_ROOT,
        stateSlug,
        citySlug,
        "industry",
        ind.slug
      );
      const pageFile = path.join(pageDir, "page.js");

      if (fs.existsSync(pageFile)) {
        console.log(`Skipped existing page: ${pageFile}`);
        skipped++;
        continue;
      }

      ensureDir(pageDir);

      const title = `${cityName} ${ind.label} Business Loans | ${stateName} Funding Programs`;
      const description = `${ind.label} businesses in ${cityName}, ${stateName} use fast capital to cover materials, payroll and growth when job timing and cash flow don’t line up.`;

      const intro = `${ind.label} companies in ${cityName}, ${stateName} rely on flexible funding to handle materials, labor, equipment and timing gaps between projects and payment.`;

      const bestFor = ind.bestForBase;
      const stats = ind.stats;

      const componentSource = `import IndustryCityTemplate from "@/components/IndustryCityTemplate";

export const metadata = {
  title: "${escapeForJs(title)}",
  description: "${escapeForJs(description)}"
};

export default function Page() {
  return (
    <IndustryCityTemplate
      city="${escapeForJs(cityName)}"
      state="${escapeForJs(stateName)}"
      industry="${escapeForJs(ind.label)}"
      intro="${escapeForJs(intro)}"
      bestFor={[${bestFor
        .map((item) => `"${escapeForJs(item)}"`)
        .join(", ")}]}
      stats={{ credit: "${escapeForJs(
        stats.credit
      )}", speed: "${escapeForJs(stats.speed)}", terms: "${escapeForJs(
        stats.terms
      )}" }}
    />
  );
}
`;

      fs.writeFileSync(pageFile, componentSource, "utf8");

      // Metadata JSON (optional but nice for future tools)
      const metaDir = path.join(META_ROOT, stateSlug, citySlug);
      ensureDir(metaDir);
      const metaFile = path.join(metaDir, `${ind.slug}.json`);
      fs.writeFileSync(
        metaFile,
        JSON.stringify(
          {
            title,
            description,
            city: cityName,
            state: stateName,
            industry: ind.label,
            stats,
            bestFor
          },
          null,
          2
        ),
        "utf8"
      );

      console.log(`Created: ${pageFile}`);
      console.log(`  + metadata: ${metaFile}`);
      created++;
    }
  }
}

console.log(`Done. Created: ${created}, Skipped: ${skipped}`);