// app/api/upload/session/route.js
// Returns session metadata for a given token — used by the upload page to
// show the lead's name and check if already completed.

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || !/^[a-z0-9\-]+$/.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const cmd = new GetObjectCommand({
      Bucket: BUCKET,
      Key: `sessions/${token}/session.json`,
    });
    const response = await s3.send(cmd);
    const str = await response.Body.transformToString();
    const session = JSON.parse(str);

    // Only return safe fields to the client
    return NextResponse.json({
      name: session.name,
      status: session.status,
      createdAt: session.createdAt,
    });
  } catch {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
}
