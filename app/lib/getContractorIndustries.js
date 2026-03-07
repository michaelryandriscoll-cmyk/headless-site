export default function getContractorIndustries(currentIndustry) {
  const cluster = [
    "hvac",
    "roofing",
    "plumbing",
    "electrician",
    "solar",
    "general-contractors"
  ];

  return cluster
    .filter((slug) => slug !== currentIndustry)
    .slice(0, 4);
}// JavaScript Document