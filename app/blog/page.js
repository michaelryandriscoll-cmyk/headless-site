// app/blog/page.js
import "@/app/styles/blog.css";
import Link from "next/link";

export const revalidate = 300;

const POSTS_PER_PAGE = 9;

function stripHtml(html = "") {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

async function getPostsPage1() {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;
  if (!base) {
    console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
    return { posts: [], totalPages: 1 };
  }
  const res = await fetch(
    `${base}/wp/v2/posts?per_page=${POSTS_PER_PAGE}&page=1&_fields=id,slug,title,excerpt,date`,
    { next: { revalidate } }
  );
  if (!res.ok) {
    return { posts: [], totalPages: 1 };
  }
  const posts = await res.json();
  const totalPages = Number(res.headers.get("X-WP-TotalPages")) || 1;
  return { posts: posts || [], totalPages };
}

export async function generateMetadata() {
  return {
    title: "Blog | Small Business Capital",
    description:
      "Business funding insights, loan program guides, and approval tips for small business owners.",
    alternates: {
      canonical: "/blog",
    },
  };
}

export default async function BlogIndexPage() {
  const { posts, totalPages } = await getPostsPage1();
  return (
    <main className="blog-page">
      <div className="blog-container">
        <header className="blog-hero">
          <h1>Blog</h1>
          <p>Funding insights, lender tips, and business growth strategies.</p>
        </header>
        {posts.length === 0 ? (
          <div className="loan-card" style={{ padding: "22px", textAlign: "center" }}>
            <p style={{ margin: 0 }}>No posts found yet.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card">
                <div className="blog-post-meta">
                  {new Date(p.date).toLocaleDateString()}
                </div>
                <h3
                  dangerouslySetInnerHTML={{ __html: p.title?.rendered || "" }}
                />
                <p>
                  {stripHtml(p.excerpt?.rendered || "").slice(0, 140)}
                  ...
                </p>
                <div className="blog-card-cta">
                  Read post <span aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {totalPages > 1 && (
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
            <span style={{ opacity: 0.4, fontWeight: 900 }}>← Previous</span>
            <div style={{ color: "rgba(15,23,42,0.65)", fontWeight: 800 }}>
              Page 1 of {totalPages}
            </div>
            <Link href="/blog/page/2" style={{ fontWeight: 900, textDecoration: "none" }}>
              Next →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}