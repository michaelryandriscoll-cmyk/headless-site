"use client";
import { useState } from "react";

export default function LeadForm({
  city = "",
  state = "",
  industry = "",
  intentState = "",
  intentCity = "",
  intentSource = "organic"
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    loan_amount: "",
    funding_purpose: "",
    credit_score: "",
    time_in_business: "",
    monthly_revenue: ""
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function getLeadTier() {
    const credit = form.credit_score;
    const time = form.time_in_business;
    const revenue = form.monthly_revenue;
    const purpose = form.funding_purpose;

    if (purpose === "Equipment Purchase") return "equipment";
    if (time === "Under 6 months") return "startup";
    if (credit === "680+") return "prime";
    if (credit === "580-679") return "near-prime";
    return "subprime";
  }

  function getLenderRecommendation() {
    const tier = getLeadTier();
    const map = {
      prime: "Lendio / Fundera",
      "near-prime": "Credibly / Ondeck",
      subprime: "Greenbox / Rapid Finance",
      equipment: "Equipment Specialty Lender",
      startup: "MCA / Short-Term Lender"
    };
    return map[tier] || "General Network";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/hubspot/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        city,
        state,
        industry,
        intent_state: intentState || state || "",
        intent_city: intentCity || city || "",
        intent_source: intentSource,
        lead_tier: getLeadTier(),
        lender_recommendation: getLenderRecommendation()
      })
    });

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  function handleStep1(e) {
    e.preventDefault();
    setStep(2);
  }

  if (status === "success") {
    return (
      <div className="lead-form-box">
        <div className="lead-success">
          <p>✅ Your request has been received. An advisor will reach out shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-form-box">

      {step === 1 && (
        <form onSubmit={handleStep1} className="lead-form">
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              let formatted = digits;
              if (digits.length >= 7) {
                formatted = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
              } else if (digits.length >= 4) {
                formatted = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
              } else if (digits.length >= 1) {
                formatted = `(${digits}`;
              }
              setForm({ ...form, phone: formatted });
            }}
            inputMode="numeric"
            maxLength={14}
            required
          />

          <label htmlFor="loan_amount" className="sr-only">How much funding do you need?</label>
          <select
            id="loan_amount"
            name="loan_amount"
            value={form.loan_amount}
            onChange={handleChange}
            required
            style={{ appearance: "auto" }}
          >
            <option value="" disabled>Funding Amount Needed</option>
            <option value="Under $10,000">Under $10,000</option>
            <option value="$10,000 - $50,000">$10,000 – $50,000</option>
            <option value="$50,000 - $150,000">$50,000 – $150,000</option>
            <option value="$150,000 - $500,000">$150,000 – $500,000</option>
            <option value="$500,000+">$500,000+</option>
          </select>

          <label htmlFor="funding_purpose" className="sr-only">What is this for?</label>
          <select
            id="funding_purpose"
            name="funding_purpose"
            value={form.funding_purpose}
            onChange={handleChange}
            required
            style={{ appearance: "auto" }}
          >
            <option value="" disabled>What is this for?</option>
            <option value="Working Capital">Working Capital</option>
            <option value="Equipment Purchase">Equipment Purchase</option>
            <option value="Business Expansion">Business Expansion</option>
            <option value="Payroll / Cash Flow">Payroll / Cash Flow</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit">
            Continue <span aria-hidden="true">→</span>
          </button>

          <p className="form-alt-contact">
            Prefer to talk? <a href="tel:18889008979">(888) 900-8979</a>
          </p>

          <p className="form-tcpa">
            By submitting this form, I agree to receive calls, texts, and emails
            from Small Business Capital and its lending partners at the number and
            email provided. Consent is not required to obtain services. Message and
            data rates may apply. Reply STOP to opt out.{" "}
            <a href="/privacy-policy">Privacy Policy</a>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="lead-form">

          <label htmlFor="credit_score" className="sr-only">Credit Score Range</label>
          <select
            id="credit_score"
            name="credit_score"
            value={form.credit_score}
            onChange={handleChange}
            required
            style={{ appearance: "auto" }}
          >
            <option value="" disabled>Estimated Credit Score</option>
            <option value="Under 500">Under 500</option>
            <option value="500-579">500 – 579</option>
            <option value="580-619">580 – 619</option>
            <option value="620-679">620 – 679</option>
            <option value="680+">680+</option>
          </select>

          <label htmlFor="time_in_business" className="sr-only">Time in Business</label>
          <select
            id="time_in_business"
            name="time_in_business"
            value={form.time_in_business}
            onChange={handleChange}
            required
            style={{ appearance: "auto" }}
          >
            <option value="" disabled>Time in Business</option>
            <option value="Under 6 months">Under 6 months</option>
            <option value="6-12 months">6 – 12 months</option>
            <option value="1-2 years">1 – 2 years</option>
            <option value="2-5 years">2 – 5 years</option>
            <option value="5+ years">5+ years</option>
          </select>

          <label htmlFor="monthly_revenue" className="sr-only">Monthly Revenue</label>
          <select
            id="monthly_revenue"
            name="monthly_revenue"
            value={form.monthly_revenue}
            onChange={handleChange}
            required
            style={{ appearance: "auto" }}
          >
            <option value="" disabled>Average Monthly Revenue</option>
            <option value="Under $5,000">Under $5,000</option>
            <option value="$5,000 - $10,000">$5,000 – $10,000</option>
            <option value="$10,000 - $25,000">$10,000 – $25,000</option>
            <option value="$25,000 - $50,000">$25,000 – $50,000</option>
            <option value="$50,000 - $100,000">$50,000 – $100,000</option>
            <option value="$100,000+">$100,000+</option>
          </select>

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Check My Funding Options"}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(15,23,42,0.5)",
              fontSize: "13px",
              cursor: "pointer",
              marginTop: "8px",
              textDecoration: "underline"
            }}
          >
            ← Back
          </button>

        </form>
      )}

      {status === "error" && (
        <p className="lead-error">
          Something went wrong. Try again or call{" "}
          <a href="tel:18889008979">(888) 900-8979</a>.
        </p>
      )}
    </div>
  );
}