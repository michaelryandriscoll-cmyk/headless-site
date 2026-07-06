// app/apply/page.js
"use client";
import "@/app/styles/apply-page.css";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LeadForm from "../components/LeadForm";

function ApplyPageInner() {
  const searchParams = useSearchParams();
  const [intent, setIntent] = useState({
    state: "",
    city: "",
    industry: "",
    source: "organic",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prefer URL params (set by StateIntentCapture when rewriting /apply links)
    // since they're present even on first load, before localStorage reads settle.
    const qsState = searchParams.get("state") || "";
    const qsCity = searchParams.get("city") || "";
    const qsIndustry = searchParams.get("industry") || "";

    if (qsState || qsIndustry) {
      setIntent({
        state: qsState,
        city: qsCity,
        industry: qsIndustry,
        source: "organic",
      });
      return;
    }

    // Fallback to localStorage (matches the key StateIntentCapture actually writes)
    const stored = localStorage.getItem("sbc_intent_v1");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIntent({
          state: parsed.state || "",
          city: parsed.city || "",
          industry: parsed.industry || "",
          source: parsed.source || "organic",
        });
      } catch {
        console.warn("Invalid intent data");
      }
    }
  }, [searchParams]);

  return (
    <section className="apply-page">
      <div className="apply-container">
        {/* Header */}
        <header className="apply-header">
          <h1>Apply for Business Funding</h1>
          <p>
            No impact to credit • Decisions in as little as <strong>2 hours</strong>
          </p>
        </header>

        {/* Form Card */}
		<div className="apply-form-card">
		  <div className="apply-form-inner">
	  		<p className="apply-form-kicker">Tell us a little about your business to see funding options.</p>
			<LeadForm
			  intentState={intent.state}
			  intentCity={intent.city}
			  intentIndustry={intent.industry}
			  intentSource={intent.source}
			/>

			<div className="lead-form-trust">
			  <span>✓ No impact to credit</span>
			  <span>✓ Takes under 60 seconds</span>
			  <span>✓ No obligation</span>
			  <span>✓ Multiple lender options</span>
			</div>
      <p style={{fontSize:"11px",color:"#94a3b8",marginTop:"12px",textAlign:"center"}}>
        By submitting this form you may be matched with lenders offering term loans, lines of credit, revenue-based financing, or merchant cash advance products.
      </p>

		  </div>
		</div>

        {/* What happens next */}
        <section className="apply-support">
          <div className="apply-support-card">
            <div className="apply-support-header">
              <h2>What happens after you apply</h2>
              <p>
                We keep it simple — apply once, compare options, and choose what fits
                your business.
              </p>
            </div>

            <div className="apply-steps">
              <div className="apply-step">
                <div className="apply-step-num">1</div>
                <div className="apply-step-body">
                  <h3>Submit your application</h3>
                  <p>It takes about 60 seconds and won’t impact your credit.</p>
                </div>
              </div>

              <div className="apply-step">
                <div className="apply-step-num">2</div>
                <div className="apply-step-body">
                  <h3>We review your business profile</h3>
                  <p>
                    We look at revenue, cash flow, and business details to match you
                    with options.
                  </p>
                </div>
              </div>

              <div className="apply-step">
                <div className="apply-step-num">3</div>
                <div className="apply-step-body">
                  <h3>Compare offers & get funded</h3>
                  <p>
                    Choose the best program for your needs — funding can be fast
                    depending on the option.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What you may need */}
          <div className="apply-support-card">
            <div className="apply-support-header">
              <h2>What you may need (usually)</h2>
              <p>Requirements vary by lender, but most approvals are based on revenue.</p>
            </div>

            <ul className="apply-checklist">
              <li>Basic business information</li>
              <li>Estimated monthly revenue</li>
              <li>Time in business</li>
              <li>Recent bank activity (in some cases)</li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="apply-support-card">
            <div className="apply-support-header">
              <h2>Common questions</h2>
              <p>Quick answers before you submit your application.</p>
            </div>

            <div className="apply-faq">
              <details className="apply-faq-item">
                <summary>Will this impact my credit?</summary>
                <div className="apply-faq-answer">
                  <p>
                    No — checking your options does not impact your credit score.
                  </p>
                </div>
              </details>

              <details className="apply-faq-item">
                <summary>How fast can I get funded?</summary>
                <div className="apply-faq-answer">
                  <p>
                    Some programs fund in as little as 24–48 hours after approval,
                    depending on the option and documentation required.
                  </p>
                </div>
              </details>

              <details className="apply-faq-item">
                <summary>How much can I qualify for?</summary>
                <div className="apply-faq-answer">
                  <p>
                    Amounts vary based on revenue, cash flow, and your business profile.
                    Many businesses qualify for flexible ranges based on eligibility.
                  </p>
                </div>
              </details>

              <details className="apply-faq-item">
                <summary>What if my credit isn’t perfect?</summary>
                <div className="apply-faq-answer">
                  <p>
                    That’s okay — many funding options focus more on revenue and deposits
                    than credit score alone.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* Popular programs (optional but helpful) */}
          <div className="apply-support-card">
            <div className="apply-support-header">
              <h2>Popular loan programs</h2>
              <p>If you’re exploring options, these are common starting points.</p>
            </div>

            <div className="apply-program-links">
              <Link href="/loan-programs/working-capital-loans">Working Capital</Link>
              <Link href="/loan-programs/business-line-of-credit">Line of Credit</Link>
              <Link href="/loan-programs/equipment-financing">Equipment Financing</Link>
              <Link href="/loan-programs/term-loans">Term Loans</Link>
              <Link href="/loan-programs/sba-loans">SBA Loans</Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyPageInner />
    </Suspense>
  );
}