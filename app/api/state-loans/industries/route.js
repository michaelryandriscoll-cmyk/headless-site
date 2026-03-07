import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const state = (searchParams.get("state") || "").toLowerCase().trim();
  const city = (searchParams.get("city") || "").toLowerCase().trim();

  if (!state || !city) {
    return NextResponse.json(
      { industries: [], error: "Missing state or city" },
      { status: 400 }
    );
  }

  try {
    const dir = path.join(process.cwd(), "data", "industry-city", state, city);

    if (!fs.existsSync(dir)) {
      return NextResponse.json({ industries: [] });
    }

    const files = fs.readdirSync(dir);

    // example: roofing.json → roofing
    const industries = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
      .sort();

    return NextResponse.json({ industries });
  } catch (err) {
    return NextResponse.json(
      { industries: [], error: "Failed reading directory" },
      { status: 500 }
    );
  }
}