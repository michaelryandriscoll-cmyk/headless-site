// app/api/upload/init/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import crypto from "crypto";

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

function generateToken(name) {
  // Slugify the name: "John Smith" → "john-smith"
  const nameSlug = (name || "applicant")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 20);

  // 4-char uppercase code: "K7X2"
  const code = crypto.randomBytes(3).toString("hex").toUpperCase().substring(0, 4);

  return `${nameSlug}-${code}`;
}

export async function POST(request) {
  try {
    const { name, email, phone, loanAmount, businessName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const token = generateToken(name);
    const createdAt = new Date().toISOString();

    const metadata = {
      token,
      name: name || "",
      email,
      phone: phone || "",
      loanAmount: loanAmount || "",
      businessName: businessName || "",
      createdAt,
      files: [],
      status: "pending",
    };

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `sessions/${token}/session.json`,
      Body: JSON.stringify(metadata, null, 2),
      ContentType: "application/json",
    }));

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Upload init error:", err);
    return NextResponse.json({ error: "Failed to create upload session" }, { status: 500 });
  }
}
