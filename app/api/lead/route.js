import { NextResponse } from "next/server";

/**
 * Central lead intake endpoint
 * - Enriches lead with state/city intent
 * - Normalizes payload
 * - Forwards to HubSpot
 */

export async function POST(req) {
  try {
    const body = await req.json();

    /**
     * 1️⃣ Extract base form fields
     */
    const {
      name,
      email,
      phone,
      industry,
      intent_state,
      intent_city,
      intent_source = "organic"
    } = body;

    /**
     * 2️⃣ Validate required fields
     */
    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /**
     * 3️⃣ Build normalized lead payload
     * This is the SINGLE source of truth
     */
    const leadPayload = {
      name,
      email,
      phone: phone || "",
      industry: industry || "",
      intent_state: intent_state || "",
      intent_city: intent_city || "",
      intent_source
    };

    /**
     * 4️⃣ Forward to HubSpot
     */
    const hubspotRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/hubspot/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload)
      }
    );

    if (!hubspotRes.ok) {
      const errorText = await hubspotRes.text();
      throw new Error(`HubSpot error: ${errorText}`);
    }

    /**
     * 5️⃣ Success response (for UI)
     */
    return NextResponse.json({
      success: true,
      lead: leadPayload
    });

  } catch (err) {
    console.error("Lead intake error:", err);

    return NextResponse.json(
      { error: "Lead submission failed" },
      { status: 500 }
    );
  }
}