import "@/app/styles/LoanLayout.css";
import "@/app/styles/loan-page.css";
import LeadForm from "@/app/components/LeadForm";
import { notFound } from "next/navigation";

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

/* =========================
   UTILITY HELPERS
========================= */

const hasText = (v) => typeof v === "string" && v.trim().length > 0;
const hasItems = (v) => Array.isArray(v) && v.length > 0;

const LoanLink = ({ loan }) => (
  <a href={`/${loan.slug}/`}>{loan.title}</a>
);

const HIDE_RELATED_LINKS_ON = [
  "no-doc-loans",
  "revenue-based-financing",
  "bad-credit-loans",
];

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
   RELATED LOANS (CANONICAL)
========================= */

const RELATED_LOANS_MAP = {
  "working-capital-loans": [
    { slug: "bad-credit-loans", label: "Bad Credit Loans" },
    { slug: "no-doc-loans", label: "No Doc Loans" },
    { slug: "revenue-based-financing", label: "Revenue-Based Financing" },
  ],

  "bad-credit-loans": [
    { slug: "working-capital-loans", label: "Working Capital Loans" },
    { slug: "no-doc-loans", label: "No Doc Loans" },
    { slug: "startup-loans", label: "Startup Loans" },
  ],

  "no-doc-loans": [
    { slug: "working-capital-loans", label: "Working Capital Loans" },
    { slug: "revenue-based-financing", label: "Revenue-Based Financing" },
    { slug: "bad-credit-loans", label: "Bad Credit Loans" },
  ],

  "revenue-based-financing": [
    { slug: "working-capital-loans", label: "Working Capital Loans" },
    { slug: "no-doc-loans", label: "No Doc Loans" },
    { slug: "startup-loans", label: "Startup Loans" },
  ],

  "startup-loans": [
    { slug: "no-doc-loans", label: "No Doc Loans" },
    { slug: "bad-credit-loans", label: "Bad Credit Loans" },
    { slug: "working-capital-loans", label: "Working Capital Loans" },
  ],
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

const getHeroImage = ({ d, slug, loan }) => {
  const img = d.heroImage?.node;

  if (img?.sourceUrl) {
    return {
      src: img.sourceUrl,
      alt: img.altText || loan.plural,
    };
  }

  return {
    src: `/hero/${slug}.png`,
    alt: loan.plural,
    fallback: true,
  };
};

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

  		heroImage {
    node {
      sourceUrl
      altText
    }
  }

  		heroBullets { text }

        whatTitle
        whatDescription
        whatBullets { text }

        whoItems {
          title
          description
        }

        stepsHeadline
        steps { text }
        stepsFooter

        formHeadline
        formSubtext
        formTrustBullets { text } 

        leftTitle
        compareLeftBullets { text }

        rightTitle
        compareRightBullets { text }

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
   METADATA
========================= */

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await fetchLoanPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    alternates: {
      canonical: `https://smallbusiness.capital${page.uri}`,
    },
  };
}

/* =========================
   PAGE COMPONENT
========================= */

