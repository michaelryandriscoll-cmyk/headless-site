export const revalidate = 300;

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

const ALL_LOAN_PAGES_QUERY = `
  query AllLoanProgramPages {
    pages(where: { parent: "loan-programs" }, first: 100) {
      nodes {
        title
        uri
      }
    }
  }
`;

function normalizeHref(uri = "") {
  // Ensure it starts with "/" and has no trailing slash
  let href = uri.startsWith("/") ? uri : `/${uri}`;
  href = href.replace(/\/+$/, ""); // remove trailing slash
  return href;
}

export async function GET() {
  try {
    if (!WP_GRAPHQL_URL) {
      return Response.json({ programs: [] }, { status: 200 });
    }

    const res = await fetch(WP_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: ALL_LOAN_PAGES_QUERY }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return Response.json({ programs: [] }, { status: 200 });
    }

    const json = await res.json();
    const nodes = json?.data?.pages?.nodes || [];

    const programs = nodes
      .map((p) => {
        const uri = p?.uri || "";
        const slug = uri.split("/").filter(Boolean).pop();

        return {
          title: p?.title || "Loan Program",
          slug,
          uri,
          href: normalizeHref(uri),
        };
      })
      .filter((p) => {
        if (!p.slug) return false;

        // Must be a child of /loan-programs/
        return (
          typeof p.href === "string" &&
          p.href.startsWith("/loan-programs/") &&
          p.href !== "/loan-programs"
        );
      });

    return Response.json({ programs }, { status: 200 });
  } catch (err) {
    return Response.json({ programs: [] }, { status: 200 });
  }
}