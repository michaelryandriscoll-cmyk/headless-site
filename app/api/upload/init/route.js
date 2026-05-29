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

export async function POST(request) {
  try {
    const { name, email, phone, loanAmount, businessName } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    const sessionId = crypto.randomBytes(24).toString("hex");
    const createdAt = new Date().toISOString();
    const metadata = {
      sessionId, name: name || "", email, phone: phone || "",
      loanAmount: loanAmount || "", businessName: businessName || "",
      createdAt, files: [], status: "pending",
    };
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `sessions/${sessionId}/session.json`,
      Body: JSON.stringify(metadata, null, 2),
      ContentType: "application/json",
    }));
    return NextResponse.json({ sessionId });
  } catch (err) {
    console.error("Upload init error:", err);
    return NextResponse.json({ error: "Failed to create upload session" }, { status: 500 });
  }
}
