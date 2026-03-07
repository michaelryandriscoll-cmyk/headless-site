// app/about-us/page.js
import "@/app/styles/about.css";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 300;

async function getAboutPage() {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;

  if (!base) {
    console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
    return null;
  }

  try {
    // Pull the About Us page by slug
    const res = await fetch(
      `${base}/wp/v2/pages?slug=about-us&_fields=id,slug,title,content,acf`,
      { next: { revalidate } }
    );

    if (!res.ok) return null;

    const pages = await res.json();
    if (!pages?.length) return null;

    return pages[0];
  } catch (err) {
    console.error("Error loading About page:", err);
    return null;
  }
}

export async function generateMetadata() {
  const page = await getAboutPage();
  const acf = page?.acf || {};

  return {
    title: "About Us | Small Business Capital",
    description:
      acf?.meta_description ||
      "Learn more about Small Business Capital and how we help small business owners access funding and grow with confidence.",
    alternates: {
      canonical: "/about-us",
    },
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();
  const acf = page?.acf || {};

  // HERO
  const heroTitle = acf.hero_title || "About Us — Small Business Capital";
  const heroIntro =
    acf.hero_intro ||
    "At Small Business Capital, we don’t just provide funding — we create opportunity for business owners who need capital to grow and succeed.";

  // CEO
  const ceoSectionTitle = acf.ceo_section_title || "A Message from Our CEO";
  const ceoQuote =
    acf.ceo_quote ||
    "“Big things often have small beginnings — the key is to keep pushing forward, even when the odds seem stacked against you.”";

  const ceoMessageHtml =
    acf.ceo_message ||
    `<p>Dear Business Owner,<br/>I know firsthand what it’s like to have a vision for your business but struggle to find the capital to bring it to life.</p>`;

  const ceoSignature =
    acf.ceo_signature || "— Stephanie Johnson, Chief Executive Officer";

  // MISSION
  const missionTitle =
    acf.mission_title || "We’re serious about helping small businesses succeed";

  const missionText =
    acf.mission_text ||
    "We know that access to the right funding can make all the difference in your business’s success. That’s why we’re committed to providing fast, flexible, and hassle-free financing solutions.";

  // HOW WE HELP
  const helpTitle = acf.help_title || "How We Help Business Owners";

  const helpList = Array.isArray(acf.help_list) ? acf.help_list : [];

  const helpFallback = [
    {
      heading: "Funding Matchmaking",
      text: "Compare multiple options with one application.",
    },
    {
      heading: "Dedicated Guidance",
      text: "Understand what lenders look for.",
    },
    {
      heading: "Fast Turnaround",
      text: "Decisions in as little as 24–48 hours.",
    },
    {
      heading: "Long-Term Support",
      text: "Beyond funding, build profile strength.",
    },
  ];

  const helpItems = helpList.length ? helpList : helpFallback;

  // CTA
  const ctaTitle = acf.cta_title || "Ready to explore funding options?";
  const ctaPrimaryLabel = acf.cta_primary_label || "Apply Now";
  const ctaPrimaryUrl = acf.cta_primary_url || "/apply";
  const ctaSecondaryLabel = acf.cta_secondary_label || "Browse Loan Programs";
  const ctaSecondaryUrl = acf.cta_secondary_url || "/loan-programs";

  return (
    <main>
      {/* HERO */}
		<section className="about-hero">
		  <div className="container about-hero-grid">
			{/* Left */}
			<div className="about-hero-copy">
			  <h1>{heroTitle}</h1>

			  <p className="about-hero-intro">{heroIntro}</p>

			  <div className="about-hero-bullets">
				<span>✔ Fast decisions (24–72 hours)</span>
				<span>✔ One application → multiple options</span>
				<span>✔ Nationwide support for U.S. businesses</span>
			  </div>

			  <div className="about-hero-actions">
				<Link href={ctaPrimaryUrl} className="btn btn-primary">
				  {ctaPrimaryLabel}
				</Link>

				<Link href={ctaSecondaryUrl} className="btn btn-secondary">
				  {ctaSecondaryLabel}
				</Link>
			  </div>

			  <div className="about-hero-proof">
				<div className="about-proof-item">
				  <div className="about-proof-label">Funding Speed</div>
				  <div className="about-proof-value">24–72 hrs</div>
				</div>

				<div className="about-proof-item">
				  <div className="about-proof-label">Process</div>
				  <div className="about-proof-value">One Application</div>
				</div>

				<div className="about-proof-item">
				  <div className="about-proof-label">Coverage</div>
				  <div className="about-proof-value">Nationwide</div>
				</div>
			  </div>
			</div>

			{/* Right */}
			<div className="about-hero-visual">
			  <img
				src="/images/about-hero-map.png"
				alt="Illustrated map showing small business funding support across the United States"
				loading="eager"
			  />
			</div>
		  </div>
		</section>

      {/* CEO MESSAGE */}
		<section className="about-ceo">
		  <div className="container">
			<div className="about-ceo-card">
			  <div className="about-ceo-left">
				<h2>{ceoSectionTitle}</h2>

				<blockquote className="about-ceo-quote">{ceoQuote}</blockquote>

				<div
				  className="about-ceo-message"
				  dangerouslySetInnerHTML={{ __html: ceoMessageHtml }}
				/>

				<div className="about-ceo-signature">
				  <div className="about-ceo-name">{ceoSignature}</div>
				</div>
			  </div>

			  {/* Right column: CEO identity + credibility */}
			  <aside className="about-ceo-right">
				<div className="about-ceo-profile">
				  <div className="about-ceo-avatar" aria-hidden="true">
					SJ
				  </div>

				  <div className="about-ceo-profile-text">
					<div className="about-ceo-role">Chief Executive Officer</div>
					<div className="about-ceo-company">Small Business Capital</div>
				  </div>
				</div>

				<div className="about-ceo-highlight">
				  <div className="about-ceo-highlight-title">Our promise</div>
				  <p>
					A fast, transparent path to real business funding options — built around
					what lenders actually approve.
				  </p>
				</div>

				<div className="about-ceo-trust">
				  <div className="about-ceo-trust-title">Trusted by business owners nationwide</div>

				  <div className="about-ceo-trust-logos">
					<span className="trust-logo">Inc.</span>
					<span className="trust-logo">WSJ</span>
					<span className="trust-logo">Forbes</span>
					<span className="trust-logo">Entrepreneur</span>
				  </div>

				  <div className="about-ceo-trust-note">
					*Logos shown for design/credibility layout — replace with real sources if needed.
				  </div>
				</div>
			  </aside>
			</div>
		  </div>
		</section>

      {/* MISSION */}
<section className="about-mission">
  <div className="container about-mission-grid">
    <div className="about-mission-copy">
      <h2>{missionTitle}</h2>
      <p>{missionText}</p>

      <div className="about-mission-tags">
        <span className="about-tag">Fast Decisions</span>
        <span className="about-tag">Flexible Options</span>
        <span className="about-tag">One Simple Application</span>
      </div>
    </div>

    <div className="about-mission-panel">
      <div className="about-mission-panel-card">
        <div className="about-mission-panel-title">Our focus</div>
        <ul className="about-mission-panel-list">
          <li>Clear guidance from start to finish</li>
          <li>Funding options that match your business profile</li>
          <li>A process designed for real small business needs</li>
        </ul>
      </div>
    </div>
  </div>
</section>

      {/* HOW WE HELP */}
		<section className="about-how-we-help">
		  <div className="container">
			<div className="about-section-header">
			  <h2>{helpTitle}</h2>
			  <p className="about-section-subtitle">
				A simple process built around speed, clarity, and real funding options.
			  </p>
			</div>

			<div className="about-help-grid">
			  {helpItems.map((item, idx) => (
				<div className="about-help-card" key={idx}>
				  <div className="about-help-icon" aria-hidden="true">
					{idx === 0 ? "💼" : idx === 1 ? "🧭" : idx === 2 ? "⚡" : "📈"}
				  </div>

				  <div className="about-help-content">
					<h3>{item.heading}</h3>
					<p>{item.text}</p>
				  </div>
				</div>
			  ))}
			</div>
		  </div>
		</section>

     {/* CTA */}
		<section className="about-cta">
		  <div className="container">
			<div className="about-cta-card">
			  {/* Left */}
			  <div className="about-cta-left">
				<span className="about-cta-eyebrow">Get Started</span>

				<h2 className="about-cta-title">{ctaTitle}</h2>

				<p className="about-cta-sub">
				  Apply once and get matched with funding options built for your business —
				  fast decisions, flexible terms, and real guidance.
				</p>

				<div className="about-cta-actions">
				  <Link href={ctaPrimaryUrl} className="about-cta-primary">
					{ctaPrimaryLabel} <span aria-hidden="true">→</span>
				  </Link>

				  <Link href={ctaSecondaryUrl} className="about-cta-secondary">
					{ctaSecondaryLabel}
				  </Link>
				</div>

				<div className="about-cta-footnote">
				  ✔ No impact to credit • ✔ Takes under 60 seconds • ✔ No obligation
				</div>
			  </div>

			  {/* Right */}
			  <div className="about-cta-right">
				<div className="about-cta-metric">
				  <div className="about-cta-metric-label">Funding Speed</div>
				  <div className="about-cta-metric-value">24–72 hrs</div>
				</div>

				<div className="about-cta-metric">
				  <div className="about-cta-metric-label">One Application</div>
				  <div className="about-cta-metric-value">Multiple Options</div>
				</div>

				<div className="about-cta-metric">
				  <div className="about-cta-metric-label">Support</div>
				  <div className="about-cta-metric-value">Nationwide</div>
				</div>
			  </div>
			</div>
		  </div>
		</section>
    </main>
  );
}