"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function ThankYouPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof gtag !== "undefined") {
      gtag('event', 'conversion', {
        'send_to': 'AW-18096733041/L5peCKT6qZ0cEPH2mLVD',
        'value': 1.0,
        'currency': 'USD'
      });
    }
  }, []);

  return (
    <main style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"2rem"}}>
      <div>
        <h1 style={{fontSize:"2rem",fontWeight:"700",color:"#0f172a",marginBottom:"1rem"}}>
          ✅ Your Request Has Been Received
        </h1>
        <p style={{fontSize:"1.1rem",color:"#334155",maxWidth:"500px",margin:"0 auto 2rem"}}>
          Thank you for applying. An advisor will review your information and reach out shortly — usually within one business day.
        </p>
        <Link href="/" style={{background:"#00c684",color:"#fff",padding:"14px 28px",borderRadius:"6px",textDecoration:"none",fontWeight:"700"}}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
