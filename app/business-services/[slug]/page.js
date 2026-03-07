// app/business-services/[slug]/page.js
import Link from "next/link";
import "@/app/styles/loan-page.css";

export const dynamic = "force-static";
export const revalidate = 300;

/**
 * Fetch one Business Service child page by slug.
 * Assumes:
 * - Parent page slug = business-services
 * - Child pages live under that parent
 * - Pages have ACF fields available in `acf`
 */
async function getBusinessServiceBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;

  if (!base) {
    console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
    return null;
  }

  // 1) Find parent page
  const parentRes = await fetch(`${base}/wp/v2/pages?slug=business-services`, {
    next: { revalidate },
  });

  if (!parentRes.ok) return null;
  const parentData = await parentRes.json();
  if (!parentData?.length) return null;

  const parentId = parentData[0].id;

  // 2) Fetch the child page by slug
  const pageRes = await fetch(
    `${base}/wp/v2/pages?slug=${slug}&parent=${parentId}&_embed`,
  { next: { revalidate } }
  );

  if (!pageRes.ok) return null;
  const pages = await pageRes.json();

  if (!pages?.length) return null;

  return pages[0];
}

/**
 * Fetch all Business Service slugs for static generation
 */
async function getBusinessServiceSlugs() {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;
  if (!base) return [];

  try {
    const parentRes = await fetch(`${base}/wp/v2/pages?slug=business-services`, {
      next: { revalidate },
    });

    if (!parentRes.ok) return [];
    const parentData = await parentRes.json();
    if (!parentData?.length) return [];

    const parentId = parentData[0].id;

    const childrenRes = await fetch(
      `${base}/wp/v2/pages?parent=${parentId}&per_page=100&_fields=slug`,
      { next: { revalidate } }
    );

    if (!childrenRes.ok) return [];
    const children = await childrenRes.json();

    return (children || []).map((p) => ({ slug: p.slug }));
  } catch (e) {
    console.error("Error generating business service slugs:", e);
    return [];
  }
}

/**
 * Next.js static params
 */
export async function generateStaticParams() {
  return await getBusinessServiceSlugs();
}

/**
 * Optional: SEO metadata
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const page = await getBusinessServiceBySlug(slug);

  const title = page?.title?.rendered
    ? `${page.title.rendered} | Business Services`
    : "Business Service";

  const description =
    page?.acf?.meta_description ||
    "Explore business services that help you qualify for funding and grow with confidence.";

  return {
    title,
    description,
  };
}

export default async function BusinessServicePage({ params }) {
  const { slug } = await params;

  const page = await getBusinessServiceBySlug(slug);

  if (!page) {
    return (
      <main className="loan-page service-theme">
        <section className="loan-hero">
          <div className="container loan-hero-grid">
            <div className="loan-hero-copy">
              <h1>Service not found</h1>
              <p className="loan-hero-sub">
                This Business Service page doesn’t exist yet.
              </p>

              <Link className="hero-cta" href="/business-services">
                Back to Business Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const title = page.title?.rendered || "Business Service";
  const acf = page.acf || {};

  // ================= FEATURED IMAGE =================
	const rawHeroImage =
	  page?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

	const heroImage = sanitizeImageUrl(rawHeroImage); 

  // Optional ACF fields (safe fallbacks)
  const heroSubtitle =
    acf.hero_subtitle ||
    "Get expert support to strengthen your business and improve your funding readiness.";

  /**
   * IMPORTANT:
   * Your ACF is returning arrays like:
   * trust_bullets: [{ text: "..." }, { text: "..." }]
   * checklist: [{ text: "..." }, ...]
   *
   * So normalize them into string arrays for rendering.
   */
  const trustBulletsRaw = Array.isArray(acf.trust_bullets) ? acf.trust_bullets : [];
  const trustBullets = trustBulletsRaw
    .map((x) => (typeof x === "string" ? x : x?.text))
    .filter(Boolean);

  const overviewHtml = acf.overview_html || page.content?.rendered || "";

  const whoFor = Array.isArray(acf.who_its_for) ? acf.who_its_for : [];
  const steps = Array.isArray(acf.steps) ? acf.steps : [];

  const checklistRaw = Array.isArray(acf.checklist) ? acf.checklist : [];
  const checklist = checklistRaw
    .map((x) => (typeof x === "string" ? x : x?.text))
    .filter(Boolean);

  const faqs = Array.isArray(acf.faqs) ? acf.faqs : [];
  const related = Array.isArray(acf.related_services) ? acf.related_services : [];

  return (
    <main className="loan-page page service-theme">
      {/* ================= HERO ================= */}
      <section className="loan-hero">
        <div className="container loan-hero-grid">
          <div className="loan-hero-copy">
            <span className="section-eyebrow">Business Service</span>
            <h1 dangerouslySetInnerHTML={{ __html: title }} />

            <p className="loan-hero-sub">{heroSubtitle}</p>

            {/* Trust bullets (optional) */}
            <div className="hero-features">
              {(trustBullets.length
                ? trustBullets
                : [
                    "Fast support + clear next steps",
                    "Built to improve lender readiness",
                    "No fluff — practical business help",
                  ]
              ).map((item, idx) => (
                <span key={idx}>✔ {item}</span>
              ))}
            </div>

            <div style={{ marginTop: "18px" }}>
              <Link className="loan-hero-cta" href="/apply">
                Apply for Funding
              </Link>
            </div>

            <div className="loan-final-alt" style={{ marginTop: "14px" }}>
              <Link href="/business-services">← Back to Business Services</Link>
            </div>
          </div>

          {/* Right visual placeholder */}
          <div className="loan-hero-visual">
  {heroImage ? (
    <img
      src={heroImage}
      alt={stripHtml(title)}
      loading="eager"
    />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        background:
          "radial-gradient(circle at center, rgba(46,204,113,0.08), transparent 60%)",
      }}
    />
  )}
