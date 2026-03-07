// scripts/validateIndustries.mjs
// Validates _industryList25.js structure AND industryPresets.js references

import industries from "./_industryList25.js";
import { presets } from "./industryPresets.js";

function fail(msg) {
  console.error("❌", msg);
}
function warn(msg) {
  console.warn("⚠️", msg);
}
function ok(msg) {
  console.log("✅", msg);
}
const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== "";

// ----------------------------------------------
// 1. Unique Slug Validation
// ----------------------------------------------
function validateUniqueSlugs(list) {
  const seen = new Map();
  const errors = [];

  list.forEach((ind, idx) => {
    if (!hasValue(ind.slug)) {
      errors.push(`Industry at index ${idx} is missing slug`);
      return;
    }
    if (seen.has(ind.slug)) {
      errors.push(
        `Duplicate slug "${ind.slug}" at indices ${seen.get(ind.slug)} and ${idx}`
      );
    } else {
      seen.set(ind.slug, idx);
    }
  });

  errors.length
    ? errors.forEach(fail)
    : ok(`All ${list.length} industry slugs are unique.`);

  return errors;
}

// ----------------------------------------------
// 2. Industry Structure Validation
// ----------------------------------------------
function validateStructure(list) {
  const errors = [];
  const warnings = [];

  list.forEach((ind) => {
    const { slug } = ind;

    if (!hasValue(ind.title)) {
      errors.push(`"${slug}" missing required field: title`);
    }

    // Must have hybrid intros or legacy intro
    const hasHybrid = Array.isArray(ind.introTemplates);
    const hasLegacyIntro = hasValue(ind.intro);

    if (!hasHybrid && !hasLegacyIntro) {
      errors.push(`"${slug}" must have introTemplates[] or intro string`);
    }
    if (hasHybrid && ind.introTemplates.length === 0) {
      errors.push(`"${slug}" has empty introTemplates[]`);
    }

    // Best-for system
    const hasHybridBestFor =
      Array.isArray(ind.bestForCore) || Array.isArray(ind.bestForExtras);
    const hasLegacyBestFor = Array.isArray(ind.bestFor);

    if (!hasHybridBestFor && !hasLegacyBestFor) {
      errors.push(
        `"${slug}" must define bestForCore/bestForExtras or legacy bestFor[] list`
      );
    }

    // Stats required
    if (!ind.stats) {
      errors.push(`"${slug}" missing stats object`);
    } else {
      if (!hasValue(ind.stats.credit)) {
        errors.push(`"${slug}" stats missing credit`);
      }
      if (!hasValue(ind.stats.speed)) {
        errors.push(`"${slug}" stats missing speed`);
      }
      if (!hasValue(ind.stats.terms)) {
        errors.push(`"${slug}" stats missing terms`);
      }
    }

    // Soft localization best practice
    if (hasHybrid) {
      const hasCity = ind.introTemplates.some((t) => t.includes("{{city}}"));
      const hasState = ind.introTemplates.some((t) => t.includes("{{state}}"));

      if (!hasCity || !hasState) {
        warnings.push(
          `"${slug}" introTemplates may not be fully localized (missing {{city}}/{{state}}).`
        );
      }
    }

    // Hybrid extras weight validation
    if (Array.isArray(ind.bestForExtras)) {
      ind.bestForExtras.forEach((item) => {
        if (item.weight !== undefined) {
          if (
            typeof item.weight !== "number" ||
            !Number.isFinite(item.weight) ||
            item.weight <= 0
          ) {
            errors.push(
              `"${slug}" bestForExtras item "${item.slug || item.label}" has invalid weight: ${item.weight}`
            );
          }
        }
      });
    }
  });

  errors.forEach(fail);
  warnings.forEach(warn);

  if (!errors.length) {
    ok("All industries pass structural validation.");
  }

  return { errors, warnings };
}

// ----------------------------------------------
// 3. Preset Validation (ensure slugs exist)
// ----------------------------------------------
function validatePresets(list) {
  const allSlugs = new Set(list.map((i) => i.slug));
  const errors = [];
  const warnings = [];

  Object.entries(presets).forEach(([presetName, presetSlugs]) => {
    if (!presetSlugs || !presetSlugs.length) {
      warnings.push(`Preset "${presetName}" is empty.`);
      return;
    }

    presetSlugs.forEach((slug) => {
      if (!allSlugs.has(slug)) {
        errors.push(
          `Preset "${presetName}" references missing slug: "${slug}"`
        );
      }
    });
  });

  errors.length
    ? errors.forEach(fail)
    : ok("All presets reference valid industry slugs.");

  warnings.forEach(warn);

  return { errors, warnings };
}

// ----------------------------------------------
// RUN VALIDATION
// ----------------------------------------------
console.log("🔎 Validating industries + presets...\n");

const slugErrors = validateUniqueSlugs(industries);
const { errors: structErrors, warnings: structWarnings } =
  validateStructure(industries);
const { errors: presetErrors, warnings: presetWarnings } =
  validatePresets(industries);

const allErrors = [...slugErrors, ...structErrors, ...presetErrors];

console.log("\n==============================");
if (allErrors.length === 0) {
  console.log("🎉 Validation PASSED — No errors found.");
  if (structWarnings.length || presetWarnings.length) {
    console.log("Warnings:");
    [...structWarnings, ...presetWarnings].forEach((w) =>
      console.log(" -", w)
    );
  }
  console.log("==============================");
  process.exit(0);
} else {
  console.log("🚨 Validation FAILED — Fix the following:");
  allErrors.forEach((e) => console.log(" -", e));
  if (structWarnings.length || presetWarnings.length) {
    console.log("\nWarnings:");
    [...structWarnings, ...presetWarnings].forEach((w) =>
      console.log(" -", w)
    );
  }
  console.log("==============================");
  process.exit(1);
}