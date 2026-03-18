import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Incoming lead payload:", body);

    const {
      name,
      email,
      phone,
      city,
      state,
      industry,
      intent_state,
      intent_city,
      intent_industry,
      intent_source,
      loan_amount,
      funding_purpose,
      credit_score,
      time_in_business,
      monthly_revenue,
      lead_tier,
      lender_recommendation
    } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const leadSourceMap = {
      organic: "Industry/City Funding Page",
      paid: "Paid Ads",
      phone: "Phone Call",
      referral: "Referral",
      website: "Website Form"
    };

    const leadSource = leadSourceMap[intent_source] || "Website Form";

    // ─── 1. HUBSPOT ───────────────────────────────────────────
    const hubspotRes = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          properties: {
            firstname: name || "",
            email,
            phone: phone || "",
            city: city || "",
            state: state || "",
            industry: industry || "",
            intent_state: intent_state || state || "",
            intent_city: intent_city || city || "",
            intent_industry: industry || "",
            lead_source: leadSource,
            loan_amount: loan_amount || "",
            funding_purpose: funding_purpose || "",
            credit_score: credit_score || "",
            time_in_business: time_in_business || "",
            monthly_revenue: monthly_revenue || "",
            lead_tier: lead_tier || "",
            lender_recommendation: lender_recommendation || ""
          }
        })
      }
    );

    const hubspotData = await hubspotRes.json();

    if (!hubspotRes.ok) {
      console.error("❌ HubSpot API error:", hubspotData);
      return NextResponse.json(
        { error: "HubSpot rejected request", details: hubspotData },
        { status: 500 }
      );
    }

    console.log("✅ HubSpot success:", hubspotData);

    // ─── 2. EMAIL NOTIFICATION (Resend) ───────────────────────
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "leads@smallbusiness.capital",
          to: process.env.ALERT_EMAIL,
          subject: `🔥 New Lead [${lead_tier?.toUpperCase() || "?"}]: ${intent_industry || industry || "Unknown"} — ${intent_city || city || "Unknown"}, ${intent_state || state || "Unknown"}`,
          html: `
            <h2>New Lead Submitted</h2>
            <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
              <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${name || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${email}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${phone || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Industry</td><td style="padding:8px;">${intent_industry || industry || "--"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">City</td><td style="padding:8px;">${intent_city || city || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">State</td><td style="padding:8px;">${intent_state || state || "--"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Loan Amount</td><td style="padding:8px;">${loan_amount || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Funding Purpose</td><td style="padding:8px;">${funding_purpose || "--"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Credit Score</td><td style="padding:8px;">${credit_score || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Time in Business</td><td style="padding:8px;">${time_in_business || "--"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Monthly Revenue</td><td style="padding:8px;">${monthly_revenue || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Lead Tier</td><td style="padding:8px;font-weight:bold;color:${lead_tier === 'prime' ? '#16a34a' : lead_tier === 'near-prime' ? '#d97706' : '#dc2626'}">${lead_tier?.toUpperCase() || "--"}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Send To</td><td style="padding:8px;font-weight:bold;">${lender_recommendation || "--"}</td></tr>
              <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Source</td><td style="padding:8px;">${leadSource}</td></tr>
            </table>
            <p style="margin-top:16px;color:#666;font-size:12px;">View in HubSpot: https://app.hubspot.com/contacts</p>
          `
        })
      });
      console.log("✅ Email notification sent");
    } catch (emailErr) {
      console.error("⚠️ Email notification failed:", emailErr);
    }

    // ─── 3. SMS NOTIFICATION (AT&T email-to-SMS via Resend) ───
    try {
      const smsText = `New Lead [${lead_tier?.toUpperCase() || "?"}] ${name || "Unknown"} | ${phone || "No phone"} | ${intent_city || city || "?"}, ${intent_state || state || "?"} | ${intent_industry || industry || "?"} | ${loan_amount || "?"} | Credit: ${credit_score || "?"} | ${time_in_business || "?"} | Rev: ${monthly_revenue || "?"} | Send to: ${lender_recommendation || "?"}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "leads@smallbusiness.capital",
          to: process.env.ALERT_SMS_GATEWAY, // 7169034623@txt.att.net
          subject: "", // carriers ignore subject, body is what shows as SMS
          text: smsText
        })
      });
      console.log("✅ SMS notification sent via AT&T gateway");
    } catch (smsErr) {
      console.error("⚠️ SMS notification failed:", smsErr);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("🔥 Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
