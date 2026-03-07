import industryPopularityMap from "./industryPopularityMap";

const GLOBAL_FALLBACK = ["hvac", "roofing", "plumbing", "electrician"];

export function getIndustryOrder({ state, city }) {
  const stateData = industryPopularityMap[state];

  let order = [];

  if (stateData) {
    if (city && stateData.cities?.[city]) {
      order = stateData.cities[city];
    } else {
      order = stateData.default || [];
    }
  }

  // Merge with fallback so we always have at least 4 slugs
  const merged = [
    ...order,
    ...GLOBAL_FALLBACK.filter((slug) => !order.includes(slug)),
  ];

  // Always pin HVAC to position 0
  const withoutHvac = merged.filter((slug) => slug !== "hvac");
  return ["hvac", ...withoutHvac];
}
