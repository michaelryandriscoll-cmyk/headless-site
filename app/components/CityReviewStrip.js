// app/components/CityReviewStrip.js

export default function CityReviewStrip({ cityName, stateName }) {
  const reviews = [
    {
      name: "Restaurant Owner",
      location: `${cityName}, ${stateName}`,
      text: `“We went from application to funded in just a couple of days. It was much easier than trying another bank in ${cityName}.”`,
    },
    {
      name: "Contractor",
      location: `${stateName}`,
      text: `“The working capital program helped us take on larger jobs without waiting on slow-paying invoices.”`,
    },
    {
      name: "E-commerce Brand",
      location: `${cityName} Area`,
      text: `“Transparent terms and quick communication. The line of credit gives us breathing room for inventory and ad spend.”`,
    },
  ];

  return (
    <div>
      <h2>What Other {stateName} Business Owners Are Saying</h2>
      <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
        Real feedback from businesses using our lender marketplace for working
        capital, expansion, and equipment.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "18px",
        }}
      >
        {reviews.map((review, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "16px 18px",
              background: "#f9fafb",
            }}
          >
            <p style={{ fontSize: "0.95rem", color: "#374151" }}>
              {review.text}
            </p>
            <p
              style={{
                marginTop: "10px",
                fontSize: "0.85rem",
                color: "#6b7280",
              }}
            >
              <strong>{review.name}</strong> • {review.location}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}// JavaScript Document