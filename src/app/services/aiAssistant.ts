type AskMode = "explain" | "research";

type AskTopicInput = {
  topicName: string;
  mode: AskMode;
  userPrompt: string;
  context: {
    notes: Array<{ title: string; content: string }>;
    resources: Array<{ title: string; description: string; url: string }>;
    videos: Array<{ title: string; description: string; url: string }>;
    textbooks: Array<{ title: string; fileName?: string; url?: string }>;
  };
};

type AskTopicResult = {
  answer: string;
  provider: "gemini" | "groq";
  usedFallback: boolean;
};

function summarizeContext(input: AskTopicInput["context"]) {
  const notes = input.notes.slice(0, 3).map((n) => `${n.title}: ${n.content.slice(0, 180)}`);
  const resources = input.resources.slice(0, 4).map((r) => `${r.title} - ${r.description}`);
  const videos = input.videos.slice(0, 4).map((v) => `${v.title} - ${v.description}`);
  const textbooks = input.textbooks.slice(0, 4).map((t) => `${t.title}${t.fileName ? ` (${t.fileName})` : ""}`);

  return [
    `Notes: ${notes.join(" | ") || "None"}`,
    `Online resources: ${resources.join(" | ") || "None"}`,
    `Videos: ${videos.join(" | ") || "None"}`,
    `Textbooks: ${textbooks.join(" | ") || "None"}`,
  ].join("\n");
}

function buildPrompt(input: AskTopicInput) {
  const taskLine =
    input.mode === "research"
      ? "Do concise research-oriented guidance and next steps."
      : "Explain this topic in simple student-friendly form.";

  return `
You are PES-PAL, the cute study bot for PESITM students.
User selected topic: "${input.topicName}".
${taskLine}

Rules:
- ONLY answer if the user request is related to the selected topic.
- If unrelated, respond: "- Please ask a question related to ${input.topicName}."
- Keep answer in bullet points only.
- Keep total response under 500 characters.
- For math-related questions, prefer equations/expressions and compact derivation bullets.
- If platform usage seems high, add one bullet advising deeper research on ChatGPT.

Student request: "${input.userPrompt}"

Available context:
${summarizeContext(input.context)}
`.trim();
}

function clampAnswer(answer: string) {
  const oneLineBullets = answer
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("-") ? line : `- ${line}`))
    .join("\n");

  const trimmed = oneLineBullets.slice(0, 500);
  return trimmed || "- I could not generate a response right now. Please try again.";
}

async function askGemini(prompt: string): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error("Missing Gemini API key");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${encodeURIComponent(
      key,
    )}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 220,
        },
      }),
    },
  );

  const payload = (await res.json()) as any;
  if (!res.ok) {
    const msg = payload?.error?.message || "Gemini request failed";
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function askGroq(prompt: string): Promise<string> {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error("Missing Groq API key");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 220,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const payload = (await res.json()) as any;
  if (!res.ok) {
    const msg = payload?.error?.message || "Groq request failed";
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return payload?.choices?.[0]?.message?.content ?? "";
}

export async function askTopicAssistant(input: AskTopicInput): Promise<AskTopicResult> {
  const prompt = buildPrompt(input);

  try {
    const text = await askGemini(prompt);
    return {
      answer: clampAnswer(text),
      provider: "gemini",
      usedFallback: false,
    };
  } catch {
    // Fallback for any Gemini failure (model unavailable, quota, rate-limit, etc.)
    const groqText = await askGroq(prompt);
    const answer = clampAnswer(
      `${groqText}\n- Usage may be high right now. Do deeper research on ChatGPT for extended detail.`,
    );
    return {
      answer,
      provider: "groq",
      usedFallback: true,
    };
  }
}

