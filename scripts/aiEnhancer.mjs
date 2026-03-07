// scripts/aiEnhancer.mjs
// LEVEL 3: Optional AI-assisted enhancement for intros and bestFor.
// - NO-OP unless AI_LEVEL3_ENABLED=1 and OPENAI_API_KEY is set.
// - Uses fetch + OpenAI-style chat completion endpoint.
// - You can swap this to any provider you like.

const AI_LEVEL3_ENABLED = process.env.AI_LEVEL3_ENABLED === "1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY;

async function callLLM({ system, user }) {
  if (!AI_LEVEL3_ENABLED || !OPENAI_API_KEY) {
    return null; // Level 3 disabled → gracefully do nothing
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // change if you prefer a different one
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      console.warn("[AI] Non-200 from LLM:", res.status, await res.text());
      return null;
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (err) {
    console.warn("[AI] Error calling LLM:", err.message);
    return null;
  }
}

// Enhance a single intro
export async function enhanceIntroWithAI(intro, context) {
  const { industry, city, state } = context || {};

  const system = `
You are a senior conversion-focused SEO copywriter.
You will receive a single intro paragraph for a local "business loans" page.

Goals:
- Keep the overall meaning and structure.
- Improve clarity, specificity, and persuasiveness.
- Keep it 1–2 sentences max, 110–230 characters.
- MUST mention the city and state.
- MUST feel natural and local-business oriented.
- No emojis, no exclamation spam.
`;

  const user = `
Current intro:
"${intro}"

Industry: ${industry}
Location: ${city}, ${state}

Rewrite this intro, one paragraph only.
Do NOT add a title or bullet list. Respond with just the rewritten intro text.
`;

  const result = await callLLM({ system, user });
  return result || intro; // fallback to original if AI fails / disabled
}

// Enhance bestFor list
export async function enhanceBestForWithAI(bestForList, context) {
  const { industry } = context || {};
  if (!Array.isArray(bestForList) || bestForList.length === 0) {
    return bestForList;
  }

  const system = `
You are a copywriter formatting "best for" bullet points for a business loan page.

Goals:
- Each item should be 4–10 words.
- Start with an action or clear outcome ("Financing X", "Covering Y costs").
- Be specific to the industry.
- Return items as a simple newline-separated list.
`;

  const user = `
Industry: ${industry}

Current "best for" bullets:
${bestForList.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Rewrite and improve these bullets following the rules.
Return ONLY the bullet phrases, one per line, no numbering.
`;

  const raw = await callLLM({ system, user });
  if (!raw) return bestForList;

  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // basic sanity fallback
  return lines.length ? lines : bestForList;
}

export { AI_LEVEL3_ENABLED };