// app/api/upload/presign/route.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
];

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(request) {
  try {
    const { sessionId, fileName, fileType, fileSize, fileIndex } = await request.json();

    if (!sessionId || !fileName || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[a-f0-9]{48}$/.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: "Only PDF, JPG, and PNG files are accepted" }, { status: 400 });
    }

    if (fileSize > MAX_BYTES) {
      return NextResponse.json({ error: "File too large. Maximum size is 25MB per file." }, { status: 400 });
    }

    const safeName = fileName
      .replace(/[^a-zA-Z0-9._\-\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);

    const key = `sessions/${sessionId}/files/${String(fileIndex).padStart(2, "0")}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

    return NextResponse.json({ presignedUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}