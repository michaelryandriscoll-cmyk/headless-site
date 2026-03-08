import "@/app/styles/loan-page.css";
import LoanProgramsClient from "./LoanProgramsClient";

export const dynamic = "force-static";
export const revalidate = 300;

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

/* =========================
   GRAPHQL
========================= */

const ALL_LOAN_PAGES_QUERY = `
  query AllLoanProgramPages {
    pages(where: { parent: "loan-programs" }, first: 100) {
      nodes {
        title
        uri
      }
    }
  }
`;

/* =========================
   DATA FETCHER
========================= */

async function fetchLoanProgramPages() {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: ALL_LOAN_PAGES_QUERY }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json?.data?.pages?.nodes || [];
}

/* =========================
   PAGE
========================= */

export default async function LoanProgramsPage() {
  const pages = await fetchLoanProgramPages();

  const loanPrograms = pages
  .map((p) => {
    const uri = p?.uri || "";
    const slug = uri.split("/").filter(Boolean).pop();

    return {
      title: p?.title || "Loan Program",
      slug,
      href: `/loan-programs/${slug}`,
      uri,
    };
  })
  .filter(
    (p) =>
      p.slug &&
      p.uri.startsWith("/loan-programs/") &&
      p.uri !== "/loan-programs/"
  ); 

  const FEATURED_SLUGS = [
    "working-capital-loans",
    "business-loans-for-bad-credit",
    "no-doc-loans",
  ];

  return (
    <main className="loan-page">
      {/* ================= HERO ================= */}
      <section className="loan-hero">
        <div className="container loan-hero-grid">
          <div className="loan-hero-copy">
            <h1>Loan Programs</h1>
            <p className="loan-hero-sub">
              Explore funding options built for real businesses — fast decisions,
              flexible terms, and programs tailored to your goals.
            </p>

            <div className="hero-features">
              <span>✔ Apply once, compare offers</span>
              <span>✔ No obligation</span>
              <span>✔ No impact to credit to check options</span>
            </div>
          </div>

          <div className="loan-hero-visual">
			  <img
				src="/hero/loan-dashboard.png"
				alt="Loan offers dashboard illustration"
				className="loan-hero-image"
				loading="eager"
			  />
		  </div>
          
        </div>
      </section>

      {/* ================= HUB UI ================= */}
      <section className="loan-what">
        <div className="container">
          <header className="loan-how-header" style={{ marginBottom: "1.25rem" }}>
            <span className="section-eyebrow">Browse programs</span>
            <h2 style={{ marginBottom: "0.5rem" }}>
              Choose the right funding option
            </h2>
            <p style={{ maxWidth: "70ch" }}>
              Filter by category, search instantly, and browse featured programs first.
            </p>
          </header>

          <LoanProgramsClient
            loanPrograms={loanPrograms}
            featuredSlugs={FEATURED_SLUGS}
          />
        </div>
      </section>
    </main>
  );
}