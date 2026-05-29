"use client";
// app/apply/thank-you/page.js
import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";

export default function ThankYouPage() {
  const [uploadToken, setUploadToken] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("sbcUploadToken");
      if (stored) setUploadToken(stored);
    } catch {}
  }, []);

  return (
    <>
      <Script id="google-ads-conversion" strategy="afterInteractive">{`
        gtag('event', 'conversion', {
          'send_to': 'AW-18096733041/L5peCKT6qZ0cEPH2mLVD',
          'value': 1.0,
          'currency': 'USD'
        });
      `}</Script>

      <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2342 0%, #1a3a5c 100%)", padding: "60px 16px 80px", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <div style={{ color: "#ffffff", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px", marginBottom: "32px" }}>Small Business Capital</div>
            </a>
          </div>

          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "40px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
            <h1 style={{ color: "#0f2342", fontSize: "26px", fontWeight: "800", margin: "0 0 12px" }}>Application Received!</h1>
            <p style={{ color: "#4b5563", fontSize: "16px", lineHeight: "1.6", marginBottom: "28px" }}>
              Thank you — we've received your funding request and a specialist will be in touch within <strong>1 business day</strong>.
            </p>

            {/* Upload now box — shown if token is available */}
            {uploadToken ? (
              <div style={{ background: "#f0fdf4", border: "2px solid #00a870", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", textAlign: "left" }}>
                <div style={{ fontWeight: "700", color: "#166534", fontSize: "15px", marginBottom: "8px" }}>
                  📁 Have your documents ready?
                </div>
                <p style={{ color: "#166534", fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px" }}>
                  Upload your bank statements and signed application now to speed up your approval — it only takes a few minutes.
                </p>
                <a
                  href={`/upload/${uploadToken}`}
                  style={{ display: "block", background: "#00a870", color: "#ffffff", textDecoration: "none", borderRadius: "8px", padding: "13px 20px", fontSize: "15px", fontWeight: "700", textAlign: "center" }}
                >
                  Upload My Documents Now →
                </a>
              </div>
            ) : (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "20px", marginBottom: "24px", textAlign: "left" }}>
                <div style={{ fontWeight: "700", color: "#166534", marginBottom: "8px", fontSize: "15px" }}>📋 To speed up your approval:</div>
                <p style={{ color: "#166534", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                  We'll email you a <strong>secure upload link</strong> to submit your last 3 bank statements and signed application.
                  Having these ready will significantly speed up your funding decision.
                </p>
              </div>
            )}

            <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px", textAlign: "left" }}>
              <div style={{ fontWeight: "700", color: "#0f2342", marginBottom: "8px", fontSize: "14px" }}>What happens next:</div>
              <ol style={{ margin: 0, paddingLeft: "20px", color: "#4b5563", lineHeight: "1.9", fontSize: "14px" }}>
                {uploadToken ? (
                  <>
                    <li>Upload your documents using the button above</li>
                    <li>We review your file (same business day)</li>
                    <li>A specialist contacts you with your funding offer</li>
                  </>
                ) : (
                  <>
                    <li>Check your email for your secure upload link</li>
                    <li>Upload your bank statements &amp; signed application</li>
                    <li>A specialist reviews your file (same business day)</li>
                    <li>You receive your funding offer</li>
                  </>
                )}
              </ol>
            </div>

            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              Questions? Call us at{" "}
              <a href="tel:18889008979" style={{ color: "#2563eb", fontWeight: "600" }}>(888) 900-8979</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
