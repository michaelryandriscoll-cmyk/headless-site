export const dynamic = "force-dynamic";

async function getPrivacyPage() {
  const res = await fetch(
    `${process.env.WP_API_URL}/pages?slug=sms-terms-conditions`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch privacy policy");
  }

  const data = await res.json();
  return data[0];
}

export default async function PrivacyPolicyPage() {
  const page = await getPrivacyPage();

  if (!page) {
    return (
      <main style={{ padding: "120px 20px", textAlign: "center" }}>
        <h1>Privacy Policy</h1>
        <p>Privacy policy not found.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "120px 20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
      <div
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </main>
  );
}