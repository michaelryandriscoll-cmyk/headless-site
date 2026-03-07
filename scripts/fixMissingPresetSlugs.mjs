// scripts/fixMissingPresetSlugs.mjs
// Auto-repairs presets by removing invalid slugs and adding missing ones.
// Also rewrites industryPresets.js with corrected preset lists.

import fs from "fs";
import path from "path";
import industries from "./_industryList25.js";
import { presets } from "./industryPresets.js";

console.log("🔧 Auto-fixing preset slugs...\n");

const presetFilePath = path.resolve("./scripts/industryPresets.js");
const allSlugs = industries.map((i) => i.slug);
const allSlugSet = new Set(allSlugs);

// Pre-defined auto-fill rules
const AUTO_FILL_PRESETS = ["all"]; // only presets that should ALWAYS contain all industries

const repaired = {};
const diff = {};

// ------------------------------------------------------------
// Repair each preset
// ------------------------------------------------------------
for (const [presetName, presetSlugs] of Object.entries(presets)) {
  const original = [...presetSlugs];
  let cleaned = [];

  // 1. Remove slugs that are not in industries
  cleaned = presetSlugs.filter((slug) => {
    if (!allSlugSet.has(slug)) {
      console.log(`❌ Removing invalid slug "${slug}" from preset "${presetName}"`);
      return false;
    }
    return true;
  });

  // 2. If this preset should include ALL industries (like "all"), auto-fill missing
  if (AUTO_FILL_PRESETS.includes(presetName)) {
    const missing = allSlugs.filter((slug) => !cleaned.includes(slug));
    if (missing.length) {
      console.log(
        `➕ Adding ${missing.length} missing slugs to preset "${presetName}"...`,
      );
      cleaned.push(...missing);
    }
  }

  // 3. Sort preset slugs alphabetically for consistency
  cleaned.sort();

  repaired[presetName] = cleaned;

  // Track diff
  diff[presetName] = {
    before: original,
    after: cleaned,
  };
}

// ------------------------------------------------------------
// Write updated presets back to industryPresets.js
// ------------------------------------------------------------
function rewritePresetFile() {
  let output = `// scripts/industryPresets.js\n// AUTO-GENERATED — DO NOT EDIT MANUALLY\n\nexport const presets = {\n`;

  for (const [name, slugs] of Object.entries(repaired)) {
    output += `  "${name}": [\n`;

    slugs.forEach((slug, idx) => {
      const comma = idx === slugs.length - 1 ? "" : ",";
      output += `    "${slug}"${comma}\n`;
    });

    output += `  ],\n\n`;
  }

  output += `};\n`;

  fs.writeFileSync(presetFilePath, output, "utf8");
}

rewritePresetFile();

// ------------------------------------------------------------
// Show differences
// ------------------------------------------------------------
console.log("\n=================================");
console.log("📊 PRESET REPAIR DIFF REPORT");
console.log("=================================\n");

Object.entries(diff).forEach(([name, { before, after }]) => {
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    console.log(`🔄 Preset: ${name}`);
    console.log(`   BEFORE: [${before.join(", ")}]`);
    console.log(`   AFTER:  [${after.join(", ")}]\n`);
  }
});

console.log("✅ Auto-fix complete.\n");