// app/blog/[slug]/page.js
import "@/app/styles/blog.css";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 300;

function stripHtml(html = "") {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

/**
 * Fetch one WP post by slug
 */
async function getPostBySlug(slug) {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;

  if (!base) {
    console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
    return null;
  }

  const res = await fetch(
    `${base}/wp/v2/posts?slug=${slug}&_fields=id,slug,title,content,excerpt,date,featured_media`,
    { next: { revalidate } }
  );

  if (!res.ok) return null;

  const posts = await res.json();
  if (!posts?.length) return null;

  return posts[0];
}

/**
 * Fetch featured media object by ID
 */
async function getMediaById(id) {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;

  if (!base || !id) return null;

  try {
    const res = await fetch(`${base}/wp/v2/media/${id}`, {
      next: { revalidate },
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Extract featured image URL (media endpoint)
 */
function getFeaturedImageFromMedia(media, postTitle = "") {
  const url =
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    media?.source_url ||
    "";

  const alt =
    media?.alt_text || stripHtml(postTitle) || "Blog featured image";

  return { url, alt };
}

/**
 * Get all slugs for SSG
 */
async function getAllPostSlugs() {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE;

  if (!base) {
    console.warn("Missing NEXT_PUBLIC_WP_API_BASE");
    return [];
  }

  const res = await fetch(`${base}/wp/v2/posts?per_page=100&_fields=slug`, {
    next: { revalidate },
  });

  if (!res.ok) return [];

  const posts = await res.json();
  return (considered(posts) || [])
    .map((p) => p?.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

// helper to ensure array
function considered(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * Static params
 */
export async function generateStaticParams() {
  return await getAllPostSlugs();
}

/**
 * SEO metadata
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Blog",
      description: "This blog post does not exist.",
    };
  }

  const title = stripHtml(post.title?.rendered || "Blog Post");
  const description =
    stripHtml(post.excerpt?.rendered || "").slice(0, 155) ||
    "Read the latest business funding insights from Small Business Capital.";

  return {
    title: `${title} | Small Business Capital`,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

/**
 * Page
 */
export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <main className="blog-page">
        <div className="blog-container blog-post-container">
          <header className="blog-post-header">
            <h1>Post not found</h1>
            <p>This blog post doesn’t exist yet (or the slug is incorrect).</p>

            <div style={{ marginTop: "18px" }}>
              <Link href="/blog" className="blog-back-link">
                ← Back to Blog
              </Link>
            </div>
          </header>
        </div>
      </main>
    );
  }

  const title = post.title?.rendered || "Blog Post";
  const dateLabel = post.date ? new Date(post.date).toLocaleDateString() : "";

  // ✅ Featured image fallback: fetch media by ID
  const featuredId = post?.featured_media || 0;
  const media = featuredId ? await getMediaById(featuredId) : null;
  const { url: featuredUrl, alt: featuredAlt } = getFeaturedImageFromMedia(
    media,
    title
  );

  return (
    <main className="blog-page">
      <article className="blog-container blog-post-container">
        {/* Back link */}
        <div className="blog-post-back">
          <Link href="/blog" className="blog-back-link">
            ← Back to Blog
          </Link>
        </div>

        {/* Featured Image */}
        {featuredUrl ? (
          <div className="blog-post-featured">
            <img src={featuredUrl} alt={featuredAlt} loading="lazy" />
          </div>
        ) : null}

        {/* Title */}
        <header className="blog-post-header">
          <div className="blog-post-meta">{dateLabel}</div>
          <h1 dangerouslySetInnerHTML={{ __html: title }} />
        </header>

        {/* Content */}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
        />

        {/* Footer CTA */}
        <div className="blog-post-cta">
          <h3>Need business funding?</h3>
          <p>Apply once and compare options that fit your business.</p>

          <Link href="/apply" className="blog-post-cta-btn">
            Apply Now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </main>
  );
}