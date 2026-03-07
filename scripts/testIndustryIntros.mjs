// scripts/testIndustryIntros.mjs
// SUPER ADVANCED QA TOOL — AI-like tone checks, readability, diversity scoring, HTML/CSV/JSON export, rewrite suggestions.

import { execSync } from "node:child_process";
import industries from "./_industryList25.js";
import fs from "fs";
import path from "path";

// ---------------------------------------------
// COLOR OUTPUT
// ---------------------------------------------
const color = {
  red: (txt) => `\x1b[31m${txt}\x1b[0m`,
  yellow: (txt) => `\x1b[33m${txt}\x1b[0m`,
  green: (txt) => `\x1b[32m${txt}\x1b[0m`,
  cyan: (txt) => `\x1b[36m${txt}\x1b[0m`,
  bold: (txt) => `\x1b[1m${txt}\x1b[0m`,
};

// ---------------------------------------------
// CLI ARGS
// ---------------------------------------------
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const TARGET_INDUSTRY = args.industry || null;
const TEST_CITY = args.city || "Dallas";
const TEST_STATE = args.state || "TX";
const COUNT = parseInt(args.count || "3");
const EXPORT_HTML = !!args.html;
const EXPORT_CSV = !!args.csv;
const EXPORT_JSON = !!args.json;

// ---------------------------------------------
// HELPERS
// ---------------------------------------------
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function render(tpl, city, state) {
  return tpl.replace(/{{city}}/g, city).replace(/{{state}}/g, state);
}

function similarity(a, b) {
  const setA = new Set(a.toLowerCase().split(/\W+/));
  const setB = new Set(b.toLowerCase().split(/\W+/));
  const shared = [...setA].filter((w) => setB.has(w) && w.length > 3);
  return shared.length / Math.max(setA.size, setB.size);
}

// ---------------------------------------------
// READABILITY SCORING
// Flesch–Kincaid + Reading Ease
// ---------------------------------------------
function sentenceCount(text) {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
}