</div>
        </div>
      </section>

      {/* ================= OVERVIEW ================= */}
      <section className="loan-what">
        <div className="container">
			<span className="section-eyebrow">Overview</span>
              <h2>What {stripHtml(title)} includes</h2>
          <div className="loan-what-inner">
            <div>
              <div
                className="loan-what-description"
                dangerouslySetInnerHTML={{ __html: overviewHtml }}
              />
            </div>

            <div className="loan-what-bullets">
              <ul>
                {(checklist.length
                  ? checklist
                  : [
                      "Quick intake + business snapshot review",
                      "Clear next steps and recommended path",
                      "Support designed to improve approval odds",
                    ]
                ).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHO IT'S FOR ================= */}
      <section className="loan-who">
        <div className="container">
          <span className="section-eyebrow">Who it’s for</span>
          <h2>Best for businesses that need help with…</h2>

          <div className="loan-who-grid">
            {(whoFor.length
              ? whoFor
              : [
                  {
                    title: "Improving eligibility",
                    desc: "You want to strengthen your profile before applying for funding.",
                  },
                  {
                    title: "Building credibility",
                    desc: "You need lender-ready documentation and clean positioning.",
                  },
                  {
                    title: "Planning the next step",
                    desc: "You’re not sure which loan program fits your situation yet.",
                  },
                ]
            ).map((card, idx) => (
              <div className="loan-who-card" key={idx}>
                <div className="loan-who-card-icon">✓</div>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="loan-how">
        <div className="container">
          <div className="loan-how-header">
            <span className="section-eyebrow">Process</span>
            <h2>How it works</h2>
            <p>
              Simple, fast, and focused on helping you move forward with confidence.
            </p>
          </div>

          <ol className="loan-how-rail">
            {(steps.length
              ? steps
              : [
                  { title: "Tell us what you need", desc: "Answer a few questions." },
                  {
                    title: "We review your situation",
                    desc: "We identify the fastest path forward.",
                  },
                  {
                    title: "Get support + next steps",
                    desc: "Then apply with a stronger profile.",
                  },
                ]
            ).map((step, idx) => (
              <li className="loan-how-step" key={idx}>
                <div className="loan-how-badge">{idx + 1}</div>
                <div className="loan-how-body">
                  <strong style={{ display: "block", marginBottom: "6px" }}>
                    {step.title}
                  </strong>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="loan-how-footer">
            Most businesses complete the process in under 1–2 days depending on the
            service.
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="loan-faq">
        <div className="container">
          <div className="loan-faq-header">
            <span className="section-eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </div>

          <div className="loan-faq-list">
            {(faqs.length
              ? faqs
              : [
                  {
                    q: "Does this replace applying for a loan?",
                    a: "No — it helps you apply with a stronger profile and clearer direction.",
                  },
                  {
                    q: "Will this impact my credit?",
                    a: "No — reviewing your options and business profile does not impact your credit score.",
                  },
                  {
                    q: "Can I still apply today?",
                    a: "Yes — you can apply now, and we’ll guide you toward the best-fit path.",
                  },
                ]
            ).map((item, idx) => (
              <details className="loan-faq-item" key={idx}>
                <summary className="loan-faq-question">{item.q}</summary>
                <div className="loan-faq-answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RELATED SERVICES (optional) ================= */}
      {related.length > 0 && (
        <section className="loan-what">
          <div className="container">
            <span className="section-eyebrow">Related</span>
            <h2>Related business services</h2>

            <div className="loan-programs-grid">
              {related.map((r, idx) => (
                <Link
                  key={idx}
                  href={`/business-services/${r.slug}`}
                  className="loan-program-card"
                >
                  <div className="loan-program-card-top">
                    <h3 className="loan-program-title">{r.title}</h3>
                    <span className="loan-program-pill">Service</span>
                  </div>

                  <p className="loan-program-desc">
                    {r.short_description || "Explore this service and see if it fits."}
                  </p>

                  <div className="loan-program-cta">
                    View service <span aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FINAL CTA ================= */}
      <section className="loan-final">
        <div className="container">
          <div className="loan-final-card">
            <h2>Ready to apply for funding?</h2>
            <p>
              Submit one application and compare options based on your business profile.
            </p>

            <Link className="loan-final-cta" href="/apply">
              Apply Now
            </Link>

            <p className="loan-final-alt" style={{ marginTop: "16px" }}>
              Or browse all <Link href="/business-services">Business Services</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Utility: remove HTML tags from WP-rendered title
 */
function stripHtml(html) {
  return (html || "").replace(/<[^>]*>?/gm, "");
}

function sanitizeImageUrl(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}