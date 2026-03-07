// app/working-capital/page.js
"use client";

import Link from "next/link";
import LeadForm from "../components/LeadForm";
import "app/styles/working-capital.css";

export default function WorkingCapitalPage() {
  return (
    <>
      {/* HERO */}
    <section className="wc-hero">
  <div className="container wc-hero-grid">

    {/* LEFT: COPY */}
    <div className="wc-hero-copy">
      <h1>Fast Working Capital for Growing Businesses</h1>

      <p className="wc-hero-sub">
        Access flexible working capital to cover payroll, inventory, and
        short-term expenses — with same-day decisions and no impact to credit.
      </p>

      <div className="hero-features">
  <span>✔ No impact to credit</span>
  <span>✔ Same-day decisions</span>
  <span>✔ Real funding specialists</span>
</div>
    </div>

    {/* RIGHT: ILLUSTRATION */}
    <div className="wc-hero-visual">
      	<img
        	src="/hero/working-capital.png"
        	alt="Working capital funding approval illustration" 
      	/>
    </div> 

  </div>
</section>

      {/* WHAT / WHO */}
      <section className="wc-info">
        <div className="container wc-grid">
          <div className="wc-card">
            <h3>What Is Working Capital Financing?</h3>
            <p>
              Working capital financing helps businesses cover everyday operating
              expenses like payroll, inventory, rent, and marketing.
            </p>
            <ul>
              <li>Short-term funding for cash flow gaps</li>
              <li>Flexible repayment options</li>
              <li>Fast access when timing matters</li>
            </ul>
          </div>

          <div className="wc-card">
            <h3>Who Uses Working Capital?</h3>

            <p>
              <strong>Contractors & Trades</strong>
              <br />
              Cover payroll, materials, and job delays.
            </p>

            <p>
              <strong>Retail & E-commerce</strong>
              <br />
              Buy inventory and manage seasonal swings.
            </p>

            <p>
              <strong>Service Businesses</strong>
              <br />
              Smooth cash flow between invoices.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="wc-steps">
        <div className="container">
          <h2>How Working Capital Works</h2>

          <div className="wc-steps-grid">
            <div className="wc-step">
              <span>1</span>
              <p>Apply in minutes</p>
            </div>
            <div className="wc-step">
              <span>2</span>
              <p>Compare funding options</p>
            </div>
            <div className="wc-step">
              <span>3</span>
              <p>Funds available as fast as 24 hours</p>
            </div>
          </div>

          <p className="wc-amounts">
            Amounts from $10K – $2M • Same-day approval • No credit impact to
            check
          </p>
        </div>
      </section>

      {/* FORM CTA */}
      <section className="wc-form">
        <div className="container wc-form-inner">
          <h2>See Your Working Capital Options</h2>
          <p>
            Apply once to compare multiple working capital offers — no obligation
            and no impact to your credit.
          </p>

          <LeadForm />

          <ul className="form-trust">
            <li>✔ No obligation</li>
            <li>✔ No credit impact</li>
            <li>✔ Fast decisions</li>
          </ul>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="wc-compare">
        <div className="container">
          <h2>Working Capital vs Traditional Bank Loans</h2>

          <div className="wc-compare-grid">
            <div>
              <h4>Working Capital</h4>
              <ul>
                <li>Same-day approval</li>
                <li>Soft credit check</li>
                <li>High flexibility</li>
                <li>Often no collateral</li>
              </ul>
            </div>

            <div>
              <h4>Traditional Bank Loans</h4>
              <ul>
                <li>Weeks for approval</li>
                <li>Hard credit pull</li>
                <li>Low flexibility</li>
                <li>Collateral usually required</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
     			<section className="wc-final">
  <div className="container">
    <div className="wc-final-card">
      <h2>Ready to Get Working Capital?</h2>
      <p>No impact to credit. Decisions as fast as 2 hours.</p>

      <Link href="/apply" className="wc-final-cta">
        Apply Now
      </Link>
    </div>
  </div>
</section>
    </>
  );
}