import rawIndustries from "@/app/lib/_industryList25";

/* ---------------------------------------------------------
   Build Industry Map From Master List
--------------------------------------------------------- */

const industryMap = rawIndustries.reduce((acc, industry) => {
  if (!industry?.slug) return acc;

  acc[industry.slug] = {
    ...industry,

    // Standardized fields
    slug: industry.slug,
    shortLabel: industry.label || industry.industry,
    h1: industry.title,
    audience: industry.audience || industry.industry
  };

  return acc;
}, {});

/* ---------------------------------------------------------
   Public API
--------------------------------------------------------- */

export function getIndustry(slug) {
  return industryMap[slug] || null;
}

export function getAllIndustries() {
  return Object.values(industryMap);
}

export function getIndustrySlugs() {
  return Object.keys(industryMap);
}