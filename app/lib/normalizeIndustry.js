/**
 * normalizeIndustryPage.js
 * ------------------------------------------------------
 * Merges Industry Config + WPGraphQL (ACF) State Loan Data
 * into a single, safe, revenue-optimized page object.
 *
 * Designed for:
 * - IndustryCityTemplate
 * - WPGraphQL + ACF
 * - Unlimited city/state/industry scaling
 */

/* ------------------------------------------------------
   Utilities
------------------------------------------------------ */

const safeString = (val, fallback = "") => {
  if (typeof val === "string" && val.trim()) return val;
  if (typeof val === "number") return String(val);
  return fallback;
};

const safeArray = (val) => (Array.isArray(val) ? val : []);

const randomFromArray = (arr) =>
  Array.isArray(arr) && arr.length
    ? arr[Math.floor(Math.random() * arr.length)]
    : "";

/* ------------------------------------------------------
   Main Normalizer
------------------------------------------------------ */

export function normalizeIndustryPage({
  city = "",
  state = "",
  industryConfig = {},
  stateLoan = {}
}) {
  /* -------------------------------
     Industry Inputs
  -------------------------------- */

  const industryLabel = safeString(industryConfig.label, "Small Business");
  const industrySlug = safeString(industryConfig.slug, "");
  const industryTitle = safeString(industryConfig.title, industryLabel);

  /* -------------------------------
     Intro (Industry-Controlled)
  -------------------------------- */

  const introTemplate = randomFromArray(
    safeArray(industryConfig.introTemplates)
  );

  const intro = introTemplate
    ? introTemplate
        .replace(/{{city}}/gi, city)
        .replace(/{{state}}/gi, state)
    : `Funding options for ${industryLabel.toLowerCase()} in ${city}, ${state}.`;

  /* -------------------------------
     Stats (WP Overrides Industry)
  -------------------------------- */

  const stats = {
    credit: safeString(
      stateLoan.creditScore,
      industryConfig.stats?.credit || "580+"
    ),
    speed: safeString(
      stateLoan.processingTime,
      industryConfig.stats?.speed || "24–72 Hours"
    ),
    terms: safeString(
      industryConfig.stats?.terms,
      "6–24 Months"
    )
  };

  /* -------------------------------
     Best-For Use Cases
  -------------------------------- */

  const coreUses = safeArray(industryConfig.bestForCore).map((item) => ({
    label: safeString(item.label),
    type: "core",
    weight: 1
  }));

  const growthUses = safeArray(industryConfig.bestForExtras).map((item) => ({
    label: safeString(item.label),
    type: "growth",
    weight: typeof item.weight === "number" ? item.weight : 1
  }));

  const bestFor = [...coreUses, ...growthUses];

  /* -------------------------------
     Loan Programs (WP Controlled)
  -------------------------------- */

  const loanPrograms = safeArray(stateLoan.loanPrograms).map((program) => ({
    name: safeString(program.programName),
    description: safeString(program.description),
    funding: safeString(program.minMaxFunding),
    term: safeString(program.termLength),
    applyUrl: program.applyLink?.url || ""
  }));

  /* -------------------------------
     Qualification Requirements
  -------------------------------- */

  const requirements = safeArray(
    stateLoan.loanQualificationRequirements
  ).map((r) => safeString(r.requirementItem));

  /* -------------------------------
     Nearby Cities
  -------------------------------- */

  const nearbyCities = safeArray(stateLoan.nearbyCities).map((city) => ({
    name: safeString(city.cityName),
    slug: safeString(city.slug)
  }));

  /* -------------------------------
     Final Payload
  -------------------------------- */

  return {
    city: safeString(city),
    state: safeString(state),
    industry: industryLabel,
    industrySlug,
    title: `${city} ${industryLabel} Business Loans`,
    intro,

    stats,
    bestFor,

    loanPrograms,
    requirements,
    nearbyCities
  };
}