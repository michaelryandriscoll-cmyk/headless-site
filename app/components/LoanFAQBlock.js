// app/components/LoanFAQBlock.js

export default function LoanFAQBlock({
  cityName,
  stateName,
  creditScore,
  processingTime,
}) {
  const csText = creditScore || "flexible credit profiles";
  const ptText = processingTime || "as fast as 24 hours";

  const faqs = [
    {
      q: `Which types of business loans are available in ${cityName}?`,
      a: `Most ${cityName} businesses can access working capital advances, business lines of credit, equipment financing, and consolidation options through our national lender network serving ${stateName}.`,
    },
    {
      q: `Do I need collateral for funding in ${cityName}?`,
      a: `In most cases, no. Many ${stateName} programs focus on your business revenue and performance, not hard collateral or real estate. That’s ideal for service, retail, restaurant, and e-commerce businesses in ${cityName}.`,
    },
    {
      q: `What credit score is required to qualify?`,
      a: `We work with lenders that can consider ${csText}. Strong revenue and consistent deposits can sometimes offset weaker credit, especially for established ${cityName} businesses.`,
    },
    {
      q: `How fast can I get funded?`,
      a: `For complete application files, approvals and funding can happen ${ptText}. More complex requests, larger amounts, or equipment-heavy files may take a few days longer.`,
    },
    {
      q: `Will checking my options hurt my credit?`,
      a: `Pre-qualification is typically based on a soft inquiry or business data only, which does not impact your personal credit score. You’ll see your options before deciding to move forward.`,
    },
  ];

  return (
    <div>
      <h2>Frequently Asked Questions for {cityName} Business Owners</h2>
      <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
        Answers to common questions from local owners in {cityName},{" "}
        {stateName} about business funding, approvals, and how our lender
        marketplace works.
      </p>

      <div>
        {faqs.map((item, idx) => (
          <details
            key={idx}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px 14px",
              marginBottom: "10px",
              background: "#f9fafb",
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                cursor: "pointer",
                listStyle: "none",
              }}
            >
              {item.q}
            </summary>
            <p style={{ marginTop: "8px", color: "#4b5563", fontSize: "0.95rem" }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}// JavaScript Document