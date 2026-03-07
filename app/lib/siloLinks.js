import stateCityMap from "@/app/lib/stateCityMap";

// Generates links to other cities in the same state
export function sameStateLinks(state) {
  return stateCityMap[state]?.cities || [];
}

// Generates cross-state lateral SEO links
export function nextMarkets(state) {
  const stateKeys = Object.keys(stateCityMap);
  const index = stateKeys.indexOf(state);
  return [
    stateCityMap[stateKeys[index + 1]]?.stateLoanSlug,
    stateCityMap[stateKeys[index - 1]]?.stateLoanSlug,
  ].filter(Boolean);
}// JavaScript Document