// app/api/upload/complete/route.js
import { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

async function getSessionMetadata(sessionId) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: `sessions/${sessionId}/session.json` });
  const response = await s3.send(cmd);
  const str = await response.Body.transformToString();
  return JSON.parse(str);
}

async function listUploadedFiles(sessionId) {
  const cmd = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: `sessions/${sessionId}/files/` });
  const response = await s3.send(cmd);
  return response.Contents || [];
}

async function generateDownloadUrl(key) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 7 * 24 * 60 * 60 });
}

async function sendBrevoNotification(session, fileLinks) {
  const fileListHtml = fileLinks
    .map((f) => `<li style="margin-bottom:8px;"><a href="${f.url}" style="color:#00a870;font-weight:600;">${f.name}</a> <span style="color:#666;font-size:13px;">(link expires in 7 days)</span></li>`)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0f2342; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">📁 New Document Upload</h1>
        <p style="color: #7fb3d3; margin: 4px 0 0; font-size: 14px;">Small Business Capital — Secure Portal</p>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width:100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 8px 0; color: #666; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${session.name || "Not provided"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${session.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${session.phone || "Not provided"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Business</td><td style="padding: 8px 0;">${session.businessName || "Not provided"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Loan Amount</td><td style="padding: 8px 0;">${session.loanAmount || "Not provided"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Submitted</td><td style="padding: 8px 0;">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</td></tr>
        </table>
        <h3 style="color: #0f2342; margin: 0 0 12px;">Uploaded Files (${fileLinks.length})</h3>
        <ul style="padding-left: 20px; margin: 0 0 24px;">${fileListHtml}</ul>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #166534; font-size: 13px;">⚠️ Download links expire in <strong>7 days</strong>. Download and save immediately.</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://smallbusiness.capital"}/admin/uploads"
           style="display:inline-block; background:#00a870; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          View All Submissions →
        </a>
      </div>
    </div>
  `;

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Small Business Capital", email: "leads@smallbusiness.capital" },
      to: [{ email: process.env.ALERT_EMAIL, name: "Mike" }],
      subject: `📁 Documents Uploaded — ${session.name || session.email}${session.businessName ? " / " + session.businessName : ""}`,
      htmlContent: html,
    }),
  });
}

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId || !/^[a-f0-9]{48}$/.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const session = await getSessionMetadata(sessionId);
    const objects = await listUploadedFiles(sessionId);

    if (objects.length === 0) {
      return NextResponse.json({ error: "No files found" }, { status: 400 });
    }

    const fileLinks = await Promise.all(
      objects.map(async (obj) => {
        const fileName = obj.Key.split("/").pop().replace(/^\d{2}-/, "");
        const url = await generateDownloadUrl(obj.Key);
        return { name: fileName, url, key: obj.Key, size: obj.Size };
      })
    );

    const updatedSession = {
      ...session,
      files: fileLinks.map((f) => ({ name: f.name, key: f.key, size: f.size })),
      status: "complete",
      completedAt: new Date().toISOString(),
    };

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `sessions/${sessionId}/session.json`,
      Body: JSON.stringify(updatedSession, null, 2),
      ContentType: "application/json",
    }));

    await sendBrevoNotification(session, fileLinks);

    return NextResponse.json({ success: true, fileCount: fileLinks.length });
  } catch (err) {
    console.error("Upload complete error:", err);
    return NextResponse.json({ error: "Failed to complete upload" }, { status: 500 });
  }
}