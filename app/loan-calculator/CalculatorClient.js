"use client";

import { useState } from "react";
import Link from "next/link";
import "@/app/styles/loan-calculator.css";

const CREDIT_OPTIONS = [
  { value: "680+", label: "680+ (Excellent/Good)" },
  { value: "580-679", label: "580 – 679 (Fair)" },
  { value: "500-579", label: "500 – 579 (Poor)" },
  { value: "under-500", label: "Under 500" },
];

const TIME_OPTIONS = [
  { value: "5+ years", label: "5+ years" },
  { value: "1-5 years", label: "1 – 5 years" },
  { value: "6-12 months", label: "6 – 12 months" },
  { value: "Under 6 months", label: "Under 6 months" },
];

const REVENUE_OPTIONS = [
  { value: 150000, label: "$100,000+ /month" },
  { value: 75000, label: "$50,000 – $100,000 /month" },
  { value: 25000, label: "$10,000 – $50,000 /month" },
  { value: 7500, label: "$5,000 – $10,000 /month" },
  { value: 2500, label: "Under $5,000 /month" },
];

function estimateTier({ credit, time, revenue }) {
  if (time === "Under 6 months") return "startup";
  if (credit === "680+" && revenue >= 25000) return "prime";
  if (credit === "580-679") return "near-prime";
  return "subprime";
}

const TIER_INFO = {
  prime: {
    label: "Prime",
    rangeMultiplierLow: 1,
    rangeMultiplierHigh: 3,
    speed: "24–72 hours",
    rateNote: "Often eligible for our lowest available rates, including equipment financing starting at 7%.",
  },
  "near-prime": {
    label: "Near-Prime",
    rangeMultiplierLow: 0.5,
    rangeMultiplierHigh: 1.5,
    speed: "24–72 hours",
    rateNote: "Typically matched with working capital or line-of-credit programs.",
  },
  subprime: {
    label: "Subprime",
    rangeMultiplierLow: 0.3,
    rangeMultiplierHigh: 1,
    speed: "24–48 hours",
    rateNote: "Often placed with MCA or short-term funding programs built for building credit history.",
  },
  startup: {
    label: "Startup",
    rangeMultiplierLow: 0.2,
    rangeMultiplierHigh: 0.5,
    speed: "2–5 days",
    rateNote: "Newer businesses are typically matched with startup-friendly or revenue-based programs.",
  },
};

export default function LoanCalculatorClient() {
  const [credit, setCredit] = useState("680+");
  const [time, setTime] = useState("5+ years");
  const [revenue, setRevenue] = useState(75000);
  const [showResult, setShowResult] = useState(false);

  const tier = estimateTier({ credit, time, revenue });
  const info = TIER_INFO[tier];
  const low = Math.round((revenue * info.rangeMultiplierLow) / 1000) * 1000;
  const high = Math.round((revenue * info.rangeMultiplierHigh) / 1000) * 1000;

  const formatMoney = (n) =>
    n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`;

  return (
    <main className="calc-page">
      <section className="calc-hero">
        <div className="calc-inner">
          <span className="calc-eyebrow">FREE TOOL</span>
          <h1>Business Funding Estimator</h1>
          <p>
            Get a quick, no-obligation estimate of what funding range and
            speed your business could qualify for — based on the same
            criteria our funding specialists use every day.
          </p>
        </div>
      </section>

      <section className="calc-body">
        <div className="calc-inner calc-grid">
          <div className="calc-form-card">
            <div className="calc-field">
              <label>Credit Score Range</label>
              <select value={credit} onChange={(e) => { setCredit(e.target.value); setShowResult(false); }}>
                {CREDIT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="calc-field">
              <label>Time in Business</label>
              <select value={time} onChange={(e) => { setTime(e.target.value); setShowResult(false); }}>
                {TIME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="calc-field">
              <label>Average Monthly Revenue</label>
              <select value={revenue} onChange={(e) => { setRevenue(Number(e.target.value)); setShowResult(false); }}>
                {REVENUE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <button className="calc-btn" onClick={() => setShowResult(true)}>
              Get My Estimate →
            </button>
            <p className="calc-disclaimer">
              This is an estimate only, not a guarantee of approval or terms.
              Actual funding amounts, rates, and approval depend on full
              application review and lender underwriting.
            </p>
          </div>

          {showResult && (
            <div className="calc-result-card">
              <span className="calc-result-tier">{info.label} Tier</span>
              <h2>{formatMoney(low)} – {formatMoney(high)}</h2>
              <p className="calc-result-label">Estimated funding range</p>

              <div className="calc-result-stats">
                <div>
                  <strong>{info.speed}</strong>
                  <span>Typical decision speed</span>
                </div>
              </div>

              <p className="calc-result-note">{info.rateNote}</p>

              <Link href="/apply" className="calc-result-cta">
                Check My Real Options →
              </Link>
              <p className="calc-result-subtext">
                No obligation. Checking your options doesn't affect your credit score.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
