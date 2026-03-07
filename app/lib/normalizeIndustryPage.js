// app/lib/normalizeIndustryPage.js
import industries from "@/app/lib/_industryList25";

export default function normalizeIndustryPage({
  city,
  citySlug = "",
  state,
  stateSlug = "",
  industrySlug,
  stateNode = null, // kept for backwards compatibility, no longer used for stats
}) {
  const industryConfig = industries.find((i) => i.slug === industrySlug);
  if (!industryConfig) {
    throw new Error(
      `normalizeIndustryPage: industryConfig missing for ${industrySlug}`
    );
  }

  // Deterministic intro selection — avoids Next.js hydration mismatch
  // that occurs when Math.random() produces different values on server vs client
  const introTemplates = industryConfig.introTemplates || [];
  const intro =
    introTemplates.length > 0
      ? introTemplates[city.length % introTemplates.length]
          .replace(/\{\{city\}\}/g, city)
          .replace(/\{\{state\}\}/g, state)
      : `${industryConfig.audience || "Businesses"} in ${city}, ${state} benefit from fast, flexible financing for working capital, equipment, and growth.`;

  return {
    city,
    citySlug,
    state,
    stateSlug,
    industrySlug,
    industry: industryConfig.industry,
    audience: industryConfig.audience,
    intro,
    bestFor: [
      ...(industryConfig.bestForCore || []),
      ...(industryConfig.bestForExtras || []),
    ],
    stats: {
      credit: industryConfig.stats?.credit || "580+",
      speed: industryConfig.stats?.speed || "24–72 Hours",
      terms: industryConfig.stats?.terms || "6–24 Months",
    },
  };
}
