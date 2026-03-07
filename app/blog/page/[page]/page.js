// app/blog/page/[page]/page.js
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 300;

const POSTS_PER_PAGE = 9;

function stripHtml(html = "") {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

async function getPostsPage(pageNum = 1) {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;

  if (!base) {
    console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
    return { posts: [], totalPages: 1 };
  }

  const page = Math.max(1, Number(pageNum) || 1);

  // 1) fetch posts
  const postsRes = await fetch(
    `${base}/wp/v2/posts?per_page=${POSTS_PER_PAGE}&page=${page}&_fields=id,slug,title,excerpt,date`,
    { next: { revalidate } }
  );

  if (!postsRes.ok) {
    return { posts: [], totalPages: 1 };
  }

  const posts = await postsRes.json();

  // 2) total pages from header
  const totalPages = Number(postsRes.headers.get("X-WP-TotalPages")) || 1;

  return { posts: posts || [], totalPages };
}

export async function generateStaticParams() {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;
  if (!base) return [];

  try {
    // Just get total pages by requesting 1 post
    const res = await fetch(`${base}/wp/v2/posts?per_page=1&page=1`, {
      next: { revalidate },
    });

    if (!res.ok) return [];

    const totalPages = Number(res.headers.get("X-WP-TotalPages")) || 1;

    // Generate /blog/page/2, /blog/page/3, ...
    // (page 1 stays at /blog)
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((n) => n > 1)
      .map((n) => ({ page: String(n) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { page } = await params; // ✅ Next.js 16 fix

  const pageNum = Math.max(1, Number(page) || 1);

  return {
    title:
      pageNum > 1
        ? `Blog (Page ${pageNum}) | Small Business Capital`
        : "Blog | Small Business Capital",
    description:
      "Business funding insights, loan program guides, and approval tips for small business owners.",
    alternates: {
      canonical: pageNum > 1 ? `/blog/page/${pageNum}` : "/blog",
    },
  };
}

export default async function BlogPaginatedPage({ params }) {
  const { page } = await params; // ✅ Next.js 16 fix

  const pageNum = Math.max(1, Number(page) || 1);

  const { posts, totalPages } = await getPostsPage(pageNum);

  return (
    <main style={{ padding: "96px 0", background: "#fff" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 28px" }}>
        <header style={{ textAlign: "center", marginBottom: "34px" }}>
          <h1
            style={{
              fontSize: "clamp(34px, 4vw, 52px)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              fontWeight: 900,
              margin: "0 0 10px",
              color: "#0f172a",
            }}
          >
            Blog
          </h1>

          <p style={{ margin: 0, color: "rgba(15,23,42,0.68)" }}>
            Funding insights, lender tips, and business growth strategies.
          </p>
        </header>

        {posts.length === 0 ? (
          <div
            style={{
              border: "1px solid rgba(15,23,42,0.08)",
              borderRadius: "18px",
              padding: "22px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0 }}>No posts found on this page.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "18px",
            }}
          >
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                style={{
                  display: "block",
                  padding: "18px",
                  borderRadius: "18px",
                  border: "1px solid rgba(15,23,42,0.08)",
                  textDecoration: "none",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
                }}
              >
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  {new Date(p.date).toLocaleDateString()}
                </div>

                <h3
                  style={{
                    margin: "8px 0 10px",
                    fontSize: "18px",
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                  dangerouslySetInnerHTML={{ __html: p.title?.rendered || "" }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "rgba(15,23,42,0.72)",
                  }}
                >
                  {stripHtml(p.excerpt?.rendered || "").slice(0, 140)}...
                </p>

                <div
                  style={{
                    marginTop: "12px",
                    fontWeight: 900,
                    color: "#0b1f41",
                  }}
                >
                  Read post →
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "28px",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div>
            {pageNum > 1 ? (
              <Link
                href={pageNum - 1 === 1 ? "/blog" : `/blog/page/${pageNum - 1}`}
                style={{ fontWeight: 900, textDecoration: "none" }}
              >
                ← Previous
              </Link>
            ) : (
              <span style={{ opacity: 0.4, fontWeight: 900 }}>← Previous</span>
            )}
          </div>

          <div style={{ color: "rgba(15,23,42,0.65)", fontWeight: 800 }}>
            Page {pageNum} of {totalPages}
          </div>

          <div>
            {pageNum < totalPages ? (
              <Link
                href={`/blog/page/${pageNum + 1}`}
                style={{ fontWeight: 900, textDecoration: "none" }}
              >
                Next →
              </Link>
            ) : (
              <span style={{ opacity: 0.4, fontWeight: 900 }}>Next →</span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}