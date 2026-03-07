// app/blog/category/[slug]/page.js
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 300;

const PER_PAGE = 12;

function stripHtml(html = "") {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function getFeaturedImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  return {
    src: media?.source_url || "",
    alt: media?.alt_text || stripHtml(post?.title?.rendered || "Blog image"),
  };
}

async function getCategoryBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;
  if (!base) return null;

  const res = await fetch(
    `${base}/wp/v2/categories?slug=${slug}&_fields=id,name,slug,description,count`,
    { next: { revalidate } }
  );

  if (!res.ok) return null;

  const cats = await res.json();
  return cats?.[0] || null;
}

async function getPostsByCategoryId(categoryId) {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;
  if (!base) return [];

  const res = await fetch(
    `${base}/wp/v2/posts?per_page=${PER_PAGE}&categories=${categoryId}&_embed&_fields=id,slug,title,excerpt,date,_embedded`,
    { next: { revalidate } }
  );

  if (!res.ok) return [];
  return await res.json();
}

async function getAllCategorySlugs() {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;
  if (!base) return [];

  const res = await fetch(
    `${base}/wp/v2/categories?per_page=100&_fields=slug,count`,
    { next: { revalidate } }
  );

  if (!res.ok) return [];

  const cats = await res.json();
  return (cats || [])
    .filter((c) => c.count > 0)
    .map((c) => ({ slug: c.slug }));
}

export async function generateStaticParams() {
  return await getAllCategorySlugs();
}

export async function generateMetadata({ params }) {
  const cat = await getCategoryBySlug(params.slug);

  if (!cat) {
    return {
      title: "Category not found | Small Business Capital",
      description: "This category does not exist.",
    };
  }

  const title = `${cat.name} Articles | Small Business Capital`;

  return {
    title,
    description:
      stripHtml(cat.description || "") ||
      `Browse business funding articles in the ${cat.name} category.`,
    alternates: {
      canonical: `/blog/category/${cat.slug}`,
    },
  };
}

export default async function BlogCategoryPage({ params }) {
  const cat = await getCategoryBySlug(params.slug);

  if (!cat) {
    return (
      <main style={{ padding: "96px 0", textAlign: "center" }}>
        <h1 style={{ fontWeight: 900 }}>Category not found</h1>
        <Link href="/blog" style={{ fontWeight: 800 }}>
          ← Back to Blog
        </Link>
      </main>
    );
  }

  const posts = await getPostsByCategoryId(cat.id);

  return (
    <main style={{ background: "#fff" }}>
      <section style={{ padding: "96px 0" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ marginBottom: "18px" }}>
            <Link
              href="/blog"
              style={{
                fontWeight: 800,
                textDecoration: "none",
                color: "#0b1f41",
              }}
            >
              ← Back to Blog
            </Link>
          </div>

          <header style={{ textAlign: "center", marginBottom: "28px" }}>
            <h1
              style={{
                fontSize: "clamp(30px, 3.6vw, 46px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 900,
                margin: "0 0 10px",
                color: "#0f172a",
              }}
            >
              {cat.name}
            </h1>

            <p
              style={{
                margin: "0 auto",
                maxWidth: "70ch",
                fontSize: "15px",
                lineHeight: 1.6,
                color: "rgba(15,23,42,0.68)",
              }}
            >
              {stripHtml(cat.description || "") ||
                `Browse articles related to ${cat.name}.`}
            </p>
          </header>

          {posts.length === 0 ? (
            <div
              style={{
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: "18px",
                padding: "22px",
                background: "#fff",
              }}
            >
              <p style={{ margin: 0 }}>
                No posts found in this category yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              {posts.map((p) => {
                const img = getFeaturedImage(p);

                return (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      background: "#fff",
                      border: "1px solid rgba(15,23,42,0.08)",
                      borderRadius: "18px",
                      padding: "18px",
                      boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
                    }}
                  >
                    {img.src ? (
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "170px",
                          objectFit: "cover",
                          borderRadius: "14px",
                          marginBottom: "12px",
                        }}
                      />
                    ) : null}

                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      {formatDate(p.date)}
                    </div>

                    <h3
                      style={{
                        margin: "8px 0 10px",
                        fontSize: "18px",
                        fontWeight: 900,
                        lineHeight: 1.2,
                        color: "#0f172a",
                      }}
                      dangerouslySetInnerHTML={{ __html: p.title?.rendered || "" }}
                    />

                    <p
                      style={{
                        margin: 0,
                        fontSize: "14.5px",
                        lineHeight: 1.55,
                        color: "rgba(15,23,42,0.70)",
                      }}
                    >
                      {stripHtml(p.excerpt?.rendered || "").slice(0, 140)}
                      {stripHtml(p.excerpt?.rendered || "").length > 140
                        ? "…"
                        : ""}
                    </p>

                    <div
                      style={{
                        marginTop: "12px",
                        fontWeight: 900,
                        color: "#0284c7",
                        fontSize: "14px",
                      }}
                    >
                      Read post →
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 980px) {
          main section > div > div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          main section > div > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}