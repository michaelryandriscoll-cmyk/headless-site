// app/api/upload/lookup/route.js
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_UPLOADS_KEY,
    secretAccessKey: process.env.DO_SPACES_UPLOADS_SECRET,
  },
  forcePathStyle: false,
});

const BUCKET = process.env.DO_SPACES_UPLOADS_BUCKET;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // List all session folders
    const listCmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: "sessions/",
      Delimiter: "/",
    });
    const listResult = await s3.send(listCmd);
    const sessionPrefixes = listResult.CommonPrefixes?.map((p) => p.Prefix) || [];

    // Search for matching email
    let matchedSession = null;
    for (const prefix of sessionPrefixes) {
      try {
        const getCmd = new GetObjectCommand({
          Bucket: BUCKET,
          Key: `${prefix}session.json`,
        });
        const response = await s3.send(getCmd);
        const str = await response.Body.transformToString();
        const session = JSON.parse(str);

        if (session.email?.toLowerCase() === email.toLowerCase()) {
          if (!matchedSession || new Date(session.createdAt) > new Date(matchedSession.createdAt)) {
            matchedSession = session;
          }
        }
      } catch {
        continue;
      }
    }

    // Always return success — don't reveal whether email exists
    if (!matchedSession) {
      return NextResponse.json({ success: true });
    }

    const uploadLink = `${process.env.NEXT_PUBLIC_SITE_URL}/upload/${matchedSession.token}`;
    const firstName = (matchedSession.name || "").split(" ")[0] || "there";

    // Send via Resend (SBC uses Resend, not Brevo)
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "leads@smallbusiness.capital",
        to: matchedSession.email,
        subject: "Your Document Upload Link — Small Business Capital",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0f2342; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Small Business Capital</h1>
              <p style="color: #7fb3d3; margin: 4px 0 0; font-size: 14px;">Secure Document Portal</p>
            </div>
            <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="color: #0f2342; font-size: 16px; margin: 0 0 16px;">Hi ${firstName},</p>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
                Here's your secure document upload link. Click below to upload your bank statements and signed merchant application.
              </p>
              <div style="text-align: center; margin: 0 0 28px;">
                <a href="${uploadLink}" style="display: inline-block; background: #00a870; color: #ffffff; text-decoration: none; border-radius: 10px; padding: 16px 32px; font-size: 16px; font-weight: 700;">
                  Upload My Documents →
                </a>
                <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0;">Or copy this link: ${uploadLink}</p>
              </div>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Questions? Call us at <a href="tel:18889008979" style="color: #2563eb; font-weight: 600;">(888) 900-8979</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Upload lookup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
