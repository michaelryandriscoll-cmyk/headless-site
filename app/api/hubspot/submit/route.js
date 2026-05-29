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
            lender_recommendation: lender_recommendation || "",
            lead_source_site: "Small Business Capital"
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
          to: process.env.ALERT_SMS_GATEWAY,
          subject: "",
          text: smsText
        })
      });
      console.log("✅ SMS notification sent via AT&T gateway");
    } catch (smsErr) {
      console.error("⚠️ SMS notification failed:", smsErr);
    }

    // ─── 4. GENERATE UPLOAD LINK + EMAIL TO LEAD (Resend) ────
    let uploadToken = null;
    try {
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/upload/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "",
          email: email || "",
          phone: phone || "",
          loanAmount: loan_amount || "",
          businessName: "",
        }),
      });

      const uploadData = await uploadRes.json();

      if (uploadData.token) {
        uploadToken = uploadData.token;
        const uploadLink = `${process.env.NEXT_PUBLIC_SITE_URL}/upload/${uploadToken}`;
        const firstName = (name || "").split(" ")[0] || "there";

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "leads@smallbusiness.capital",
            to: email,
            subject: "Your Secure Document Upload Link — Small Business Capital",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0f2342; padding: 24px 32px; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Small Business Capital</h1>
                  <p style="color: #7fb3d3; margin: 4px 0 0; font-size: 14px;">Secure Document Portal</p>
                </div>
                <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                  <p style="color: #0f2342; font-size: 16px; margin: 0 0 16px;">Hi ${firstName},</p>
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
                    Thank you for your funding request! To move forward quickly, please upload your last <strong>3 months of bank statements</strong> and your <strong>signed merchant application</strong> using your secure portal below.
                  </p>
                  <div style="text-align: center; margin: 0 0 28px;">
                    <a href="${uploadLink}" style="display: inline-block; background: #00a870; color: #ffffff; text-decoration: none; border-radius: 10px; padding: 16px 32px; font-size: 16px; font-weight: 700;">
                      Upload My Documents →
                    </a>
                    <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0;">Or copy this link: ${uploadLink}</p>
                  </div>
                  <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                    <div style="font-weight: 700; color: #0f2342; margin-bottom: 8px; font-size: 14px;">You'll need to upload:</div>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.9; font-size: 14px;">
                      <li>Bank statement — most recent month</li>
                      <li>Bank statement — 2nd most recent month</li>
                      <li>Bank statement — 3rd most recent month</li>
                      <li>Signed merchant application — <a href="https://sbc-uploads-portal.nyc3.digitaloceanspaces.com/sbc_merchant_application_fillable.pdf" style="color:#2563eb;font-weight:600;">download it here</a>, sign, and upload</li>
                    </ul>
                  </div>
                  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px;">
                    <p style="margin: 0; color: #166534; font-size: 13px;">🔒 <strong>Your documents are secure.</strong> Files are encrypted in transit and stored in a private, access-controlled vault.</p>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    Questions? Reply to this email or call us at <a href="tel:18889008979" style="color: #2563eb; font-weight: 600;">(888) 900-8979</a>
                  </p>
                </div>
              </div>
            `,
          }),
        });
        console.log("✅ Upload link emailed to lead:", uploadLink);
      }
    } catch (uploadErr) {
      console.error("⚠️ Upload link generation failed:", uploadErr);
    }

    // Return token to client so thank-you page can show "Upload Now" button
    return NextResponse.json({ success: true, uploadToken });

  } catch (err) {
    console.error("🔥 Server error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
