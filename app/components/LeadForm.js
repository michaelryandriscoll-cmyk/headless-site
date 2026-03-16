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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    loan_amount: "",
    funding_purpose: ""
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        intent_source: intentSource
      })
    });

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="lead-form-box">
      {status === "success" ? (
        <div className="lead-success">
          <p>Your request has been received. An advisor will reach out shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
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
              // Strip non-digits, limit to 10 digits
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              // Format as (555) 555-5555
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
			<option value="" disabled>How much funding do you need?</option>
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

          {/* Hidden intent fields */}
          <input type="hidden" name="intent_state" value={intentState || state} />
          <input type="hidden" name="intent_city" value={intentCity || city} />
          <input type="hidden" name="intent_source" value={intentSource} />

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Check My Funding Options"}
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

      {status === "error" && (
        <p className="lead-error">
          Something went wrong. Try again or call (888) 900-8979.
        </p>
      )}
    </div>
  );
}
