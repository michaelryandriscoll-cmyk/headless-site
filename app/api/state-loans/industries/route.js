import { NextResponse } from "next/server";
import industries from "@/app/lib/_industryList25";

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

  const industryList = industries.map((i) => i.slug).sort();
  return NextResponse.json({ industries: industryList });
}