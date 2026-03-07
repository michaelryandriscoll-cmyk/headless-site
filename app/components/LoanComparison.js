// app/components/LoanComparison.js

// loanPrograms comes from WPGraphQL: stateLoanFields.loanPrograms[]
// Fields we know exist: programName, termLength, description (HTML), applyLink

export default function LoanComparison({ cityName, stateName, loanPrograms }) {
  if (!loanPrograms || loanPrograms.length === 0) {
    return (
      <p style={{ marginTop: "1rem", color: "#6b7280" }}>
        Loan programs for {stateName} will display here as your content
        builds out. In the meantime, you can still apply to see real lender
        offers for your business in {cityName}.
      </p>
    );
  }

  return (
    <div
      style={{
        marginTop: "1.5rem",
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "640px",
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              borderBottom: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            <th style={{ padding: "10px" }}>Program</th>
            <th style={{ padding: "10px" }}>Best For</th>
            <th style={{ padding: "10px" }}>Typical Terms</th>
            <th style={{ padding: "10px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loanPrograms.map((program, idx) => {
            const applyUrl = program.applyLink?.url || "/apply";
            const applyTitle =
              program.applyLink?.title || "Apply for this program";

            return (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  verticalAlign: "top",
                }}
              >
                <td style={{ padding: "10px", fontWeight: 600 }}>
                  {program.programName || "Funding Program"}
                </td>
                <td style={{ padding: "10px", fontSize: "0.95rem" }}>
                  {program.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: program.description,
                      }}
                    />
                  ) : (
                    <span>
                      Flexible funding option for {cityName} businesses in{" "}
                      {stateName}.
                    </span>
                  )}
                </td>
                <td style={{ padding: "10px", fontSize: "0.95rem" }}>
                  {program.termLength || "Varies by file"}
                </td>
                <td style={{ padding: "10px" }}>
                  <a
                    href={applyUrl}
                    style={{
                      display: "inline-block",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background: "#00c684",
                      color: "#0b1f41",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {applyTitle}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p
        style={{
          marginTop: "0.75rem",
          fontSize: "0.85rem",
          color: "#9ca3af",
        }}
      >
        *Actual approvals, amounts, and terms for {cityName} businesses vary by
        industry, revenue, time in business, and lender underwriting.
      </p>
    </div>
  );
}// JavaScript Document