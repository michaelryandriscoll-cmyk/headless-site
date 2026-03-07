// scripts/diffIntros.mjs
// Enhanced Intro Diff Viewer 2.0
// - Side-by-side HTML layout
// - Word-level diff highlighting
// - Navigation sidebar
// - Similarity heatmap
// - Changes-only HTML export
// - Improved console output

import fs from "fs";
import path from "path";
import originalIndustries from "./_industryList25.js";
import rewrittenIndustries from "./_industryList25.rewritten.js";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const TARGET_INDUSTRY = args.industry || null;
const EXPORT_HTML = !!args.html;

// ---------- Colors for console ----------
const color = {
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  bold: (t) => `\x1b[1m${t}\x1b[0m`,
};

// ---------- Basic helpers ----------
function similarity(a, b) {
  const setA = new Set(a.toLowerCase().split(/\W+/));
  const setB = new Set(b.toLowerCase().split(/\W+/));
  const shared = [...setA].filter((w) => setB.has(w) && w.length > 3);
  return shared.length / Math.max(setA.size, setB.size || 1);
}

function impactBadge(sim) {
  if (sim >= 0.85) {
    return { label: "SMALL", className: "impact-small", text: "🟢 SMALL" };
  } else if (sim >= 0.65) {
    return { label: "MEDIUM", className: "impact-medium", text: "🟡 MEDIUM" };
  }
  return { label: "MAJOR", className: "impact-major", text: "🔴 MAJOR" };
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Word-level diff (simple) ----------
function diffWordsHtml(oldStr = "", newStr = "") {
  const oldTokens = oldStr.split(/(\s+)/); // keep spaces as tokens
  const newTokens = newStr.split(/(\s+)/);

  // Very simple diff: mark tokens that disappeared or appeared.
  // Not perfect, but good enough for intros.
  const oldMap = {};
  oldTokens.forEach((t, i) => {
    if (!t.trim()) return;
    const key = t.toLowerCase();
    if (!oldMap[key]) oldMap[key] = [];
    oldMap[key].push(i);
  });

  const newMap = {};
  newTokens.forEach((t, i) => {
    if (!t.trim()) return;
    const key = t.toLowerCase();
    if (!newMap[key]) newMap[key] = [];
    newMap[key].push(i);
  });

  // Old side: mark tokens that don't appear in new
  const oldHtml = oldTokens
    .map((t) => {
      if (!t.trim()) return escapeHtml(t);
      const key = t.toLowerCase();
      if (!newMap[key] || newMap[key].length === 0) {
        return `<span class="removed">${escapeHtml(t)}</span>`;
      }
      return escapeHtml(t);
    })
    .join("");

  // New side: mark tokens that weren't in old
  const newHtml = newTokens
    .map((t) => {
      if (!t.trim()) return escapeHtml(t);
      const key = t.toLowerCase();
      if (!oldMap[key] || oldMap[key].length === 0) {
        return `<span class="added">${escapeHtml(t)}</span>`;
      }
      return escapeHtml(t);
    })
    .join("");

  return { oldHtml, newHtml };
}

// ---------- HTML templates ----------
function getHtmlShellStart() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Intro Diff Report</title>
<style>
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    margin: 0;
    display: flex;
    height: 100vh;
    color: #222;
  }
  .sidebar {
    width: 220px;
    background: #0b1724;
    color: #f7f7f7;
    padding: 16px;
    overflow-y: auto;
  }
  .sidebar h2 {
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 8px;
  }
  .sidebar a {
    display: block;
    color: #d0d6e0;
    text-decoration: none;
    padding: 4px 0;
    font-size: 14px;
  }
  .sidebar a:hover {
    color: #ffffff;
  }
  .main {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
    background: #f3f4f6;
  }
  h1 {
    margin-top: 0;
  }
  .intro-block {
    margin-bottom: 24px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(15,23,42,0.08);
    padding: 12px 16px 16px;
  }
  .intro-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .intro-index {
    font-weight: 600;
    color: #111827;
  }
  .impact-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid transparent;
  }
  .impact-small {
    color: #166534;
    background: #dcfce7;
    border-color: #bbf7d0;
  }
  .impact-medium {
    color: #92400e;
    background: #ffedd5;
    border-color: #fed7aa;
  }
  .impact-major {
    color: #991b1b;
    background: #fee2e2;
    border-color: #fecaca;
  }
  .intro-meta {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .col {
    background: #f9fafb;
    border-radius: 6px;
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    font-size: 14px;
    line-height: 1.4;
  }
  .col h4 {
    margin: 0 0 4px;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: .03em;
  }
  .removed {
    color: #b91c1c;
    text-decoration: line-through;
  }
  .added {
    color: #15803d;
    text-decoration: underline;
  }
  .industry-block {
    margin-bottom: 32px;
  }
  .industry-header {
    margin-bottom: 8px;
  }
  .industry-header h2 {
    margin: 0;
    font-size: 18px;
    color: #111827;
  }
  .industry-header span {
    font-size: 12px;
    color: #6b7280;
  }
  .filters {
    margin-bottom: 16px;
    font-size: 13px;
    color: #374151;
  }
</style>
</head>
<body>
<div class="sidebar">
  <h2>Industries</h2>
`;
}

function getHtmlMainStart() {
  return `</div>
<div class="main">
  <h1>Intro Diff Report</h1>
  <p style="font-size:13px;color:#4b5563;">Left: Original &nbsp;&nbsp; Right: Rewritten</p>
  <div class="filters">
    <strong>Legend:</strong>
    <span style="margin-left:10px;">🟢 Small change (>= 85% similar)</span>
    <span style="margin-left:10px;">🟡 Medium (65–84%)</span>
    <span style="margin-left:10px;">🔴 Major (&lt; 65%)</span>
  </div>
`;
}

function getHtmlShellEnd() {
  return `</div></body></html>`;
}

// ---------- MAIN ----------
console.log(color.bold("\n🔍 Enhanced Intro Diff Viewer 2.0"));
console.log("====================================\n");

const originalBySlug = new Map(originalIndustries.map((i) => [i.slug, i]));
const rewrittenBySlug = new Map(rewrittenIndustries.map((i) => [i.slug, i]));

const slugsToProcess = TARGET_INDUSTRY
  ? [TARGET_INDUSTRY]
  : originalIndustries.map((i) => i.slug);

let htmlSidebarLinks = "";
let htmlMainSections = "";
let htmlMainChangesOnly = "";

for (const slug of slugsToProcess) {
  const orig = originalBySlug.get(slug);
  const rewritten = rewrittenBySlug.get(slug);

  if (!orig) {
    console.log(color.red(`❌ Original industry not found for slug: ${slug}`));
    continue;
  }
  if (!rewritten) {
    console.log(color.red(`❌ Rewritten industry not found for slug: ${slug}`));
    continue;
  }

  const origIntros = orig.introTemplates || [];
  const newIntros = rewritten.introTemplates || [];

  console.log(color.cyan(`\n=== ${slug.toUpperCase()} ===`));

  htmlSidebarLinks += `<a href="#industry-${slug}">${escapeHtml(slug)}</a>\n`;

  let industryBlock = `<div class="industry-block" id="industry-${slug}">
  <div class="industry-header">
    <h2>${escapeHtml(slug)}</h2>
    <span>${origIntros.length} intros</span>
  </div>
`;

  let industryBlockChangesOnly = ""; // only intros that changed

  origIntros.forEach((oldTxt, index) => {
    const newTxt = newIntros[index] ?? "";
    const sim = similarity(oldTxt || "", newTxt || "");
    const badge = impactBadge(sim);

    const { oldHtml, newHtml } = diffWordsHtml(oldTxt, newTxt);

    const changed = (oldTxt || "") !== (newTxt || "");

    // ----- Console output -----
    console.log(color.bold(`\nIntro ${index + 1}:`));
    console.log("Original:");
    console.log(oldTxt);
    console.log(color.green("\nRewritten:"));
    console.log(newTxt);

    const simStr = `${(sim * 100).toFixed(1)}%`;
    let impactText;
    if (badge.label === "SMALL") {
      impactText = color.green(`🟢 SMALL change (${simStr} similar)`);
    } else if (badge.label === "MEDIUM") {
      impactText = color.yellow(`🟡 MEDIUM change (${simStr} similar)`);
    } else {
      impactText = color.red(`🔴 MAJOR change (${simStr} similar)`);
    }
    console.log(impactText);

    // ----- HTML block (all intros) -----
    industryBlock += `
    <div class="intro-block">
      <div class="intro-header">
        <div class="intro-index">Intro #${index + 1}</div>
        <div class="impact-badge ${badge.className}">${escapeHtml(
      badge.text
    )} — ${simStr}</div>
      </div>
      <div class="intro-meta">
        ${changed ? "Changed" : "Unchanged"}
      </div>
      <div class="row">
        <div class="col">
          <h4>Original</h4>
          <div>${oldHtml}</div>
        </div>
        <div class="col">
          <h4>Rewritten</h4>
          <div>${newHtml}</div>
        </div>
      </div>
    </div>
`;

    // ----- HTML block (changes only) -----
    if (changed) {
      industryBlockChangesOnly += `
      <div class="intro-block">
        <div class="intro-header">
          <div class="intro-index">Intro #${index + 1}</div>
          <div class="impact-badge ${badge.className}">${escapeHtml(
        badge.text
      )} — ${simStr}</div>
        </div>
        <div class="intro-meta">
          Changed
        </div>
        <div class="row">
          <div class="col">
            <h4>Original</h4>
            <div>${oldHtml}</div>
          </div>
          <div class="col">
            <h4>Rewritten</h4>
            <div>${newHtml}</div>
          </div>
        </div>
      </div>
`;
    }
  });

  industryBlock += `</div>\n`;

  if (industryBlockChangesOnly) {
    htmlMainChangesOnly += `<div class="industry-block" id="industry-${slug}">
  <div class="industry-header">
    <h2>${escapeHtml(slug)}</h2>
    <span>Changed intros only</span>
  </div>
  ${industryBlockChangesOnly}
</div>
`;
  }

  htmlMainSections += industryBlock;
}

if (!EXPORT_HTML) {
  console.log(color.bold("\n🎉 Diff complete (console mode). Run with --html to generate HTML reports.\n"));
  process.exit(0);
}

// ---------- Write HTML files ----------
fs.mkdirSync("qa", { recursive: true });

const fullHtml =
  getHtmlShellStart() +
  htmlSidebarLinks +
  getHtmlMainStart() +
  htmlMainSections +
  getHtmlShellEnd();

const changesOnlyHtml =
  getHtmlShellStart() +
  htmlSidebarLinks +
  getHtmlMainStart().replace(
    "Intro Diff Report",
    "Intro Diff Report — Changes Only"
  ) +
  htmlMainChangesOnly +
  getHtmlShellEnd();

const fullPath = path.join("qa", "intro-diff.html");
const changesPath = path.join("qa", "intro-diff-changes-only.html");

fs.writeFileSync(fullPath, fullHtml, "utf8");
fs.writeFileSync(changesPath, changesOnlyHtml, "utf8");

console.log(color.green(`\n📄 Full diff saved to ${fullPath}`));
console.log(
  color.green(`📄 Changes-only diff saved to ${changesPath}`)
);

console.log(color.bold("\n🎉 Diff complete with HTML output.\n"));