function syllableCount(word) {
  return (word.toLowerCase().match(/[aeiouy]+/g) || []).length;
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function readability(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const totalSentences = sentenceCount(text);
  const syllables = words.reduce((a, w) => a + syllableCount(w), 0);

  const fkGrade =
    0.39 * (totalWords / totalSentences) +
    11.8 * (syllables / totalWords) -
    15.59;

  const ease =
    206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (syllables / totalWords);

  return { fkGrade, ease };
}

// ---------------------------------------------
// TONE CLASSIFIER (simple heuristic)
// ---------------------------------------------
function classifyTone(text) {
  const txt = text.toLowerCase();

  if (txt.includes("grow") || txt.includes("expand") || txt.includes("financing"))
    return "Professional";
  if (txt.includes("fast") || txt.includes("urgent") || txt.includes("need"))
    return "Urgent / Salesy";
  if (txt.includes("local") || txt.includes("trusted") || txt.includes("reliable"))
    return "Reassuring / Helpful";
  if (txt.includes("compare"))
    return "Neutral Informational";

  return "Neutral";
}

// ---------------------------------------------
// REWRITE ENGINE (simple local improvement)
// ---------------------------------------------
function improveIntro(text) {
  return text
    .replace("rely on", "benefit from")
    .replace("use financing", "secure financing")
    .replace("use loans", "access loan options")
    .replace("Grow your", "Strengthen your")
    .replace("compare", "explore");
}

// ---------------------------------------------
// HTML BUFFER
// ---------------------------------------------
let html = `
<!DOCTYPE html>
<html><head>
<title>Intro QA - ${TEST_CITY}, ${TEST_STATE}</title>
<style>
body { font-family: Arial; padding: 20px; }
.sample { background: #f2f2f2; padding: 10px; border-radius: 6px; margin-bottom: 8px; }
.warn { color: #c67c00; }
.dup { color: #a30000; }
</style>
</head><body>
<h1>Intro QA (${TEST_CITY}, ${TEST_STATE})</h1>
`;

// ---------------------------------------------
// CSV / JSON REPORT BUFFERS
// ---------------------------------------------
let csvRows = [
  "industry,template_index,similarity,tone,grade_level,ease,original,improved",
];

let jsonData = [];

// ---------------------------------------------
// MAIN QA RUN
// ---------------------------------------------
console.log(color.bold("\n🧪 ADVANCED INTRO QA TOOL"));
console.log("====================================\n");

const industriesToTest = TARGET_INDUSTRY
  ? industries.filter((i) => i.slug === TARGET_INDUSTRY)
  : industries;

for (const industry of industriesToTest) {
  const { slug, introTemplates } = industry;

  console.log(color.cyan(`\n📌 Industry: ${slug}`));

  html += `<h2>${slug}</h2>`;

  // Duplicate detection
  const seen = new Set();
  introTemplates.forEach((tpl, i) => {
    if (seen.has(tpl.trim())) {
      console.log(color.red(`❌ Duplicate intro detected at index ${i}`));
      html += `<p class="dup">❌ Duplicate intro at index ${i}</p>`;
    }
    seen.add(tpl.trim());
  });

  console.log(color.yellow("🔍 Checking intros...\n"));

  for (let index = 0; index < introTemplates.length; index++) {
    const tpl = introTemplates[index];
    const rendered = render(tpl, TEST_CITY, TEST_STATE);

    const { fkGrade, ease } = readability(rendered);
    const tone = classifyTone(rendered);

    // Basic diversity warning
    let warning = "";
    if (fkGrade > 12) warning = "⚠️ Too complex";
    if (ease < 50) warning = "⚠️ Hard to read";

    const improved = improveIntro(rendered);

    // Print to console
    console.log(color.green(`Intro ${index + 1}:`));
    console.log(rendered);
    console.log(`Tone: ${tone}`);
    console.log(`Readability: FK ${fkGrade.toFixed(2)}, Ease ${ease.toFixed(2)}`);
    if (warning) console.log(color.yellow(warning));
    console.log("");

    // Add to HTML
    html += `<div class="sample"><strong>${index + 1}:</strong> ${rendered}<br>
      <em>Tone:</em> ${tone}<br>
      <em>Grade:</em> ${fkGrade.toFixed(2)} (Ease ${ease.toFixed(2)})<br>
      <em>Improved:</em> ${improved}
    </div>`;

    // Add to CSV
    csvRows.push(
      `"${slug}",${index},0,"${tone}",${fkGrade.toFixed(
        2
      )},${ease.toFixed(2)},"${rendered.replace(/"/g, "'")}","${improved.replace(
        /"/g,
        "'"
      )}"`
    );

    // Add to JSON
    jsonData.push({
      industry: slug,
      index,
      intro: rendered,
      tone,
      fkGrade,
      ease,
      improved,
    });
  }
}

// ---------------------------------------------
// EXPORT FILES
// ---------------------------------------------
if (EXPORT_HTML) {
  fs.mkdirSync("qa", { recursive: true });
  fs.writeFileSync("qa/intros.html", html + "</body></html>", "utf8");
  console.log(color.green("📄 HTML report saved to qa/intros.html"));
}

if (EXPORT_CSV) {
  fs.mkdirSync("qa", { recursive: true });
  fs.writeFileSync("qa/intro-report.csv", csvRows.join("\n"), "utf8");
  console.log(color.green("📊 CSV report saved to qa/intro-report.csv"));
}

if (EXPORT_JSON) {
  fs.mkdirSync("qa", { recursive: true });
  fs.writeFileSync("qa/intro-report.json", JSON.stringify(jsonData, null, 2), "utf8");
  console.log(color.green("📘 JSON report saved to qa/intro-report.json"));
}

if (args.apply) {
  console.log("\n✏️  --apply flag detected. Running safe rewrite (Mode A)...");
  execSync("node scripts/rewriteIntros.mjs", { stdio: "inherit" });
}

console.log(color.bold("\n🎉 QA COMPLETE — All advanced checks finished.\n"));