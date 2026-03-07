// app/contact/page.js
import "@/app/styles/contact.css";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: "Contact | Small Business Capital",
    description:
      "Contact Small Business Capital for business funding support. Call, email, or apply online to compare options fast.",
    alternates: {
      canonical: "/contact",
    },
  };
}

export default function ContactPage() {
  // Easy edits here
  const PHONE_DISPLAY = "(888) 365-7999";
  const PHONE_TEL = "18883657999";
  const SUPPORT_EMAIL = "support@smallbusiness.capital";

  return (
    <main className="contact-page">
      {/* HERO */}
      <section className="contact-hero">
        <div className="container contact-hero-grid">
          <div className="contact-hero-copy">
            <h1>Contact Small Business Capital</h1>
            <p className="contact-hero-sub">
              Have a question about business funding? Our team is here to help you
              understand your options and move forward with confidence.
            </p>

            <div className="contact-hero-bullets">
              <span>✔ Fast response & clear next steps</span>
              <span>✔ Funding options for most industries</span>
              <span>✔ One application → multiple lender matches</span>
            </div>

            <div className="contact-hero-actions">
              <Link href="/apply" className="btn btn-primary">
                Apply Now
              </Link>

              <a href={`mailto:${SUPPORT_EMAIL}`} className="btn btn-secondary">
                Email Support
              </a>
            </div>

            <div className="contact-hero-proof">
              <div className="contact-proof-item">
                <div className="contact-proof-label">Funding Speed</div>
                <div className="contact-proof-value">24–72 hrs</div>
              </div>
              <div className="contact-proof-item">
                <div className="contact-proof-label">Process</div>
                <div className="contact-proof-value">One Application</div>
              </div>
              <div className="contact-proof-item">
                <div className="contact-proof-label">Coverage</div>
                <div className="contact-proof-value">Nationwide</div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <aside className="contact-hero-panel">
            <div className="contact-panel-card">
              <div className="contact-panel-title">Reach us directly</div>

              <div className="contact-card-grid">
                <a className="contact-card" href={`tel:${PHONE_TEL}`}>
                  <div className="contact-card-top">
                    <div className="contact-card-icon" aria-hidden="true">
                      📞
                    </div>
                    <div className="contact-card-title">Call us</div>
                  </div>
                  <div className="contact-card-value">{PHONE_DISPLAY}</div>
                  <div className="contact-card-subtext">
                    Mon–Fri • Typical response within minutes
                  </div>
                </a>

                <a className="contact-card" href={`mailto:${SUPPORT_EMAIL}`}>
                  <div className="contact-card-top">
                    <div className="contact-card-icon" aria-hidden="true">
                      ✉️
                    </div>
                    <div className="contact-card-title">Email support</div>
                  </div>
                  <div className="contact-card-value">
					  support@<wbr />
					  smallbusiness.capital
				  </div>
                  <div className="contact-card-subtext">
                    Tell us your goal — we’ll guide you
                  </div>
                </a>

                <div className="contact-card contact-card--muted">
                  <div className="contact-card-top">
                    <div className="contact-card-icon" aria-hidden="true">
                      🧾
                    </div>
                    <div className="contact-card-title">Funding help</div>
                  </div>
                  <div className="contact-card-value">Pre-qualification</div>
                  <div className="contact-card-subtext">
                    Apply once and compare options with no obligation
                  </div>
                </div>

                <div className="contact-card contact-card--muted">
                  <div className="contact-card-top">
                    <div className="contact-card-icon" aria-hidden="true">
                      🏁
                    </div>
                    <div className="contact-card-title">Best for</div>
                  </div>
                  <div className="contact-card-value">Business owners</div>
                  <div className="contact-card-subtext">
                    Working capital, lines of credit, term loans & more
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* FORM + FAQ */}
      <section className="contact-body">
        <div className="container contact-body-grid">
          {/* FORM */}
          <div className="contact-form-card">
            <h2>Send us a message</h2>
            <p className="contact-form-sub">
              Share a few details and we’ll get back to you as soon as possible.
            </p>

            {/* Replace this with HubSpot embed or your own form */}
            <form className="contact-form">
              <div className="contact-form-row">
                <label>
                  Full Name
                  <input type="text" name="name" placeholder="Your name" />
                </label>

                <label>
                  Email
                  <input type="email" name="email" placeholder="you@email.com" />
                </label>
              </div>

              <div className="contact-form-row">
                <label>
                  Phone (optional)
                  <input type="tel" name="phone" placeholder="(555) 555-5555" />
                </label>

                <label>
                  Topic
                  <select name="topic">
                    <option>Funding options</option>
                    <option>Application status</option>
                    <option>Business services</option>
                    <option>Partnerships</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label>
                Message
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us what you're looking for..."
                />
              </label>

              <button type="button" className="contact-submit">
                Send Message →
              </button>

              <div className="contact-form-note">
                ✔ No obligation • ✔ Fast response • ✔ Built for business funding
              </div>
            </form>
          </div>

          {/* FAQ */}
          <aside className="contact-faq">
            <h2>Common questions</h2>

            <div className="contact-faq-list">
              <details className="contact-faq-item">
                <summary>Will this impact my credit?</summary>
                <p>
                  No — checking your options and submitting an initial request does
                  not impact your credit score.
                </p>
              </details>

              <details className="contact-faq-item">
                <summary>How fast can I get funded?</summary>
                <p>
                  Some programs can fund in as little as 24–72 hours after approval,
                  depending on the option and documentation required.
                </p>
              </details>

              <details className="contact-faq-item">
                <summary>What do I need to apply?</summary>
                <p>
                  In most cases, you’ll need basic business information and an estimate
                  of monthly revenue. Some programs may request bank activity.
                </p>
              </details>

              <details className="contact-faq-item">
                <summary>Do you work nationwide?</summary>
                <p>
                  Yes — we support business owners across the United States and match
                  you with options based on your profile.
                </p>
              </details>
            </div>

            <div className="contact-faq-cta">
              <h3>Want to move faster?</h3>
              <p>Apply once and compare funding options built for your business.</p>
              <Link href="/apply" className="contact-faq-btn">
                Apply Now →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* STRIPE-ISH CTA BAND */}
      <section className="contact-cta">
        <div className="container">
          <div className="contact-cta-card">
            <div className="contact-cta-left">
              <span className="contact-cta-eyebrow">Get Started</span>
              <h2>Ready to explore funding options?</h2>
              <p>
                Apply once and get matched with options that fit your business — fast
                decisions, flexible terms, and real guidance.
              </p>

              <div className="contact-cta-actions">
                <Link href="/apply" className="contact-cta-primary">
                  Apply Now <span aria-hidden="true">→</span>
                </Link>
                <Link href="/loan-programs" className="contact-cta-secondary">
                  Browse Loan Programs
                </Link>
              </div>

              <div className="contact-cta-footnote">
                ✔ No impact to credit • ✔ Takes under 60 seconds • ✔ No obligation
              </div>
            </div>

            <div className="contact-cta-right">
              <div className="contact-cta-metric">
                <div className="contact-cta-metric-label">Funding Speed</div>
                <div className="contact-cta-metric-value">24–72 hrs</div>
              </div>

              <div className="contact-cta-metric">
                <div className="contact-cta-metric-label">One Application</div>
                <div className="contact-cta-metric-value">Multiple Options</div>
              </div>

              <div className="contact-cta-metric">
                <div className="contact-cta-metric-label">Support</div>
                <div className="contact-cta-metric-value">Nationwide</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}