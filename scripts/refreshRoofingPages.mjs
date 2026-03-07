// scripts/refreshRoofingPages.mjs
import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Base roofing config (gold standard) — city/state plugged in per page
const roofingConfig = {
  industryName: "Roofing",
  intro:
    "Roofing contractors rely on fast capital to cover materials, crews, storm work and insurance delays. Flexible funding helps you say yes to more jobs without waiting on insurers or banks.",
  bestFor: [
    "Hail, wind and storm damage surges",
    "Upfront shingles, underlayment and materials before insurers pay",
    "Hiring and retaining additional roofing crews in peak season",
    "Dump trailers, trucks, safety equipment and lifts",
    "Marketing pushes after major weather events"
  ],
  stats: { credit: "580+", speed: "24–72 Hours", terms: "6–24 Months" }
};

function escape(str) {
  return str.replace(/"/g, '\\"');
}

let created = 0;
let updated = 0;

console.log("Refreshing ALL roofing industry pages…\n");

for (const stateSlug in stateCityMap) {
  const S = stateCityMap[stateSlug];

  for (const city of S.cities) {
    const pageDir = path.join(
      "app/state-loans",
      stateSlug,
      city.slug,
      "industry",
      "roofing"
    );
    const pagePath = path.join(pageDir, "page.js");

    ensureDir(pageDir);

    const cityName = city.name;
    const stateName = S.stateName;

    const metaTitle = `${cityName} Roofing Business Loans | ${stateName} Contractor Funding`;
    const metaDesc =
      `Roofing contractors in ${cityName} rely on fast capital to cover materials, crews, storm work and insurance delays. Compare working capital, equipment and credit line options.`;

    const pageContent = `import IndustryCityTemplate from "@/components/IndustryCityTemplate";

export const metadata = {
  title: "${escape(metaTitle)}",
  description: "${escape(metaDesc)}"
};

export default function Page() {
  return (
    <IndustryCityTemplate
      city="${escape(cityName)}"
      state="${escape(stateName)}"
      industry="${roofingConfig.industryName}"
      intro="${escape(roofingConfig.intro)}"
      bestFor={${JSON.stringify(roofingConfig.bestFor)}}
      stats={${JSON.stringify(roofingConfig.stats)}}
    />
  );
}
`;

    const existed = fs.existsSync(pagePath);
    fs.writeFileSync(pagePath, pageContent, "utf8");
    existed ? updated++ : created++;

    // Also refresh JSON metadata so your logger/validator stays in sync
    const metaDir = path.join("data/industry-city", stateSlug, city.slug);
    ensureDir(metaDir);

    const metaJsonPath = path.join(metaDir, "roofing.json");
    const metaJson = {
      state: stateName,
      city: cityName,
      industry: "roofing",
      title: metaTitle,
      intro: roofingConfig.intro,
      bestFor: roofingConfig.bestFor,
      stats: roofingConfig.stats
    };

    fs.writeFileSync(metaJsonPath, JSON.stringify(metaJson, null, 2), "utf8");

    console.log(
      `${existed ? "Updated" : "Created"}: ${pagePath}\n  + metadata: ${metaJsonPath}`
    );
  }
}

console.log(
  `\nDone. Created: ${created}, Updated: ${updated} roofing pages nationwide.`
);