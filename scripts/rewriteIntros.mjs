// scripts/rewriteIntros.mjs
// MODE A — SAFE REWRITE
// Reads _industryList25.js, rewrites only weak intros into a NEW file:
//   scripts/_industryList25.rewritten.js

import fs from "fs";
import path from "path";
import industries from "./_industryList25.js";

// ------------------------
// Helpers (same heuristics as QA script)
// ------------------------
const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== "";

function sentenceCount(text) {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
}

function syllableCount(word) {
  return (word.toLowerCase().match(/[aeiouy]+/g) || []).length;
}

function readability(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length || 1;
  const totalSentences = sentenceCount(text);
  const syllables = words.reduce((a, w) => a + syllableCount(w), 0) || 1;

  const fkGrade =
    0.39 * (totalWords / totalSentences) +
    11.8 * (syllables / totalWords) -
    15.59;

  const ease =
    206.835 -
    1.015 * (totalWords / totalSentences) -
    84.6 * (syllables / totalWords);

  return { fkGrade, ease };
}

function similarity(a, b) {
  const setA = new Set(a.toLowerCase().split(/\W+/));
  const setB = new Set(b.toLowerCase().split(/\W+/));
  const shared = [...setA].filter((w) => setB.has(w) && w.length > 3);
  return shared.length / Math.max(setA.size, setB.size || 1);
}

// Simple deterministic “improvement” pass
function improveIntro(text) {
  return text
    .replace("rely on", "benefit from")
    .replace("use financing", "secure financing")
    .replace("use loans", "access loan options")
    .replace("Grow your", "Strengthen your")
    .replace("grow your", "strengthen your")
    .replace("compare", "explore");
}

// ------------------------
// Decide if intro is weak
// ------------------------
function isWeakIntro(intro, allIntros, index) {
  const { fkGrade, ease } = readability(intro);

  let reasons = [];

  if (fkGrade > 12) {
    reasons.push(`grade ${fkGrade.toFixed(1)} > 12`);
  }
  if (ease < 50) {
    reasons.push(`ease ${ease.toFixed(1)} < 50`);
  }

  // Similarity vs others in same industry
  let maxSim = 0;
  for (let i = 0; i < allIntros.length; i++) {
    if (i === index) continue;
    const score = similarity(intro, allIntros[i]);
    if (score > maxSim) maxSim = score;
  }

  if (maxSim > 0.6) {
    reasons.push(`max similarity ${Math.round(maxSim * 100)}% > 60%`);
  }

  return { isWeak: reasons.length > 0, reasons, fkGrade, ease, maxSim };
}

// ------------------------
// MAIN REWRITE LOGIC
// ------------------------
console.log("✏️  Running SAFE rewrite on intros (Mode A)...");
let totalRewritten = 0;

const newIndustries = industries.map((industry) => {
  if (!Array.isArray(industry.introTemplates)) {
    return industry; // nothing to rewrite
  }

  const originalIntros = industry.introTemplates;
  const rewrittenIntros = [];
  let rewrittenCountForIndustry = 0;

  originalIntros.forEach((intro, idx) => {
    const { isWeak, reasons, fkGrade, ease, maxSim } = isWeakIntro(
      intro,
      originalIntros,
      idx
    );

    if (!isWeak) {
      rewrittenIntros.push(intro);
      return;
    }

    // Generate improved version
    const improved = improveIntro(intro);
    rewrittenIntros.push(improved);
    rewrittenCountForIndustry++;
    totalRewritten++;

    console.log(
      `🔧 [${industry.slug}] Rewriting intro #${idx + 1} — ${reasons.join(
        "; "
      )} (grade=${fkGrade.toFixed(1)}, ease=${ease.toFixed(
        1
      )}, maxSim=${Math.round(maxSim * 100)}%)`
    );
  });

  if (rewrittenCountForIndustry > 0) {
    return {
      ...industry,
      introTemplates: rewrittenIntros,
    };
  }

  return industry;
});

// ------------------------
// WRITE NEW FILE
// ------------------------
const outPath = path.resolve("./scripts/_industryList25.rewritten.js");
const fileContent =
  `// AUTO-GENERATED SAFE REWRITE VERSION\n` +
  `// Source: scripts/_industryList25.js\n` +
  `// Only intros flagged as weak were rewritten.\n\n` +
  `const industries = ${JSON.stringify(newIndustries, null, 2)};\n\n` +
  `export default industries;\n`;

fs.writeFileSync(outPath, fileContent, "utf8");

console.log("\n===================================");
console.log(`✅ Safe rewrite complete.`);
console.log(`   Intros rewritten: ${totalRewritten}`);
console.log(`   Output file: ${outPath}`);
console.log("   Original file NOT modified.");
console.log("===================================\n");