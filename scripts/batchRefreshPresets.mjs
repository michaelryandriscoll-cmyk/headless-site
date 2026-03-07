// scripts/batchRefreshPresets.mjs
// Runs regeneratePagesByPreset.mjs for each preset.

import { execSync } from "node:child_process";
import { presets } from "./industryPresets.js";

function run(cmd) {
  console.log(`\n▶ Running: ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (err) {
    console.error(`❌ Error running: ${cmd}`);
  }
}

function printPresets() {
  return Object.keys(presets)
    .map((p) => `- ${p}`)
    .join("\n");
}

const arg = process.argv[2];

console.log("=== Batch Refresh Presets ===");

if (!arg) {
  console.log("\n⚠ No preset selected.\n");
  console.log("Usage:");
  console.log("  node scripts/batchRefreshPresets.mjs <preset>");
  console.log("  node scripts/batchRefreshPresets.mjs all\n");
  console.log("Available presets:\n" + printPresets());
  process.exit(0);
}

if (arg === "all") {
  console.log("\n🔄 Refreshing ALL presets...");
  for (const preset of Object.keys(presets)) {
    console.log(`\n=== Refreshing preset: ${preset} ===`);
    run(`node scripts/regeneratePagesByPreset.mjs ${preset}`);
  }
  console.log("\n🎉 Batch preset refresh complete!");
  process.exit(0);
}

if (!presets[arg]) {
  console.log(`\n❌ Unknown preset: ${arg}`);
  console.log("Available presets:\n" + printPresets());
  process.exit(1);
}

console.log(`\n=== Refreshing preset: ${arg} ===`);
run(`node scripts/regeneratePagesByPreset.mjs ${arg}`);

console.log("\n🎉 Done refreshing preset.");