import "@/app/styles/loan-page.css";
import LeadForm from "@/app/components/LeadForm";
import Script from "next/script";
import { notFound } from "next/navigation";

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

/* =========================
   UTILITY HELPERS
========================= */

const hasText = (v) => typeof v === "string" && v.trim().length > 0;
const hasItems = (v) => Array.isArray(v) && v.length > 0;

/* =========================
   GRAMMAR HELPERS
========================= */

const startsWithVowelSound = (word = "") => {
  if (!word) return false;
  const vowelSoundPatterns = [
    /^honest/i,
    /^hour/i,
    /^honor/i,
    /^mba/i,
    /^sba/i,
    /^[aeiou]/i,
  ];
  return vowelSoundPatterns.some((r) => r.test(word));
};

const withIndefiniteArticle = (phrase = "") => {
  const firstWord = phrase.split(" ")[0];
  return `${startsWithVowelSound(firstWord) ? "an" : "a"} ${phrase}`;
};

const getLoanNameParts = (title = "") => {
  const cleaned = title.replace(/loans?/i, "").trim();
  const base = cleaned || "Business";
  const singular = cleaned ? `${cleaned} Loan` : "Business Loan";
  const plural = cleaned ? `${cleaned} Loans` : "Business Loans";
  return {
    base,
    singular,
    plural,
    withArticle: withIndefiniteArticle(singular),
  };
};

/* =========================
   FALLBACK COPY
========================= */

const HERO_FALLBACKS = {
  headline: (loan) => `Flexible ${loan.plural} Built for Growth`,
  subheadline: (loan) =>
    `Fast decisions, flexible terms, and ${loan.base.toLowerCase()} options tailored to your business.`,
};

const STEPS_FALLBACKS = {
  headline: (loan) => `How ${loan.singular} Works`,
  steps: (loan) => [
    { text: `Apply for ${loan.withArticle} in minutes` },
    { text: `Compare ${loan.plural} side by side` },
    { text: `Get funded with flexible ${loan.base.toLowerCase()} terms` },
  ],
  footer: "Same-day decisions • No obligation • No impact to credit",
};

const FORM_FALLBACKS = {
  headline: (loan) => `See If You Qualify for ${loan.withArticle}`,
  subtext:
    "Apply once to compare options — no obligation and no impact to your credit.",
};

const CTA_FALLBACKS = {
  headline: (loan) => `See If You Qualify for ${loan.plural}`,
  subtext: "Check your options in minutes with no impact to your credit.",
  button: (loan) => `Check ${loan.singular} Eligibility`,
  link: "/apply",
};

/* =========================
   HERO IMAGE RESOLVER
========================= */

const getHeroImage = ({ slug, loan }) => ({
  src: `/hero/${slug}.png`,
  alt: loan.plural,
});

/* =========================
   GRAPHQL QUERY
========================= */

const LOAN_PAGE_QUERY = `
  query LoanPageByUri($uri: String!) {
    pageBy(uri: $uri) {
      title
      uri
      loanPageStarterKit {
        heroHeadline
        heroSubheadline
        heroBullets { text }

        stepsHeadline
        steps { text }
        stepsFooter

        formHeadline
        formSubtext
        formTrustBullets { text }

        finalHeadline
        finalSubtext
        finalCtaText
        finalCtaLink
      }
    }
  }
`;

/* =========================
   DATA FETCHER
========================= */

async function fetchLoanPage(slug) {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
    body: JSON.stringify({
      query: LOAN_PAGE_QUERY,
      variables: { uri: `/${slug}/` },
    }),
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.pageBy ?? null;
}

/* =========================
   PAGE COMPONENT
========================= */

export default async function LoanPageTemplate({ slug }) {
  const page = await fetchLoanPage(slug);
  if (!page?.loanPageStarterKit) notFound();

  const d = page.loanPageStarterKit;
  const loan = getLoanNameParts(page.title);
  const heroImage = getHeroImage({ slug, loan });

  const heroHeadline = hasText(d.heroHeadline)
    ? d.heroHeadline
    : HERO_FALLBACKS.headline(loan);

  const heroSubheadline = hasText(d.heroSubheadline)
    ? d.heroSubheadline
    : HERO_FALLBACKS.subheadline(loan);

  const stepsHeadline = hasText(d.stepsHeadline)
    ? d.stepsHeadline
    : STEPS_FALLBACKS.headline(loan);

  const stepsItems = hasItems(d.steps)
    ? d.steps
    : STEPS_FALLBACKS.steps(loan);

  const stepsFooter = hasText(d.stepsFooter)
    ? d.stepsFooter
    : STEPS_FALLBACKS.footer;

  const formHeadline = hasText(d.formHeadline)
    ? d.formHeadline
    : FORM_FALLBACKS.headline(loan);

  const formSubtext = hasText(d.formSubtext)
    ? d.formSubtext
    : FORM_FALLBACKS.subtext;

  const finalHeadline = hasText(d.finalHeadline)
    ? d.finalHeadline
    : CTA_FALLBACKS.headline(loan);

  const finalSubtext = hasText(d.finalSubtext)
    ? d.finalSubtext
    : CTA_FALLBACKS.subtext;

  const finalCtaText = hasText(d.finalCtaText)
    ? d.finalCtaText
    : CTA_FALLBACKS.button(loan);

  const finalCtaLink = d.finalCtaLink || CTA_FALLBACKS.link;

  // LoanOrCredit schema
  const loanSchema = {
    "@context": "https://schema.org",
    "@type": "LoanOrCredit",
    name: loan.plural,
    description: heroSubheadline,
    provider: {
      "@type": "FinancialService",
      name: "Small Business Capital",
      url: "https://smallbusiness.capital",
      telephone: "+18889008979",
    },
    amount: {
      "@type": "MonetaryAmount",
      minValue: 10000,
      maxValue: 500000,
      currency: "USD",
    },
    loanTerm: {
      "@type": "QuantitativeValue",
      minValue: 3,
      maxValue: 60,
      unitText: "months",
    },
    url: `https://smallbusiness.capital/loan-programs/${slug}`,
  };

  return (
    <main className="loan-page loan-theme">

      <Script
        id={`loan-schema-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loanSchema) }}
      />

      <section className="loan-hero">
        <div className="container loan-hero-grid">
          <div className="loan-hero-copy">
            <h1>{heroHeadline}</h1>
            <p className="loan-hero-sub">{heroSubheadline}</p>

            {hasItems(d.heroBullets) && (
              <div className="hero-features">
                {d.heroBullets.map((b, i) => (
                  <span key={i}>✔ {b.text}</span>
                ))}
              </div>
            )}
          </div>

          <div className="loan-hero-visual">
            <img src={heroImage.src} alt={heroImage.alt} />
          </div>
        </div>
      </section>

      <section className="wc-steps">
        <div className="container">
          <h2>{stepsHeadline}</h2>
          <div className="wc-steps-grid">
            {stepsItems.map((s, i) => (
              <div key={i} className="wc-step">
                <span>{i + 1}</span>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
          <p className="wc-amounts">{stepsFooter}</p>
        </div>
      </section>

      <section className="loan-form">
        <div className="container wc-form-inner">
          <h2>{formHeadline}</h2>
          <p>{formSubtext}</p>
          <LeadForm />
        </div>
      </section>

      <section className="loan-final">
        <div className="container">
          <div className="loan-final-card">
            <h2>{finalHeadline}</h2>
            <p>{finalSubtext}</p>
            <a href={finalCtaLink} className="loan-final-cta">
              {finalCtaText}
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
