// app/lib/wpApi.js

const WP_API_BASE = "https://smallbusiness.capital/wp-json/wp/v2";
const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL;

/* =========================
   REST FETCH (unchanged)
========================= */
export async function wpFetch(endpoint) {
  const url = `${WP_API_BASE}/${endpoint.replace(/^\//, "")}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("WP REST error", res.status, url);
    return null;
  }

  return res.json();
}

/* =========================
   GRAPHQL FETCH (NEW)
========================= */
export async function wpGraphQLFetch(query, variables = {}) {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const json = await res.json();

  if (json.errors) {
    console.error("WPGraphQL error", json.errors);
    throw new Error("WPGraphQL request failed");
  }

  return json.data;
}