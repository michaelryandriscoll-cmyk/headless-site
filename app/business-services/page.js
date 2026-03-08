// app/business-services/page.js
import Link from "next/link";
import "@/app/styles/loan-page.css";

export const dynamic = "force-static";
export const revalidate = 300;

async function getBusinessServices() {
  try {
    const base = process.env.NEXT_PUBLIC_WP_API_BASE;

    if (!base) {
      console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
      return [];
    }

    // 1) Find the parent page by slug
    const parentRes = await fetch(`${base}/wp/v2/pages?slug=business-services`, {
      next: { revalidate: 300 },
    });

    if (!parentRes.ok) return [];
    const parentData = await parentRes.json();

    if (!parentData?.length) return [];
    const parentId = parentData[0].id;

    // 2) Pull children pages (include ACF so we can show short descriptions)
    const childrenRes = await fetch(
      `${base}/wp/v2/pages?parent=${parentId}&per_page=100&_fields=id,slug,title,acf`,
      { next: { revalidate: 300 } }
    );

    if (!childrenRes.ok) return [];
    const children = await childrenRes.json();

    // 3) Map into UI objects
    return (children || []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || p.slug,
      excerpt: p.acf?.short_description || "",
      badge: p.acf?.badge || "Business Service",
    }));
  } catch (err) {
    console.error("Error loading business services:", err);
    return [];
  }
}

export default async function BusinessServicesHubPage() {
  const services = await getBusinessServices();

  return (
    <main className="loan-page">
      {/* ================= HERO ================= */}
      <section className="loan-hero">
        <div className="container loan-hero-grid">
          <div className="loan-hero-copy">
            <h1>Business Services</h1>
            <p className="loan-hero-sub">
              Extra support to help your business qualify for funding and grow with
              confidence.
            </p>

            <div className="hero-features">
              <span>✔ Improve lender readiness</span>
              <span>✔ Build a stronger business foundation</span>
              <span>✔ Get support beyond funding</span>
            </div>
          </div>

          <div className="loan-hero-visual loan-hero-visual--natural">
			  <img
				src="/hero/business-services-hero.png"
				alt="Business services that help small businesses strengthen operations and qualify for funding"
				style={{
				  width: "100%",
				  maxWidth: "520px",
				  height: "auto",
				  borderRadius: "18px",
				  border: "1px solid #e5e7eb",
				  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
				  background: "#ffffff",
				}}
				loading="eager"
			  />
			</div>
        </div>
      </section>

      {/* ================= LIST ================= */}
      <section className="loan-what">
        <div className="container">
          <header className="loan-how-header" style={{ marginBottom: "1.25rem" }}>
            <span className="section-eyebrow">Browse services</span>
            <h2 style={{ marginBottom: "0.5rem" }}>
              Choose the right business support
            </h2>
            <p style={{ maxWidth: "70ch" }}>
              Each service page explains what it includes, who it’s best for, and
              how to get started.
            </p>
          </header>

          {services.length === 0 ? (
            <div className="loan-card" style={{ padding: "22px" }}>
              <p style={{ margin: 0 }}>
                No Business Services found yet. Add child pages under{" "}
                <strong>Business Services</strong> in WordPress.
              </p>
            </div>
          ) : (
            <div className="loan-programs-grid">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`/business-services/${s.slug}`}
                  className="loan-program-card"
                >
                  <div className="loan-program-card-top">
                    <h3 className="loan-program-title">{s.title}</h3>
                    <span className="loan-program-pill">{s.badge}</span>
                  </div>

                  <p className="loan-program-desc">
                    {s.excerpt?.trim()
                      ? s.excerpt
                      : `Learn what ${stripHtml(s.title)} includes, who it’s best for, and what to expect.`}
                  </p>

                  <div className="loan-program-cta">
                    View service <span aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
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