// scripts/regeneratePagesByPreset.mjs
import fs from "fs";
import path from "path";
import { presets } from "./industryPresets.js";
import { execSync } from "node:child_process";

const presetName = process.argv[2];

if (!presetName || !presets[presetName]) {
  console.log("❌ Missing or invalid preset.");
  console.log("Usage: node scripts/regeneratePagesByPreset.mjs <preset>");
  process.exit(1);
}

const industries = presets[presetName];

console.log(`\n🔄 Regenerating pages for preset: ${presetName}`);
console.log("Industries included:", industries.join(", "));

function run(cmd) {
  console.log(`\n▶ Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

for (const industry of industries) {
  console.log(`\n=== Regenerating INDUSTRY: ${industry} ===`);
  run(`node scripts/refreshIndustryPages.mjs ${industry}`);
}

console.log("\n🎉 Preset regeneration complete!");