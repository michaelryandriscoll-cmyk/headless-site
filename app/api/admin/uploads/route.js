// app/api/admin/uploads/route.js
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
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

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const listCmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: "sessions/",
      Delimiter: "/",
    });
    const listResult = await s3.send(listCmd);
    const sessionPrefixes = listResult.CommonPrefixes?.map((p) => p.Prefix) || [];

    const sessions = await Promise.all(
      sessionPrefixes.map(async (prefix) => {
        try {
          const sessionKey = `${prefix}session.json`;
          const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: sessionKey });
          const response = await s3.send(getCmd);
          const str = await response.Body.transformToString();
          const session = JSON.parse(str);

          if (session.files && session.files.length > 0) {
            session.files = await Promise.all(
              session.files.map(async (f) => ({
                ...f,
                downloadUrl: await getSignedUrl(
                  s3,
                  new GetObjectCommand({ Bucket: BUCKET, Key: f.key }),
                  { expiresIn: 3600 }
                ),
              }))
            );
          }
          return session;
        } catch {
          return null;
        }
      })
    );

    const sorted = sessions
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ sessions: sorted });
  } catch (err) {
    console.error("Admin uploads error:", err);
    return NextResponse.json({ error: "Failed to fetch uploads" }, { status: 500 });
  }
}