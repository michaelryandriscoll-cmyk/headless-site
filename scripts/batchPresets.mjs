// scripts/batchPresets.mjs
// Run batch refresh based on named preset groups

import { execSync } from "child_process";
import { presets } from "./industryPresets.js";

function log(msg) {
  console.log(`\n=== ${msg} ===`);
}

const [, , presetName] = process.argv;

if (!presetName) {
  console.error("Usage: node scripts/batchPresets.mjs <preset>");
  console.error("Example: node scripts/batchPresets.mjs core-trades");
  console.error("\nAvailable presets:", Object.keys(presets).join(", "));
  process.exit(1);
}

const industries = presets[presetName];

if (!industries) {
  console.error(`Preset not found: ${presetName}`);
  console.error("Available presets:", Object.keys(presets).join(", "));
  process.exit(1);
}

log(`Running preset batch refresh: ${presetName}`);
console.log("Industries included:", industries.join(", "));

industries.forEach(ind => {
  try {
    log(`Refreshing: ${ind}`);
    execSync(`node scripts/refreshIndustryPages.mjs ${ind}`, {
      stdio: "inherit"
    });
  } catch (err) {
    console.error(`Error refreshing ${ind}:`, err.message);
  }
});

log(`Batch preset complete: ${presetName}`);