export default async function LoanTypePage({ params }) {
  const { slug } = await params;
  const page = await fetchLoanPage(slug);
  if (!page?.loanPageStarterKit) notFound();

  const d = page.loanPageStarterKit;
  const loan = getLoanNameParts(page.title);
  const heroImage = getHeroImage({ d, slug, loan });
	  
  const relatedLoans = RELATED_LOANS_MAP[slug] || [];

  /* ---------- Resolved Copy ---------- */

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

  /* =========================
     RENDER
  ========================= */

  return (
    <main className="loan-page">

      {/* ================= HERO ================= */}
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
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              loading="eager"
            />
          </div>

        </div>
      </section>

		<span className="section-eyebrow">Overview</span>

		{/* ================= WHAT ================= */}
		{(
		  hasText(d.whatTitle) ||
		  hasText(d.whatDescription) ||
		  hasItems(d.whatBullets)
		) && (
		  <section className="loan-what">
			<div className="container loan-what-grid">

			  <div className="loan-what-copy">
				{hasText(d.whatTitle) && <h2>{d.whatTitle}</h2>}

				{hasText(d.whatDescription) && (
				  <div
					className="loan-what-description"
					dangerouslySetInnerHTML={{ __html: d.whatDescription }}
				  />
				)}
			  </div>

			  {hasItems(d.whatBullets) && (
				<div className="loan-what-bullets">
				  <ul>
					{d.whatBullets.map((b, i) => (
					  <li key={i}>✔ {b.text}</li>
					))}
				  </ul>
				</div>
			  )}

			{relatedLoans.length > 0 && (
			  <div className="loan-what-related">
				<p>
				  Not sure this is the right fit? You may also want to explore{" "}
				  {relatedLoans.map((loan, i) => (
					<span key={loan.slug}>
					  <a href={`/${loan.slug}/`}>{loan.label}</a>
					  {i < relatedLoans.length - 1 && ", "}
					</span>
				  ))}
				  .
				</p>
			  </div>
			)}

			</div>
		  </section>
		)} 

		{/* ================= WHO ================= */} 
		{hasItems(d.whoItems) && (
		  <section className="loan-who">
			<div className="container">
			  <h2>Who This Loan Is For</h2>

			  <div className="loan-who-grid">
				{d.whoItems.map((item, i) => (
				  <div key={i} className="loan-who-card">
			<div className="loan-who-card-icon">✓</div>
					<h4>{item.title}</h4>
					<p>{item.description}</p>
				  </div>
				))}
			  </div>
			</div>
		  </section>
		)}
		
		
		{/* ================= HOW / STEPS ================= */}
		<section className="loan-how">
		  <div className="container">

			<header className="loan-how-header">
			  <span className="section-eyebrow">How it works</span>
			  <h2>{stepsHeadline}</h2>
			</header>

			<ol className="loan-how-rail">
			  {stepsItems.map((s, i) => (
				<li key={i} className="loan-how-step">
				  <div className="loan-how-badge">{i + 1}</div>

				  <div className="loan-how-body">
					<p>{s.text}</p>
				  </div>
				</li>
			  ))}
			</ol>

			{hasText(stepsFooter) && (
			  <p className="loan-how-footer">{stepsFooter}</p>
			)}
		  </div>
		</section>

      {/* ================= FORM ================= */}
      <section className="loan-form">
        <div className="container wc-form-inner">
          <h2>{formHeadline}</h2>
          <p>{formSubtext}</p>

          <LeadForm />

          {hasItems(d.formTrustBullets) && (
            <ul className="form-trust">
              {d.formTrustBullets.map((b, i) => (
                <li key={i}>✔ {b.text}</li>
              ))}
            </ul>
          )}
        </div>
      </section> 

			{/* ================= WHY US VS BANKS ================= */}
		{(
		  hasText(d.leftTitle) ||
		  hasText(d.rightTitle) ||
		  hasItems(d.compareLeftBullets) ||
		  hasItems(d.compareRightBullets)
		) && (
		  <section className="loan-compare-why">
			<div className="container">

			  <header className="loan-compare-header">
				<span className="section-eyebrow">Why choose us</span>
				<h2>{loan.plural} vs Traditional Banks</h2>
				<p>See how modern funding compares to old-school lending.</p>
			  </header>

			  <div className="loan-compare-cards">

				{/* YOUR OFFER */}
				<div className="loan-compare-card loan-compare-card--primary">
				

				  <h3>
					{hasText(d.leftTitle)
					  ? d.leftTitle
					  : loan.plural}
				  </h3>

				  {hasItems(d.compareLeftBullets) && (
					<ul className="loan-compare-list loan-compare-list--positive">
					  {d.compareLeftBullets.map((b, i) => (
						<li key={i}>
						  <span className="icon-check">✓</span>
						  {b.text}
						</li>
					  ))}
					</ul>
				  )}
				</div>

				{/* BANKS */}
				<div className="loan-compare-card loan-compare-card--secondary">
				  <h3>
					{hasText(d.rightTitle)
					  ? d.rightTitle
					  : "Traditional Banks"}
				  </h3>

				  {hasItems(d.compareRightBullets) && (
					<ul className="loan-compare-list loan-compare-list--negative">
					  {d.compareRightBullets.map((b, i) => (
						<li key={i}>
						  <span className="icon-x">✕</span>
						  {b.text}
						</li>
					  ))}
					</ul>
				  )}
				</div>

			  </div>
			</div> 
		  </section>
		)}

      {/* ================= FINAL CTA ================= */}
      <section className="loan-final">
        <div className="container">
          <div className="loan-final-card">
            <h2>{finalHeadline}</h2>
            <p>{finalSubtext}</p>
            <a href={finalCtaLink} className="loan-final-cta">
              {finalCtaText}
            </a>
          </div>

		{relatedLoans.length > 0 && (
		  <p className="loan-final-alt">
			Looking for a different option?{" "}
			{relatedLoans.map((loan, i) => (
			  <span key={loan.slug}>
				<a href={`/${loan.slug}/`}>{loan.label}</a>
				{i < relatedLoans.length - 1 && " or "}
			  </span>
			))}
			.
		  </p>
		)}

        </div>
      </section>

    </main>
  );
}