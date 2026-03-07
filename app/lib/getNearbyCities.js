import stateCityMap from "@/app/lib/stateCityMap";

export default function getNearbyCities({ stateSlug, citySlug, max = 4 }) {
  const stateData = stateCityMap?.[stateSlug];
  if (!stateData?.cities) return [];

  return stateData.cities
    .map((c) => c.slug)
    .filter((slug) => slug !== citySlug)
    .slice(0, max);
}