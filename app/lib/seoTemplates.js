// app/lib/seoTemplates.js
// Single source of truth for H1, title, and meta description templates.
// Used by page components AND validation scripts to stay in sync.

/**
 * Generate the page H1
 * e.g. "Houston HVAC Contractors: Get Fast Business Funding"
 */
export function buildH1({ cityName, industryLabel }) {
  return `${cityName} ${industryLabel} Contractors: Get Fast Business Funding`;
}

/**
 * Generate the <title> tag
 * e.g. "Houston HVAC Business Loans | Fast Contractor Financing"
 */
export function buildTitle({ cityName, industryLabel }) {
  return `${cityName} ${industryLabel} Business Loans | Fast Contractor Financing`;
}

/**
 * Generate the meta description
 * Uses industry-specific stats and audience from _industryList25
 * e.g. "Get fast business loans for HVAC contractors in Houston, Texas.
 *       Compare working capital, equipment financing, and credit lines.
 *       Min credit: 580+. Funding in 24–48 hours."
 */
export function buildDescription({ cityName, stateName, industryLabel, audience, stats = {} }) {
  const credit = stats.credit || "580+";
  const speed = stats.speed || "24–72 Hours";
  const audienceStr = audience || `${industryLabel} businesses`;

  return `${industryLabel} loans for ${audienceStr} in ${cityName}, ${stateName}. Min credit: ${credit}. Funding in ${speed}.`;
}

/**
 * Generate a random intro paragraph from the industry's introTemplates
 * Falls back to a generic template if none exist
 */
export function buildIntro({ cityName, stateName, industry }) {
  const templates = industry?.introTemplates;

  if (Array.isArray(templates) && templates.length > 0) {
    // Pick deterministically based on city name (stable across builds)
    const index = cityName.length % templates.length;
    return templates[index]
      .replace(/\{\{city\}\}/g, cityName)
      .replace(/\{\{state\}\}/g, stateName);
  }

  return `${industry?.audience || "Businesses"} in ${cityName}, ${stateName} benefit from fast, flexible financing options for working capital, equipment, and growth.`;
}

/**
 * Full metadata object for Next.js generateMetadata
 */
export function buildMetadata({ cityName, stateName, industrySlug, industry, baseUrl = "https://smallbusiness.capital", stateSlug, citySlug }) {
  const industryLabel = industry?.label || industry?.industry || industrySlug;
  const audience = industry?.audience;
  const stats = industry?.stats || {};

  return {
    title: buildTitle({ cityName, industryLabel }),
    description: buildDescription({ cityName, stateName, industryLabel, audience, stats }),
    alternates: {
      canonical: `${baseUrl}/state-loans/${stateSlug}/${citySlug}/industry/${industrySlug}`,
    },
  };
}
