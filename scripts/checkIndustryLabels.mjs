import industries from "../app/lib/_industryList25.js";

const missing = industries.filter(i => !i.label || typeof i.label !== "string");

console.log("Total:", industries.length);
console.log("Missing labels:", missing.length);

if (missing.length) {
  console.log("Missing labels for:");
  missing.forEach(i => console.log(" -", i.slug));
}
