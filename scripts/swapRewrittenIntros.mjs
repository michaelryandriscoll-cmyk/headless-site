// scripts/swapRewrittenIntros.mjs
// Safely promote rewritten intros into production

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const originalPath = path.resolve("./scripts/_industryList25.js");
const rewrittenPath = path.resolve("./scripts/_industryList25.rewritten.js");

const backupDir = path.resolve("./scripts/backups");
fs.mkdirSync(backupDir, { recursive: true });

if (!fs.existsSync(rewrittenPath)) {
  console.log("❌ No rewritten file found. Run rewriteIntros.mjs first.");
  process.exit(1);
}

// Timestamp backup filename
const ts = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .replace("Z", "");

const backupPath = path.join(
  backupDir,
  `_industryList25.js.${ts}.bak`
);

console.log("\n===================================");
console.log("🔄 Swapping rewritten intros into production...");
console.log("===================================");

// Step 1 → Back up original file
fs.copyFileSync(originalPath, backupPath);
console.log(`📦 Backup created: ${backupPath}`);

// Step 2 → Replace the file
fs.copyFileSync(rewrittenPath, originalPath);
console.log(`✏️  Production file updated: ${originalPath}`);

// Step 3 → Validate the result
console.log("\n🔎 Running validator...");
try {
  execSync("node scripts/validateIndustries.mjs", { stdio: "inherit" });
  console.log("✅ Swap validated successfully.");
} catch (error) {
  console.log("❌ Validation failed! Restoring backup...");
  fs.copyFileSync(backupPath, originalPath);
  console.log("⛑️ Backup restored.");
  process.exit(1);
}

console.log("\n🎉 Swap complete. Production file updated safely.\n");