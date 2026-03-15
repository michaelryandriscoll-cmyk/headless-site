import "@/app/styles/loan-page.css";
import LeadForm from "@/app/components/LeadForm";
import Link from "next/link";
import { notFound } from "next/navigation"; 

export const dynamic = "force-static";
export const revalidate = 60;

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

  return [
    /^honest/i,
    /^hour/i,
    /^honor/i,
    /^mba/i,
    /^sba/i,
    /^[aeiou]/i,
  ].some((r) => r.test(word));
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
   STRUCTURED DATA HELPERS
========================= */

function getBreadcrumbSchema({ slug, title }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://smallbusiness.capital/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Loan Programs",
        item: "https://smallbusiness.capital/loan-programs/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://smallbusiness.capital/loan-programs/${slug}/`,
      },
    ],
  };
}

function getLoanSchema({ loan, slug }) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: loan.plural,
    category: "Loan",
    provider: {
      "@type": "Organization",
      name: "Small Business Capital",
      url: "https://smallbusiness.capital",
    },
    url: `https://smallbusiness.capital/loan-programs/${slug}/`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Small Business Owners",
    },
  };
}

/* =========================
   SLUG ALIASES
   (WordPress slug → canonical slug)
========================= */

const SLUG_ALIASES = {
  "business-loans-for-bad-credit": "bad-credit-loans",
  "startup-business-loans": "startup-loans",
  "working-capital-loan": "working-capital-loans",
  "no-documentation-loans": "no-doc-loans",
};


