// scripts/generateIndustryCityPages.mjs
// Generate /app/state-loans/[state]/[city]/industry/[industry]/page.js
// + matching /data/industry-city/[state]/[city]/[industry].json
// Uses hybrid engine (introTemplates + bestForCore/Extras) when available.

import fs from "fs";
import path from "path";
import stateCityMap from "../app/lib/stateCityMap.js";
import industries from "./_industryList25.js";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writePageFile(pagePath, content) {
  if (fs.existsSync(pagePath)) {
    console.log(`Skipped existing page: ${pagePath}`);
    return false;
  }
  fs.writeFileSync(pagePath, content);
  return true;
}

// Deterministic template picker so same city/state always gets same variant
function pickTemplate(templates, stateSlug, citySlug) {
  if (!templates || !templates.length) return "";
  const idx = (stateSlug.length * 7 + citySlug.length * 3) % templates.length;
  return templates[idx];
}

// Deterministic “extra bestFor” picker
function pickExtras(extras, stateSlug, citySlug, count = 3) {
  if (!extras || !extras.length) return [];
  const output = [];
  const baseLen = extras.length;
  const start = (stateSlug.length * 11 + citySlug.length * 5) % baseLen;

  for (let i = 0; i < count && i < baseLen; i++) {
    output.push(extras[(start + i) % baseLen]);
  }
  return output;
}

console.log("Building Industry-City Pages with hybrid engine...");

let created = 0;
let skipped = 0;

for (const stateSlug in stateCityMap) {
  const state = stateCityMap[stateSlug];

  for (const city of state.cities) {
    const citySlug = city.slug;
    const cityName = city.name;
    const stateName = state.stateName;

    for (const ind of industries) {
      const pageDir = path.join(
        "app/state-loans",
        stateSlug,
        citySlug,
        "industry",
        ind.slug
      );
      const pagePath = path.join(pageDir, "page.js");
      ensureDir(pageDir);

      // -----------------------------
      // Build intro text
      // -----------------------------
      let introText = "";

      if (ind.introTemplates && ind.introTemplates.length) {
        // Hybrid mode (e.g. Roofing)
        const tmpl = pickTemplate(ind.introTemplates, stateSlug, citySlug);
        introText = tmpl
          .replace(/{{city}}/g, cityName)
          .replace(/{{state}}/g, stateName);
      } else if (ind.intro) {
        // Simple mode (other industries)
        introText = ind.intro;
      }

      // -----------------------------
      // Build bestFor list
      // -----------------------------
      let bestForArr = [];

      if (ind.bestForCore && ind.bestForExtras) {
        const extras = pickExtras(ind.bestForExtras, stateSlug, citySlug, 3);
        bestForArr = [...ind.bestForCore, ...extras];
      } else if (ind.bestFor) {
        bestForArr = ind.bestFor;
      }

      // -----------------------------
      // Stats fallback
      // -----------------------------
      const stats =
        ind.stats || { credit: "580+", speed: "24–72 Hours", terms: "6–24 Months" };

      const industryName =
        ind.label || ind.title.replace(" Business Loans", "");

      const title = `${cityName} ${ind.title}`;

      const pageContent = `import IndustryCityTemplate from "@/components/IndustryCityTemplate";

export const metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(introText)}
};

export default function Page() {
  return (
    <IndustryCityTemplate
      city={${JSON.stringify(cityName)}}
      state={${JSON.stringify(stateName)}}
      industry={${JSON.stringify(industryName)}}
      intro={${JSON.stringify(introText)}}
      bestFor={${JSON.stringify(bestForArr)}}
      stats={${JSON.stringify(stats)}}
    />
  );
}
`;

      const wasCreated = writePageFile(pagePath, pageContent);

      if (wasCreated) {
        created++;

        // Write metadata JSON
        const metaDir = path.join(
          "data/industry-city",
          stateSlug,
          citySlug
        );
        ensureDir(metaDir);

        const metaPath = path.join(metaDir, `${ind.slug}.json`);
        fs.writeFileSync(
          metaPath,
          JSON.stringify(
            {
              state: stateName,
              city: cityName,
              industry: ind.slug,
              title,
              intro: introText,
              bestFor: bestForArr,
              stats
            },
            null,
            2
          )
        );

        console.log(`Created: ${pagePath}`);
        console.log(`  + metadata: ${metaPath}`);
      } else {
        skipped++;
      }
    }
  }
}

console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);