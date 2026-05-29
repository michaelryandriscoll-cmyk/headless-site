"use client";
// app/upload/page.js
// Upload link lookup page — linked from nav as "Upload Documents"
// Leads enter their email to get their upload link resent.

import { useState } from "react";

export default function UploadIndexPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/upload/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2342 0%, #1a3a5c 100%)", marginTop:"50px", padding: "80px 16px 80px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#ffffff", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "16px" }}>Small Business Capital</div>
          </a>
          <div style={{ fontSize: "13px", color: "#7fb3d3", fontWeight: "500", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Secure Document Portal</div>
          <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "800", margin: "0 0 8px" }}>Upload Your Documents</h1>
          <p style={{ color: "#93c5fd", fontSize: "15px", margin: 0 }}>Enter your email to access your secure upload portal.</p>
        </div>

        <div style={{ background: "#ffffff", borderRadius: "16px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {status === "sent" ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>📧</div>
              <h2 style={{ color: "#0f2342", fontSize: "22px", fontWeight: "800", marginBottom: "12px" }}>Check your email</h2>
              <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
                If we have a funding application on file for <strong>{email}</strong>, we've sent your secure upload link. It should arrive within a minute.
              </p>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "20px" }}>
                Don't see it? Check your spam folder or call us.
              </p>
              <button
                onClick={() => { setStatus("idle"); setEmail(""); }}
                style={{ background: "transparent", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", color: "#6b7280", cursor: "pointer" }}
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px" }}>
                <span style={{ fontSize: "18px" }}>🔒</span>
                <div style={{ fontSize: "13px", color: "#166534" }}>
                  <strong>Secure portal.</strong> Your documents are encrypted and only accessible by our funding team.
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <label style={{ display: "block", fontWeight: "600", color: "#0f2342", fontSize: "14px", marginBottom: "6px" }}>
                  Email address used when you applied
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "15px", marginBottom: "16px", outline: "none", boxSizing: "border-box" }}
                />

                {status === "error" && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", color: "#dc2626", fontSize: "13px" }}>
                    Something went wrong. Please try again or call (888) 900-8979.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{ width: "100%", background: status === "loading" ? "#9ca3af" : "#0f2342", color: "#ffffff", border: "none", borderRadius: "10px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: status === "loading" ? "not-allowed" : "pointer" }}
                >
                  {status === "loading" ? "Looking up your link…" : "Send My Upload Link →"}
                </button>
              </form>

              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 4px" }}>Haven't applied yet?</p>
                <a href="/apply" style={{ color: "#2563eb", fontWeight: "600", fontSize: "14px" }}>Start your funding application →</a>
              </div>

              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "16px", marginBottom: 0 }}>
                Need help? Call <a href="tel:18889008979" style={{ color: "#6b7280" }}>(888) 900-8979</a>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
