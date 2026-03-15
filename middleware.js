import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://smallbusiness.capital",
  "https://www.smallbusiness.capital",
  "http://localhost:3000",
];

export function middleware(request) {
  const origin = request.headers.get("origin") ?? "";
  const response = NextResponse.next();

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};