// app/state-loans/[state]/[city]/industry/[industry]/page.js
import normalizeIndustryPage from "@/app/lib/normalizeIndustryPage";
import IndustryCityTemplate from "@/app/components/IndustryCityTemplate";
import stateCityMap from "@/app/lib/stateCityMap";
import industries from "@/app/lib/_industryList25";
import getRelatedIndustries from "@/app/lib/getRelatedIndustries";
import IntentCTAClient from "@/app/components/IntentCTAClient";
import { buildMetadata, buildIntro } from "@/app/lib/seoTemplates";
import { notFound } from "next/navigation";

export const revalidate = 86400;
export const dynamicParams = true;

const normalizeStateSlug = (slug = "") => slug.toLowerCase().trim();
const normalizeCitySlug = (slug = "") => slug.toLowerCase().trim();

const titleCase = (str = "") =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/* ---------------------------------------------------------
   Static Params
--------------------------------------------------------- */


/* ---------------------------------------------------------
   Metadata — uses shared seoTemplates utility
--------------------------------------------------------- */

export async function generateMetadata({ params }) {
  const { state, city, industry: industryParam } = await params;
  const stateSlug = normalizeStateSlug(state || "");
  const citySlug = normalizeCitySlug(city || "");
  const industrySlug = industryParam || "";

  const S = stateCityMap[stateSlug];
  const C = S?.cities?.find((c) => c.slug === citySlug);
  const industryMeta = industries.find((i) => i.slug === industrySlug);

  const cityName = C?.name || titleCase(citySlug);
  const stateName = S?.stateName || titleCase(stateSlug);

  return buildMetadata({
    cityName,
    stateName,
    industrySlug,
    industry: industryMeta,
    stateSlug,
    citySlug,
  });
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */

export default async function IndustryCityPage({ params }) {
  const { state, city, industry: industryParam } = await params;
  const stateParam = state || "";
  const cityParam = city || "";
  const industrySlug = industryParam || "";

  const normalizedState = normalizeStateSlug(stateParam);
  const normalizedCity = normalizeCitySlug(cityParam);

  const S = stateCityMap[normalizedState];
  if (!S) return notFound();

  const C = S.cities?.find((c) => c.slug === normalizedCity);
  if (!C) return notFound();

  const industryMeta = industries.find((i) => i.slug === industrySlug);
  if (!industryMeta) return notFound();

  /* ---------------------------------------------------------
     Build page data from local data — no WordPress fetch needed
  --------------------------------------------------------- */

  const intro = buildIntro({
    cityName: C.name,
    stateName: S.stateName,
    industry: industryMeta,
  });

  const pageData = normalizeIndustryPage({
    stateNode: null,
    city: C.name,
    citySlug: normalizedCity,
    state: S.stateName,
    stateSlug: normalizedState,
    industrySlug,
    creditScore: industryMeta.stats?.credit,
    processingTime: industryMeta.stats?.speed,
    terms: industryMeta.stats?.terms,
    intro,
  });

  /* ---------------------------------------------------------
     Related Industries
  --------------------------------------------------------- */

  const relatedIndustrySlugs = getRelatedIndustries({
    state: normalizedState,
    city: normalizedCity,
    industry: industrySlug,
  });

  const relatedIndustries = relatedIndustrySlugs
    .map((slug) => {
      const meta = industries.find((i) => i.slug === slug);
      return { slug, label: meta?.industry || meta?.label || titleCase(slug) };
    })
    .filter(Boolean);

  const finalPageData = {
    ...pageData,
    relatedIndustries,
    relatedBasePath: `/state-loans/${normalizedState}/${C.slug}/industry`,
  };

  return (
    <>
      <IndustryCityTemplate {...finalPageData} />
      <IntentCTAClient
        city={C.name}
        state={S.stateName}
        industry={industrySlug}
        variant="industry"
      />
    </>
  );
}
