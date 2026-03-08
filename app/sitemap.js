// app/sitemap.js

import stateCityMap from "@/app/lib/stateCityMap";

const BASE_URL = "https://smallbusiness.capital";

// All 25 confirmed industry slugs
const INDUSTRIES = [
  "roofing",
  "hvac",
  "plumbing",
  "electrician",
  "construction",
  "general-contractors",
  "landscaping",
  "cleaning",
  "solar",
  "trucking",
  "restaurants",
  "food-truck",
  "food-services",
  "salon-spa",
  "retail",
  "auto-repair",
  "ecommerce",
  "franchise",
  "real-estate",
  "technology",
  "manufacturing",
  "childcare",
  "fitness",
  "medical",
  "wholesale",
];

// Loan program slugs
const LOAN_PROGRAMS = [
  "working-capital-loans",
  "business-line-of-credit",
  "equipment-financing",
  "business-loans-for-bad-credit",
  "low-credit-score-loans",
  "merchant-cash-advance",
  "no-doc-loans",
  "payroll-funding",
  "revenue-based-financing",
  "sba-loans",
  "startup-business-loans",
  "term-loans",
];

// High-value contractor industries get priority boost
const HIGH_VALUE_INDUSTRIES = new Set([
  "roofing", "hvac", "plumbing", "electrician",
  "construction", "general-contractors", "solar",
]);

export default function sitemap() {
  const lastModified = new Date().toISOString();
  const urls = [];

  // ── Static pages ──────────────────────────────────────────
  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/state-loans", priority: 0.9, changeFrequency: "weekly" },
    { path: "/apply", priority: 0.9, changeFrequency: "monthly" },
    { path: "/loan-programs", priority: 0.8, changeFrequency: "monthly" },
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
    { path: "/business-services", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about-us", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  ];

  staticPages.forEach(({ path, priority, changeFrequency }) => {
    urls.push({
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    });
  });

  // ── Loan program pages ────────────────────────────────────
  LOAN_PROGRAMS.forEach((slug) => {
    urls.push({
      url: `${BASE_URL}/loan-programs/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // ── Industry hub pages ────────────────────────────────────
  INDUSTRIES.forEach((slug) => {
    urls.push({
      url: `${BASE_URL}/industries/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // ── State hub pages ───────────────────────────────────────
  Object.keys(stateCityMap).forEach((stateSlug) => {
    urls.push({
      url: `${BASE_URL}/state-loans/${stateSlug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // ── City pages + industry pages ───────────────────────────
  Object.keys(stateCityMap).forEach((stateSlug) => {
    const S = stateCityMap[stateSlug];
    if (!S?.cities) return;

    S.cities.forEach((city) => {
      // City hub page
      urls.push({
        url: `${BASE_URL}/state-loans/${stateSlug}/${city.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });

      // City × industry pages
      INDUSTRIES.forEach((industry) => {
        const isHighValue = HIGH_VALUE_INDUSTRIES.has(industry);
        urls.push({
          url: `${BASE_URL}/state-loans/${stateSlug}/${city.slug}/industry/${industry}`,
          lastModified,
          changeFrequency: "monthly",
          priority: isHighValue ? 0.9 : 0.7,
        });
      });
    });
  });

  return urls;
}
