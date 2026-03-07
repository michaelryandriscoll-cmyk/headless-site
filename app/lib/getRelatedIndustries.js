// app/lib/getRelatedIndustries.js

import industryPopularityMap from "@/app/lib/industryPopularityMap";
import industries from "@/app/lib/_industryList25";

const CONTRACTOR_HUB = "hvac";

const CONTRACTOR_CLUSTER = [
  "hvac",
  "roofing",
  "plumbing",
  "electrician",
  "solar",
  "general-contractors",
];

const FALLBACK = [
  "hvac",
  "roofing",
  "plumbing",
  "electrician",
  "cleaning",
  "landscaping",
];

export default function getRelatedIndustries({
  state,
  city,
  industry,
  max = 4,
}) {
  const validIndustries = industries.map((i) => i.slug);

  // HVAC/contractor hub links outward to cluster
  if (industry === CONTRACTOR_HUB) {
    return CONTRACTOR_CLUSTER
      .filter((slug) => slug !== industry && validIndustries.includes(slug))
      .slice(0, max);
  }

  // Contractor industries link back to hub + siblings
  if (CONTRACTOR_CLUSTER.includes(industry)) {
    const list = [
      CONTRACTOR_HUB,
      ...CONTRACTOR_CLUSTER.filter((i) => i !== industry),
    ];
    return list
      .filter((slug) => validIndustries.includes(slug))
      .slice(0, max);
  }

  // Everyone else: pull from popularity map
  const stateData = industryPopularityMap?.[state];
  const cityIndustries =
    stateData?.cities?.[city] ||
    stateData?.default ||
    FALLBACK;

  return cityIndustries
    .filter((slug) => slug !== industry && validIndustries.includes(slug))
    .slice(0, max);
}
