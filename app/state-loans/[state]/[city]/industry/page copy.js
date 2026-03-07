// app/state-loans/[state]/[city]/industry/[industry]/page.js

import normalizeIndustryPage from "@/app/lib/normalizeIndustryPage";
import IndustryCityTemplate from "@/app/components/IndustryCityTemplate";
import stateCityMap from "@/app/lib/stateCityMap";
import industries from "@/app/lib/_industryList25";
import getRelatedIndustries from "@/app/lib/getRelatedIndustries";
import IntentCTAClient from "@/app/components/IntentCTAClient"; // ← add this
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

const normalizeStateSlug = (slug = "") =>
  slug.toLowerCase().trim().replace(/-business-loans$/, "").replace(/-loans$/, "");

const normalizeCitySlug = (slug = "") =>
  slug.toLowerCase().trim().replace(/-business-loans$/, "").replace(/-loans$/, "");

const titleCase = (str = "") =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/* ---------------------------------------------------------
   Static Params
--------------------------------------------------------- */

export async function generateStaticParams() {
  const params = [];

  Object.keys(stateCityMap || {}).forEach((state) => {
    const S = stateCityMap[state];
    (S?.cities || []).forEach((city) => {
      industries.forEach((ind) => {
        params.push({
          state,
          city: city.slug,
          industry: ind.slug,
        });
      });
    });
  });

  return params;
}

/* ---------------------------------------------------------
   Metadata
--------------------------------------------------------- */

export async function generateMetadata({ params }) {
  const stateSlug = normalizeStateSlug(params?.state || "");
  const citySlug = normalizeCitySlug(params?.city || "");
  const industrySlug = params?.industry || "";

  const cityName = titleCase(citySlug);
  const industryName = titleCase(industrySlug);

  return {
    title: `${cityName} ${industryName} Business Loans | Fast Contractor Funding`,
    description: `Get fast business loans for ${industryName.toLowerCase()} businesses in ${cityName}. Compare working capital, equipment financing, and flexible funding options.`,
  };
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */

export default async function IndustryCityPage({ params }) {
  const stateParam = params?.state || "";
  const cityParam = params?.city || "";
  const industrySlug = params?.industry || "";

  const normalizedState = normalizeStateSlug(stateParam);
  const normalizedCity = normalizeCitySlug(cityParam);

  const S = stateCityMap[normalizedState];
  if (!S) return notFound();

  const C = S.cities?.find(
    (c) => normalizeCitySlug(c.slug) === normalizedCity
  );
  if (!C) return notFound();

  // Validate industry exists in old list
  const industryMeta = industries.find((i) => i.slug === industrySlug);
  if (!industryMeta) return notFound();

  /* ---------------------------------------------------------
     Fetch WP State Data
  --------------------------------------------------------- */

  const res = await fetch("https://smallbusiness.capital/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query StateLoans {
          stateLoans {
            nodes {
              slug
              stateLoanFields {
                creditScore
                processingTime
              }
            }
          }
        }
      `,
    }),
    next: { revalidate: 86400 },
  });

  const wpData = await res.json();

  const stateNode = wpData?.data?.stateLoans?.nodes?.find(
    (n) => n.slug === S.stateLoanSlug
  );

  /* ---------------------------------------------------------
     Normalize Page Data (Old System)
  --------------------------------------------------------- */

  const pageData = normalizeIndustryPage({
    stateNode,
    city: C.name,
    citySlug: normalizedCity,
    state: S.stateName,
    stateSlug: normalizedState,
    industrySlug,
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
      return {
        slug,
        label: meta?.industry || meta?.label || titleCase(slug),
      };
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