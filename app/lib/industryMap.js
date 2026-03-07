// app/lib/industryMap.js
// Central map of industry slug → config used for SEO, copy, and internal links.

export const industryMap = {
  "restaurant-loans": {
    slug: "restaurant-loans",
    shortLabel: "Restaurant",
    label: "Restaurant & Food Service Business Loans",
    h1: "Restaurant Business Loans",
    bestFor: "restaurants, cafes, bars, food trucks, and ghost kitchens",
  },

  "trucking-financing": {
    slug: "trucking-financing",
    shortLabel: "Trucking",
    label: "Trucking & Logistics Financing",
    h1: "Trucking & Logistics Business Loans",
    bestFor: "freight, last-mile delivery, logistics fleets, and owner-operators",
  },

  "construction-loans": {
    slug: "construction-loans",
    shortLabel: "Construction",
    label: "Construction & Contractor Business Loans",
    h1: "Construction & Contractor Financing",
    bestFor: "GCs, subcontractors, remodelers, and specialty trades",
  },

  // ✅ NEW — Roofing
  "roofing": {
    slug: "roofing",
    shortLabel: "Roofing",
    label: "Roofing Contractor Business Loans",
    h1: "Roofing Business Loans",
    bestFor:
      "roofing contractors, storm restoration companies, and residential or commercial roofers",
  },

  // ✅ NEW — HVAC
  "hvac": {
    slug: "hvac",
    shortLabel: "HVAC",
    label: "HVAC Contractor Business Loans",
    h1: "HVAC Business Loans",
    bestFor:
      "HVAC contractors, heating and cooling companies, and mechanical service businesses",
  },
	
	// ✅ NEW — Plumbing
"plumbing": {
  slug: "plumbing",
  shortLabel: "Plumbing",
  label: "Plumbing Contractor Business Loans",
  h1: "Plumbing Business Loans",
  bestFor:
    "plumbing contractors, residential and commercial plumbers, drain service, pipe repair, and emergency plumbing businesses",
},

  "retail-loans": {
    slug: "retail-loans",
    shortLabel: "Retail",
    label: "Retail Store Business Loans",
    h1: "Retail Business Loans",
    bestFor: "brick-and-mortar retail, specialty stores, and boutiques",
  },

  "ecommerce-funding": {
    slug: "ecommerce-funding",
    shortLabel: "E-Commerce",
    label: "E-Commerce & Online Business Funding",
    h1: "E-Commerce Business Loans",
    bestFor: "online brands, DTC stores, and marketplace sellers",
  },

  "salon-spa": {
	  slug: "salon-spa",
	  shortLabel: "Salon & Spa",
	  label: "Salon, Spa & Beauty Business Loans",
	  h1: "Salon & Spa Business Loans",
	  bestFor: "beauty salons, spas, barbershops, med-spas, and studios",
   }, 

  "medical-practice-loans": {
    slug: "medical-practice-loans",
    shortLabel: "Medical",
    label: "Medical, Dental & Healthcare Practice Loans",
    h1: "Medical & Healthcare Business Loans",
    bestFor: "medical, dental, chiropractic, and wellness practices",
  },
	
// ✅ NEW — General Contractors
  "general-contractors": {
    slug: "general-contractors",
    shortLabel: "General Contractors",
    label: "General Contractor Business Loans",
    h1: "General Contractor Business Loans",
    bestFor:
      "general contractors, builders, project managers, and construction firms",
  },

  "manufacturing-financing": {
    slug: "manufacturing-financing",
    shortLabel: "Manufacturing",
    label: "Manufacturing & Industrial Financing",
    h1: "Manufacturing Business Loans",
    bestFor: "light manufacturing, fabrication, and industrial operations",
  },

  "auto-repair-loans": {
    slug: "auto-repair-loans",
    shortLabel: "Auto Repair",
    label: "Auto Repair & Service Shop Loans",
    h1: "Auto Repair Business Loans",
    bestFor: "mechanic shops, tire centers, and auto service businesses",
  },
	
  // ✅ NEW — Electrician
  "electrician": {
    slug: "electrician",
    shortLabel: "Electrician",
    label: "Electrician Business Loans",
    h1: "Electrician Business Loans",
    bestFor:
      "electrical contractors, commercial electricians, residential electricians, and service technicians",
  },
	
  // ✅ NEW — Landscaping
  "landscaping": {
    slug: "landscaping",
    shortLabel: "Landscaping",
    label: "Landscaping Business Loans",
    h1: "Landscaping Business Loans",
    bestFor:
      "landscaping companies, lawn care services, hardscaping contractors, and maintenance crews",
  },

  // ✅ NEW — Cleaning
  "cleaning": {
    slug: "cleaning",
    shortLabel: "Cleaning",
    label: "Cleaning Business Loans",
    h1: "Cleaning Business Loans",
    bestFor:
      "commercial cleaning companies, janitorial services, residential cleaners, and specialty cleaning businesses",
  },

  // ✅ NEW — Solar
  "solar": {
    slug: "solar",
    shortLabel: "Solar",
    label: "Solar Contractor Business Loans",
    h1: "Solar Business Loans",
    bestFor:
      "solar installation companies, renewable energy contractors, and clean energy businesses",
  },

  "professional-services-loans": {
    slug: "professional-services-loans",
    shortLabel: "Professional Services",
    label: "Professional Services Business Loans",
    h1: "Professional Services Business Loans",
    bestFor: "agencies, consultants, law firms, and accounting firms",
  },
};

// Fallback helper if slug is not in the map:
export function getIndustryConfig(industrySlug) {
  const found = industryMap[industrySlug];
  if (found) return found;

  // Basic humanized fallback
  const humanLabel = industrySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

  return {
    slug: industrySlug,
    shortLabel: humanLabel,
    label: `${humanLabel} Business Loans`,
    h1: `${humanLabel} Business Loans`,
    bestFor: "local small businesses in this category",
  };
}

export default industryMap; // JavaScript Document 