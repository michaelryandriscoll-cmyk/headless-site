// app/api/business-services/route.js
import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_WP_API_BASE;

    if (!base) {
      return NextResponse.json(
        { ok: false, error: "Missing NEXT_PUBLIC_WP_API_BASE", items: [] },
        { status: 200 }
      );
    }

    // 1) Find parent page
    const parentRes = await fetch(`${base}/wp/v2/pages?slug=business-services`, {
      next: { revalidate },
    });

    if (!parentRes.ok) {
      return NextResponse.json({ ok: false, items: [] }, { status: 200 });
    }

    const parentData = await parentRes.json();
    if (!parentData?.length) {
      return NextResponse.json({ ok: true, items: [] }, { status: 200 });
    }

    const parentId = parentData[0].id;

    // 2) Fetch children
    const childrenRes = await fetch(
      `${base}/wp/v2/pages?parent=${parentId}&per_page=100&_fields=slug,title,acf`,
      { next: { revalidate } }
    );

    if (!childrenRes.ok) {
      return NextResponse.json({ ok: false, items: [] }, { status: 200 });
    }

    const children = await childrenRes.json();

    const items = (children || []).map((p) => ({
      slug: p.slug,
      title: p.title?.rendered || p.slug,
    }));

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e), items: [] },
      { status: 200 }
    );
  }
}