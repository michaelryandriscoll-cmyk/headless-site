// app/lib/normalizeIndustryPage.js
import industries from "@/app/lib/_industryList25";

export default function normalizeIndustryPage({
  city,
  citySlug = "",
  state,
  stateSlug = "",
  industrySlug,
  stateNode
}) {
  const industryConfig = industries.find((i) => i.slug === industrySlug);

  if (!industryConfig) {
    throw new Error(
      `normalizeIndustryPage: industryConfig missing for ${industrySlug}`
    );
  }

  const fields = stateNode?.stateLoanFields || {};

  const introTemplates = industryConfig.introTemplates || [];
  const intro =
    introTemplates.length > 0
      ? introTemplates[Math.floor(Math.random() * introTemplates.length)]
          .replace("{{city}}", city)
          .replace("{{state}}", state)
      : "";

  // 🔒 Normalize WP fields (empty strings ≠ valid)
  const wpCredit =
    typeof fields.creditScore === "string" && fields.creditScore.trim()
      ? fields.creditScore.trim()
      : null;

  const wpSpeed =
    typeof fields.processingTime === "string" && fields.processingTime.trim()
      ? fields.processingTime.trim()
      : null;

  return {
    city,
    citySlug,
    state,
    stateSlug,

    // keep the slug too (used for links + images + testimonials)
    industrySlug,

    // display labels
    industry: industryConfig.industry,
    audience: industryConfig.audience,

    intro,
    bestFor: [
      ...(industryConfig.bestForCore || []),
      ...(industryConfig.bestForExtras || []),
    ],
    stats: {
      // ✅ WORDPRESS ALWAYS WINS IF PRESENT
      credit: wpCredit || industryConfig.stats?.credit || "580+",
      speed: wpSpeed || industryConfig.stats?.speed || "24–72 Hours",
      terms: industryConfig.stats?.terms || "6–24 Months",
    },
  };
}