function normalizeLoanSlug(slug) {
  if (!slug) return "";

  const raw = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  // if slug accidentally contains "loan-programs/..."
  const cleaned = raw.replace(/^loan-programs\//, "");

  return SLUG_ALIASES[cleaned] || cleaned;
}

/* =========================
   FAQ SCHEMA + DATA HELPERS
========================= */

function getFaqSchema(faqs = []) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function getFaqsForSlug(slug) {
  const loanFaqs = FAQS_BY_SLUG[slug] || [];
  const defaultFaqs = FAQS_BY_SLUG.default || [];

  // Merge + remove duplicates by question text
  const merged = [...loanFaqs, ...defaultFaqs];

  const seen = new Set();
  return merged.filter((faq) => {
    const key = faq.q?.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* =========================
   FAQ DATA
========================= */

const FAQS_BY_SLUG = {
  // =========================
  // WORKING CAPITAL LOANS
  // =========================
  "working-capital-loans": [
    {
      q: "What are working capital loans used for?",
      a: "Working capital loans help cover everyday business expenses such as payroll, inventory, rent, marketing, and cash flow gaps.",
    },
    {
      q: "How fast can I get funded?",
      a: "Many businesses receive funding within 24–48 hours after approval, depending on the lender and documentation required.",
    },
    {
      q: "Do working capital loans require collateral?",
      a: "Some working capital options are unsecured, while others may use a general business lien instead of specific collateral.",
    },
    {
      q: "What do lenders look at to approve a working capital loan?",
      a: "Most lenders review revenue, time in business, recent bank activity, and overall cash flow consistency.",
    },
  ],

  // =========================
  // BAD CREDIT LOANS
  // =========================
  "bad-credit-loans": [
    {
      q: "Can I qualify for a business loan with bad credit?",
      a: "Yes. Many lenders focus more on your business revenue and cash flow than your personal credit score.",
    },
    {
      q: "What credit score is considered bad credit?",
      a: "Credit score ranges vary, but many lenders consider scores below the mid-600s as “challenged credit.” Options may still be available.",
    },
    {
      q: "Do bad credit loans have higher rates?",
      a: "They can. Rates often reflect risk, but strong revenue and clean bank activity can help you qualify for better terms.",
    },
    {
      q: "What can I do to improve approval odds?",
      a: "Maintaining consistent deposits, reducing overdrafts, and keeping business finances organized can help improve approval chances.",
    },
  ],

  // =========================
  // NO DOC LOANS
  // =========================
  "no-doc-loans": [
    {
      q: "What is a no doc business loan?",
      a: "A no doc loan is a business funding option that requires minimal financial paperwork compared to traditional bank loans.",
    },
    {
      q: "Can I qualify without tax returns?",
      a: "Yes. Many no doc lenders rely on bank statements or revenue data instead of tax returns.",
    },
    {
      q: "How do lenders verify revenue for no doc loans?",
      a: "Most lenders review recent bank deposits or connect to your business bank account to verify income and cash flow.",
    },
    {
      q: "Are no doc loans faster than traditional loans?",
      a: "Often yes. Because documentation requirements are lighter, approvals and funding may happen much faster than bank loans.",
    },
  ],

  // =========================
  // REVENUE-BASED FINANCING
  // =========================
  "revenue-based-financing": [
    {
      q: "What is revenue-based financing?",
      a: "Revenue-based financing is a funding option where repayment is tied to your business revenue, often as a percentage of sales or deposits.",
    },
    {
      q: "How are payments made for revenue-based financing?",
      a: "Payments are typically collected automatically from your daily or weekly revenue, depending on the lender’s structure.",
    },
    {
      q: "Is revenue-based financing a loan?",
      a: "It can be structured differently than a traditional loan, but it is still a form of business funding used to access working capital.",
    },
    {
      q: "Who is revenue-based financing best for?",
      a: "It’s often a good fit for businesses with steady sales that want flexible payments tied to revenue performance.",
    },
  ],

  // =========================
  // STARTUP LOANS
  // =========================
  "startup-loans": [
    {
      q: "Can I get a business loan as a startup?",
      a: "Yes. Some lenders offer startup-friendly funding options, especially if you have revenue, strong personal credit, or a solid business plan.",
    },
    {
      q: "How long do I need to be in business to qualify?",
      a: "Requirements vary. Some lenders work with newer businesses, while others prefer 6–12+ months of operating history.",
    },
    {
      q: "Do startup loans require collateral?",
      a: "Not always. Some startup options are unsecured, though collateral or a personal guarantee may be required in certain cases.",
    },
    {
      q: "What documents might a startup need to apply?",
      a: "Depending on the lender, you may need bank statements, proof of revenue, a business plan, or basic company information.",
    },
  ],
	  
  // =========================
  // Business Line of Credit
  // =========================	  
	"business-line-of-credit": [
	  {
		q: "What is a business line of credit?",
		a: "A business line of credit is a revolving funding option that lets you draw money as needed up to an approved limit, and you only pay interest on what you use.",
	  },
	  {
		q: "How is a line of credit different from a term loan?",
		a: "A term loan provides a lump sum upfront with fixed payments, while a line of credit gives you flexible access to funds you can draw and repay repeatedly.",
	  },
	  {
		q: "Do I pay interest on the full credit limit?",
		a: "No. You typically only pay interest on the amount you actually draw, not the full approved credit limit.",
	  },
	  {
		q: "What can I use a business line of credit for?",
		a: "Common uses include payroll, inventory, marketing, rent, short-term expenses, and covering cash flow gaps during slow seasons.",
	  },
	],
		
  // =========================
  // SBA Loans
  // =========================	
		
	"sba-loans": [
	  {
		q: "What are SBA loans?",
		a: "SBA loans are business loans issued by lenders and partially guaranteed by the U.S. Small Business Administration, which can help businesses access longer terms and competitive rates.",
	  },
	  {
		q: "What can SBA loans be used for?",
		a: "SBA loans can be used for working capital, business expansion, equipment purchases, refinancing debt, and in some cases real estate or major investments.",
	  },
	  {
		q: "Are SBA loans hard to qualify for?",
		a: "SBA loans can have stricter requirements than short-term funding options, but businesses with steady revenue, time in business, and organized financials may qualify.",
	  },
	  {
		q: "How long does SBA loan approval take?",
		a: "Approval timelines vary by lender and documentation, but SBA loans often take longer than alternative funding due to the structured underwriting process.",
	  },
	],
		
  // =========================
  // Term Loans 
  // =========================	
		
	"term-loans": [
	  {
		q: "What is a business term loan?",
		a: "A term loan provides a lump sum of funding that you repay over a fixed period with set payments, often used for growth, expansion, or large purchases.",
	  },
	  {
		q: "What are term loans commonly used for?",
		a: "Businesses often use term loans for renovations, hiring, equipment purchases, expansion, inventory, or consolidating higher-cost debt.",
	  },
	  {
		q: "Do term loans have fixed payments?",
		a: "Many term loans offer predictable payments on a set schedule, which can make budgeting easier compared to variable repayment structures.",
	  },
	  {
		q: "How much can I qualify for with a term loan?",
		a: "Loan amounts vary based on your business revenue, cash flow, time in business, and overall credit profile, with options available across different ranges.",
	  },
	],
		
  // =========================
  // Equipment Financing FAQs 
  // =========================
		
	"equipment-financing": [
	  {
		q: "What is equipment financing?",
		a: "Equipment financing helps businesses purchase equipment, vehicles, or machinery by spreading the cost over time instead of paying upfront.",
	  },
	  {
		q: "Does equipment financing require collateral?",
		a: "Often the equipment being financed acts as collateral, which may make approval easier compared to unsecured financing options.",
	  },
	  {
		q: "What types of equipment can be financed?",
		a: "Common examples include construction equipment, vehicles, medical equipment, restaurant equipment, computers, machinery, and other business tools.",
	  },
	  {
		q: "How fast can equipment financing be approved?",
		a: "Many equipment financing options can be approved quickly depending on the equipment type, documentation needed, and lender requirements.",
	  },
	],

	// =========================
	// LOW CREDIT SCORE LOANS
	// =========================
	"low-credit-score-loans": [
	  {
		q: "Can I get a business loan with a low credit score?",
		a: "Yes. Many lenders offer business funding options based on revenue, cash flow, and deposits — not just your personal credit score.",
	  },
	  {
		q: "What credit score is considered “low” for business loans?",
		a: "It varies by lender, but many consider scores below the mid-600s as “challenged credit.” You may still qualify depending on business performance.",
	  },
	  {
		q: "Do low credit score loans have higher rates?",
		a: "Sometimes. Pricing can be higher due to risk, but strong revenue and consistent deposits may help you qualify for better terms.",
	  },
	  {
		q: "What do lenders look at besides credit?",
		a: "Most lenders review monthly revenue, time in business, recent bank statements, and overall cash flow consistency.",
	  },
	],

	// =========================
	// MERCHANT CASH ADVANCE (MCA)
	// =========================
	"merchant-cash-advance": [
	  {
		q: "What is a merchant cash advance (MCA)?",
		a: "A merchant cash advance provides upfront funding in exchange for a portion of your future sales. Repayment is often collected daily or weekly from revenue.",
	  },
	  {
		q: "How fast can I get funded with an MCA?",
		a: "Many businesses receive funding within 24–48 hours after approval, depending on revenue verification and processing time.",
	  },
	  {
		q: "Do merchant cash advances require good credit?",
		a: "Not always. Many MCA providers focus more on deposits and sales volume than personal credit score.",
	  },
	  {
		q: "How are MCA payments calculated?",
		a: "Payments are typically based on a percentage of daily or weekly revenue, which can make repayment more flexible during slower periods.",
	  },
	],

	// =========================
	// PAYROLL FUNDING
	// =========================
	"payroll-funding": [
	  {
		q: "What is payroll funding for small businesses?",
		a: "Payroll funding helps businesses cover employee wages when cash flow is tight, invoices are pending, or expenses spike unexpectedly.",
	  },
	  {
		q: "How quickly can payroll funding be approved?",
		a: "Many payroll funding options offer fast approvals, with funding available as soon as 24–48 hours depending on the lender and documentation.",
	  },
	  {
		q: "Do I need collateral for payroll funding?",
		a: "Not always. Many working capital solutions are unsecured, though some lenders may place a general business lien depending on the program.",
	  },
	  {
		q: "What is typically required to qualify?",
		a: "Most lenders look at revenue, deposits, time in business, and recent bank activity to confirm your business can support repayment.",
	  },
	], 

  // =========================
  // DEFAULT FAQs (AUTO-INJECTED ON ALL LOAN PAGES)
  // =========================
  default: [
    {
      q: "How does the application process work?",
      a: "You complete one short application and compare multiple funding options with no obligation.",
    },
    {
      q: "Will applying affect my credit?",
      a: "No. Checking your options does not impact your credit score.",
    },
    {
      q: "How much can I qualify for?",
      a: "Approval amounts vary based on revenue, cash flow, and business profile. Many businesses qualify for flexible funding ranges depending on eligibility.",
    },
    {
      q: "What do I need to apply?",
      a: "Most applications require basic business information, and many lenders may request bank statements or recent revenue details.",
    },
  ],
};

/* =========================
   RELATED LOANS
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
	
	"low-credit-score-loans": [
	  { slug: "working-capital-loans", label: "Working Capital Loans" },
	  { slug: "no-doc-loans", label: "No Doc Loans" },
	  { slug: "revenue-based-financing", label: "Revenue-Based Financing" },
	],
	
	"merchant-cash-advance": [
	  { slug: "working-capital-loans", label: "Working Capital Loans" },
	  { slug: "revenue-based-financing", label: "Revenue-Based Financing" },
	  { slug: "business-line-of-credit", label: "Business Line of Credit" },
	],

	"payroll-funding": [
	  { slug: "working-capital-loans", label: "Working Capital Loans" },
	  { slug: "merchant-cash-advance", label: "Merchant Cash Advance" },
	  { slug: "revenue-based-financing", label: "Revenue-Based Financing" },
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
   FALLBACK CONTENT BLOCKS
   (AUTO-FILLS THIN PAGES)
========================= */

const FALLBACK_CONTENT_BY_SLUG = {
  "sba-loans": {
    detailsTitle: "SBA Loan Details",
    detailsItems: [
      { label: "Best for", value: "Established businesses seeking long terms and lower rates" },
      { label: "Typical terms", value: "Up to 10–25 years (depending on program)" },
      { label: "Funding speed", value: "Often slower than online lenders (weeks vs days)" },
      { label: "Use cases", value: "Expansion, equipment, real estate, refinancing" },
      { label: "What matters", value: "Credit, revenue, time in business, and documentation" },
    ],
    usesTitle: "Common SBA Loan Uses",
    usesBullets: [
      "Purchase equipment or vehicles",
      "Open a new location or expand operations",
      "Refinance existing business debt",
      "Cover working capital needs",
      "Buy commercial real estate",
    ],
  },

  "working-capital-loans": {
    detailsTitle: "Working Capital Loan Details",
    detailsItems: [
      { label: "Best for", value: "Cash flow gaps, payroll, inventory, marketing" },
      { label: "Funding speed", value: "Often as fast as 24–48 hours" },
      { label: "Use cases", value: "Operating expenses, growth, short-term needs" },
      { label: "What matters", value: "Revenue consistency and bank activity" },
    ],
    usesTitle: "Common Working Capital Uses",
    usesBullets: [
      "Cover payroll and rent",
      "Buy inventory or supplies",
      "Handle seasonal slowdowns",
      "Run marketing campaigns",
      "Bridge cash flow gaps",
    ],
  },

  "startup-loans": {
    detailsTitle: "Startup Loan Details",
    detailsItems: [
      { label: "Best for", value: "New businesses building traction and early revenue" },
      { label: "Funding speed", value: "Varies by lender and documentation" },
      { label: "Use cases", value: "Launch costs, equipment, marketing, hiring" },
      { label: "What matters", value: "Credit, business plan, and cash flow (if available)" },
    ],
    usesTitle: "Common Startup Funding Uses",
    usesBullets: [
      "Launch marketing + ads",
      "Buy initial inventory",
      "Cover early operating costs",
      "Hire contractors or staff",
      "Purchase equipment or tools",
    ],
  },

  "bad-credit-loans": {
    detailsTitle: "Bad Credit Loan Details",
    detailsItems: [
      { label: "Best for", value: "Businesses with revenue but challenged credit history" },
      { label: "Funding speed", value: "Often faster than traditional banks" },
      { label: "Use cases", value: "Working capital, repairs, urgent expenses" },
      { label: "What matters", value: "Revenue and deposits more than score alone" },
    ],
    usesTitle: "Common Bad Credit Loan Uses",
    usesBullets: [
      "Catch up on bills or vendors",
      "Repair equipment or vehicles",
      "Stabilize cash flow",
      "Fund marketing to grow revenue",
      "Handle unexpected expenses",
    ],
  },

  "no-doc-loans": {
    detailsTitle: "No Doc Loan Details",
    detailsItems: [
      { label: "Best for", value: "Fast funding with minimal paperwork" },
      { label: "Funding speed", value: "Often 1–3 business days" },
      { label: "Use cases", value: "Working capital, inventory, growth expenses" },
      { label: "What matters", value: "Bank deposits and cash flow consistency" },
    ],
    usesTitle: "Common No Doc Loan Uses",
    usesBullets: [
      "Buy inventory quickly",
      "Cover short-term payroll",
      "Run ads or promotions",
      "Bridge cash flow gaps",
      "Handle urgent expenses",
    ],
  },

  "revenue-based-financing": {
    detailsTitle: "Revenue-Based Financing Details",
    detailsItems: [
      { label: "Best for", value: "Businesses with steady sales wanting flexible payments" },
      { label: "Payments", value: "Often tied to revenue (daily/weekly)" },
      { label: "Funding speed", value: "Often fast with lighter documentation" },
      { label: "Use cases", value: "Growth, marketing, inventory, expansion" },
      { label: "What matters", value: "Sales volume and revenue consistency" },
    ],
    usesTitle: "Common Revenue-Based Financing Uses",
    usesBullets: [
      "Scale marketing spend",
      "Stock inventory for demand",
      "Hire staff to grow",
      "Upgrade equipment",
      "Expand operations",
    ],
  },

  default: {
    detailsTitle: "Loan Program Details",
    detailsItems: [
      { label: "Best for", value: "Small businesses looking for flexible funding options" },
      { label: "Funding speed", value: "Fast decisions with multiple options available" },
      { label: "Use cases", value: "Growth, working capital, expansion, and cash flow" },
      { label: "What matters", value: "Revenue, time in business, and bank activity" },
    ],
    usesTitle: "Common Uses",
    usesBullets: [
      "Working capital and operating expenses",
      "Inventory and supplies",
      "Marketing and growth",
      "Equipment and upgrades",
      "Expansion and hiring",
    ],
  },
};

function getFallbackContent(slug) {
  return FALLBACK_CONTENT_BY_SLUG[slug] || FALLBACK_CONTENT_BY_SLUG.default;
}

/**
 * Decide if a page feels "thin"
 * (so we inject extra sections automatically)
 */
function isThinLoanPage(d = {}) {
  const whatHasText = hasText(d.whatDescription) || hasText(d.whatTitle);
  const whatHasBullets = hasItems(d.whatBullets) && d.whatBullets.length >= 2;
  const whoHasEnough = hasItems(d.whoItems) && d.whoItems.length >= 2;

  // If it's missing most of the "content" blocks, it's thin
  const score = [whatHasText, whatHasBullets, whoHasEnough].filter(Boolean).length;
  return score <= 1;
}

/* =========================
   HERO IMAGE
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
  };
};

/* =========================
   GRAPHQL QUERIES
========================= */

const ALL_LOAN_SLUGS_QUERY = `
  query AllLoanProgramSlugs {
    pages(where: { parent: "loan-programs" }, first: 100) {
      nodes {
        uri
      }
    }
  }
`;

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
        whoItems { title description }
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
   DATA FETCHERS
========================= */

async function fetchLoanPage(slug) {
  if (!WP_GRAPHQL_URL) return null;
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LOAN_PAGE_QUERY,
      variables: { uri: `/loan-programs/${slug}/` },
    }),
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data?.pageBy ?? null;
}

async function fetchAllLoanSlugs() {
  if (!WP_GRAPHQL_URL) return [];
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: ALL_LOAN_SLUGS_QUERY }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const json = await res.json();

  return (
    json?.data?.pages?.nodes
      ?.map((p) => p.uri)
      .map((uri) => uri.split("/").filter(Boolean).pop()) ?? []
  );
}

/* =========================
   STATIC PARAMS + METADATA
========================= */

export async function generateStaticParams() {
  const slugs = await fetchAllLoanSlugs();
  return slugs.map((slug) => ({ slug }));
}

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
   PAGE
========================= */

export default async function LoanTypePage({ params }) {
  const { slug } = await params;

  const page = await fetchLoanPage(slug);
  if (!page?.loanPageStarterKit) notFound();

  const d = page.loanPageStarterKit;
  const loan = getLoanNameParts(page.title);

  const heroImage = getHeroImage({ d, slug, loan });

  const normalizedSlug = normalizeLoanSlug(slug);

  const relatedLoans = RELATED_LOANS_MAP[normalizedSlug] || [];

  const faqs = getFaqsForSlug(normalizedSlug);
  const faqSchema = getFaqSchema(faqs);

  const isThin = isThinLoanPage(d);
  const fallback = getFallbackContent(normalizedSlug);

  const heroHeadline = hasText(d.heroHeadline)
    ? d.heroHeadline
    : HERO_FALLBACKS.headline(loan);

  const heroSubheadline = hasText(d.heroSubheadline)
    ? d.heroSubheadline
    : HERO_FALLBACKS.subheadline(loan);

  const stepsHeadline = hasText(d.stepsHeadline)
    ? d.stepsHeadline
    : STEPS_FALLBACKS.headline(loan);

  const stepsItems = hasItems(d.steps) ? d.steps : STEPS_FALLBACKS.steps(loan);

  const stepsFooter = hasText(d.stepsFooter) ? d.stepsFooter : STEPS_FALLBACKS.footer;

  const formHeadline = hasText(d.formHeadline)
    ? d.formHeadline
    : FORM_FALLBACKS.headline(loan);

  const formSubtext = hasText(d.formSubtext) ? d.formSubtext : FORM_FALLBACKS.subtext;

  const finalHeadline = hasText(d.finalHeadline)
    ? d.finalHeadline
    : CTA_FALLBACKS.headline(loan);

  const finalSubtext = hasText(d.finalSubtext) ? d.finalSubtext : CTA_FALLBACKS.subtext;

  const finalCtaText = hasText(d.finalCtaText)
    ? d.finalCtaText
    : CTA_FALLBACKS.button(loan);

  const finalCtaLink = d.finalCtaLink || CTA_FALLBACKS.link;

  const breadcrumbSchema = getBreadcrumbSchema({
    slug,
    title: page.title,
  });

  const loanSchema = getLoanSchema({
    loan,
    slug,
  });

  return (
    <main className="loan-page loan-theme">
      {/* ================= STRUCTURED DATA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loanSchema) }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* ================= HERO ================= */}
		<section className="loan-hero">
		  {/* TOP: constrained hero */}
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
				<img src={heroImage.src} alt={heroImage.alt} loading="eager" />
			</div>
		  </div>

		  {/* BOTTOM: full-width trust strip */}
		  <div className="loan-hero-trust-wrap">
			<div className="container">
			  <div className="loan-hero-trust">
				<div className="loan-hero-trust-item">
				  <span className="trust-icon">⚡</span>
				  <strong>24–72 hrs</strong>
				  <span>Typical Decisions</span>
				</div>

				<div className="loan-hero-trust-item">
				  <span className="trust-icon">🏦</span>
				  <strong>150+</strong>
				  <span>Private Lenders</span>
				</div>

				<div className="loan-hero-trust-item">
				  <span className="trust-icon">🛡️</span>
				  <strong>No Impact</strong>
				  <span>Soft Credit Review</span>
				</div>

				<div className="loan-hero-trust-item">
				  <span className="trust-icon">🌎</span>
				  <strong>Nationwide</strong>
				  <span>All 50 States</span>
				</div>
			  </div>
			</div>
		  </div>
		</section>

      {/* ================= WHAT ================= */}
      {(hasText(d.whatTitle) || hasText(d.whatDescription) || hasItems(d.whatBullets)) && (
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
                    <Link href={`/loan-programs/${loan.slug}/`}>{loan.label}</Link>
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
	  
	  {/* PREMIUM FLOW DIVIDER */}
		<div className="flow-divider" aria-hidden="true" />

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

          {hasText(stepsFooter) && <p className="loan-how-footer">{stepsFooter}</p>}
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
      {(hasText(d.leftTitle) ||
        hasText(d.rightTitle) ||
        hasItems(d.compareLeftBullets) ||
        hasItems(d.compareRightBullets)) && (
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
                <h3>{hasText(d.leftTitle) ? d.leftTitle : loan.plural}</h3>

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
                <h3>{hasText(d.rightTitle) ? d.rightTitle : "Traditional Banks"}</h3>

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

      {/* ================= FAQ ACCORDION ================= */}
      {faqs.length > 0 && (
        <section className="loan-faq">
          <div className="container">
            <header className="loan-faq-header">
              <span className="section-eyebrow">FAQs</span>
              <h2>Frequently Asked Questions</h2>
            </header>

            <div className="loan-faq-list">
              {faqs.map((faq, i) => (
                <details key={i} className="loan-faq-item">
                  <summary className="loan-faq-question">{faq.q}</summary>
                  <div className="loan-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
	  
	   {/* ================= FALLBACK CONTENT (AUTO-INJECT) ================= */}
      {isThin && (
        <>
          {/* ===== Loan Details Card ===== */}
          <section className="loan-what">
            <div className="container loan-what-grid">
              <div className="loan-what-copy">
                <span className="section-eyebrow">Details</span>
                <h2>{fallback.detailsTitle}</h2>
                <p style={{ maxWidth: "70ch" }}>
                  Here’s a quick breakdown of how this program typically works.
                </p>
              </div>

              <div className="loan-what-bullets">
                <ul>
                  {fallback.detailsItems.map((item, i) => (
                    <li key={i}>
                      <strong>{item.label}:</strong> {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ===== Common Uses Card ===== */}
          <section className="loan-who">
            <div className="container">
              <header className="loan-who-header">
                <span className="section-eyebrow">Common uses</span>
                <h2>{fallback.usesTitle}</h2>
              </header>

              <div className="loan-who-grid">
                {fallback.usesBullets.map((text, i) => (
                  <div key={i} className="loan-who-card">
                    <div className="loan-who-card-icon">✓</div>
                    <h4>{text}</h4>
                    <p>
                      A common reason businesses use {loan.plural.toLowerCase()} to keep
                      operations moving and growth on track.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ================= FINAL CTA ================= */}
		<section className="loan-final">
		  <div className="container">
			<div className="loan-final-card">

			  {/* Reassurance Line */}
			  <div className="loan-cta-reassurance">
				Trusted nationwide • No obligation • No impact to credit
			  </div>

			  <h2>{finalHeadline}</h2>
			  <p>{finalSubtext}</p>

			  <Link href={finalCtaLink} className="loan-final-cta">
				{finalCtaText}
			  </Link>

			  {/* 👇 MOVE THIS INSIDE */}
			  {relatedLoans.length > 0 && (
				<p className="loan-final-alt">
				  Looking for a different option?{" "}
				  {relatedLoans.map((loan, i) => (
					<span key={loan.slug}>
					  <Link href={`/loan-programs/${loan.slug}/`}>
						{loan.label}
					  </Link>
					  {i < relatedLoans.length - 1 && " or "}
					</span>
				  ))}
				  .
				</p>
			  )}

			</div>
		  </div>
		</section>
    </main>
  );
} 