// scripts/validateIndustries.js
import industries from "../app/lib/_industryList25.js";

let hasErrors = false;

console.log("🔍 Validating industry configs...\n");

industries.forEach((industry, index) => {
  const prefix = `[${index + 1}/${industries.length}] ${industry.slug || "UNKNOWN SLUG"}`;

  if (!industry.slug || typeof industry.slug !== "string") {
    console.error(`❌ ${prefix}: Missing or invalid slug`);
    hasErrors = true;
  }

  if (!industry.title || typeof industry.title !== "string") {
    console.error(`❌ ${prefix}: Missing or invalid title`);
    hasErrors = true;
  }

  if (!industry.label || typeof industry.label !== "string") {
    console.error(`❌ ${prefix}: Missing or invalid label`);
    hasErrors = true;
  }

  if (industry.introTemplates && !Array.isArray(industry.introTemplates)) {
    console.error(`❌ ${prefix}: introTemplates must be an array`);
    hasErrors = true;
  }

  const validateBestFor = (arr, name) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((item, i) => {
      if (!item || typeof item.label !== "string") {
        console.error(`❌ ${prefix}: Invalid ${name}[${i}]`);
        hasErrors = true;
      }
    });
  };

  validateBestFor(industry.bestForCore, "bestForCore");
  validateBestFor(industry.bestForExtras, "bestForExtras");

  if (industry.stats) {
    if (industry.stats.credit && typeof industry.stats.credit !== "string") {
      console.error(`❌ ${prefix}: stats.credit must be string`);
      hasErrors = true;
    }
    if (industry.stats.speed && typeof industry.stats.speed !== "string") {
      console.error(`❌ ${prefix}: stats.speed must be string`);
      hasErrors = true;
    }
    if (industry.stats.terms && typeof industry.stats.terms !== "string") {
      console.error(`❌ ${prefix}: stats.terms must be string`);
      hasErrors = true;
    }
  }
});

console.log("\n----------------------------------");

if (hasErrors) {
  console.error("❌ Validation failed.");
  process.exit(1);
} else {
  console.log("✅ All industry configs are valid.");
  process.exit(0);
}