export type SyllabusOutline = {
  modules: Array<{ name: string; topics: string[] }>;
};

function parseOutlineJson(raw: string): SyllabusOutline {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== "object" || !("modules" in parsed)) {
    throw new Error("Invalid syllabus JSON: missing modules");
  }
  const modules = (parsed as { modules: unknown }).modules;
  if (!Array.isArray(modules)) {
    throw new Error("Invalid syllabus JSON: modules must be an array");
  }
  const out: SyllabusOutline = { modules: [] };
  for (const m of modules) {
    if (!m || typeof m !== "object") continue;
    const name = String((m as { name?: unknown }).name ?? "").trim();
    if (!name) continue;
    const topicsRaw = (m as { topics?: unknown }).topics;
    const topics = Array.isArray(topicsRaw)
      ? topicsRaw.map((t) => String(t).trim()).filter(Boolean)
      : [];
    out.modules.push({ name, topics: topics.length ? topics : [name] });
  }
  if (out.modules.length === 0) {
    throw new Error("No modules extracted from image");
  }
  return out;
}

/**
 * Uses OpenAI vision to read a syllabus image and return structured modules + topics.
 * Expects a data URL (e.g. image/png;base64,...).
 */
export async function extractSyllabusFromImage(imageDataUrl: string): Promise<SyllabusOutline> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_OPENAI_API_KEY in environment");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are parsing an academic syllabus image (modules and topics).

Return ONLY valid JSON with this exact shape (no markdown fences):
{"modules":[{"name":"string","topics":["string",...]}]}

Rules:
- Each major section labeled Module-1, Module-2, Annexure, etc. becomes one entry in "modules".
- "name" should be a concise title (include Module-N or Annexure in the name when visible).
- "topics": split the syllabus content under that section into separate strings. Split on bullets, dashes (– or -), semicolons, or numbered items. Each topic is a short phrase preserving technical terms (e.g. Mohr's circle, Euler's formula).
- If a section is one dense paragraph, split into as many meaningful topics as possible.
- If a module truly has only one block, use a single topic string summarizing it.
- Omit empty modules. Do not add commentary outside JSON.`,
            },
            {
              type: "image_url",
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  };

  if (!res.ok) {
    throw new Error(data?.error?.message ?? `OpenAI error (${res.status})`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return parseOutlineJson(content);
}
