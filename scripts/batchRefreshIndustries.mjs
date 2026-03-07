// scripts/batchRefreshIndustries.mjs
// Safely refresh multiple industries at once using your existing single-industry engine.
// Usage:
//   node scripts/batchRefreshIndustries.mjs roofing,trucking,solar

import { execSync } from "child_process";

function log(msg) {
  console.log(`\n=== ${msg} ===`);
}

const [, , arg] = process.argv;

if (!arg) {
  console.error("Usage: node scripts/batchRefreshIndustries.mjs <industry1,industry2,...>");
  process.exit(1);
}

// -------------------------------
// Parse industries
// -------------------------------
const industries = arg
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

if (!industries.length) {
  console.error("No valid industries provided.");
  process.exit(1);
}

log(`Batch refresh starting for ${industries.length} industries...`);
console.log("Industries:", industries.join(", "));

// -------------------------------
// Run refresh script for each industry
// -------------------------------
industries.forEach(industry => {
  try {
    log(`Refreshing: ${industry}`);

    // Call your existing refreshIndustryPages.mjs script
    execSync(`node scripts/refreshIndustryPages.mjs ${industry}`, {
      stdio: "inherit"
    });

  } catch (err) {
    console.error(`Error refreshing ${industry}:`, err.message);
  }
});

log("Batch refresh complete.");