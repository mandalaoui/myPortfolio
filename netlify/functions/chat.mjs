// "AI Omer" chat endpoint (Netlify Function, POST /api/chat).
//
// Pipeline per message:
//   1. Basic limits (message length, history size, per-IP rate limit).
//   2. Prompt-injection screen (Llama Prompt Guard 2 on Groq).
//   3. Classifier (gpt-oss-20b): language, intent, hiring interest, English search terms.
//   4. Suspicious / restricted / off-topic -> fixed polite reply (no free-form LLM text).
//   5. Otherwise: BM25 retrieval over the knowledge base -> answer streamed from gpt-oss-120b,
//      grounded only in the retrieved facts.
//   6. Every exchange is logged (Netlify Blobs in production, a local file in dev).
//
// Response: newline-delimited JSON events
//   {"t":"meta","state":"answer|suspicious|refuse","cta":bool,"sources":[{title,href}]}
//   {"t":"d","v":"text chunk"} ...
//   {"t":"end"}
//
// Secret: Groq API key in the environment variable `avatarApiKey`.

import { chunks } from "../chat/knowledge.mjs";
import { createRetriever } from "../chat/retrieval.mjs";
import { CLASSIFIER_PROMPT, ANSWER_PROMPT, reply } from "../chat/prompts.mjs";

const GROQ = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_ANSWER = process.env.CHAT_MODEL_ANSWER || "openai/gpt-oss-120b";
const MODEL_CLASSIFY = process.env.CHAT_MODEL_CLASSIFY || "openai/gpt-oss-20b";
const MODEL_GUARD = process.env.CHAT_MODEL_GUARD || "meta-llama/llama-prompt-guard-2-86m";

const MAX_MESSAGE = 500;      // characters per visitor message
const MAX_HISTORY = 6;        // previous messages sent along for context
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_MAX = 20;          // messages per IP per window (per function instance)

const search = createRetriever(chunks);
const hits = new Map();

function apiKey() {
  return process.env.avatarApiKey || "";
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_MAX;
}

function detectLanguage(text) {
  return /[֐-׿]/.test(text) ? "he" : "en";
}

async function groq(body) {
  const res = await fetch(GROQ, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

// Probability-like score (0..1) that the text is a prompt-injection / jailbreak.
async function injectionScore(text) {
  try {
    const res = await groq({ model: MODEL_GUARD, messages: [{ role: "user", content: text }] });
    const json = await res.json();
    const value = parseFloat(String(json.choices?.[0]?.message?.content || "").trim());
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0; // the classifier below still screens for manipulation
  }
}

async function classify(text) {
  const fallback = { language: detectLanguage(text), intent: "about", hiring_interest: false, search: text };
  try {
    const res = await groq({
      model: MODEL_CLASSIFY,
      messages: [
        { role: "system", content: CLASSIFIER_PROMPT },
        { role: "user", content: `<visitor>${text}</visitor>` }
      ],
      response_format: { type: "json_object" },
      reasoning_effort: "low",
      temperature: 0,
      max_completion_tokens: 400
    });
    const json = await res.json();
    const parsed = JSON.parse(json.choices?.[0]?.message?.content || "{}");
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

async function log(entry) {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("chat-logs");
    const key = `${entry.ts.slice(0, 10)}/${entry.ts}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, entry);
  } catch {
    // Local development: no Netlify Blobs -> the dev server provides a file logger.
    if (typeof globalThis.__chatLog === "function") globalThis.__chatLog(entry);
  }
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE * 2) }));
}

export default async (request, context) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const message = String(body?.message || "").trim().slice(0, MAX_MESSAGE);
  if (!message) return new Response("Bad request", { status: 400 });
  const history = cleanHistory(body?.history);
  const ip = context?.ip || request.headers.get("x-forwarded-for") || "local";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      const entry = { ts: new Date().toISOString(), message, history: history.length };
      let language = detectLanguage(message);

      const fixed = (kind, state, cta = true) => {
        const text = reply(kind, language);
        send({ t: "meta", state, cta, sources: [] });
        send({ t: "d", v: text });
        Object.assign(entry, { state, answer: text });
      };

      try {
        if (!apiKey()) throw new Error("Missing avatarApiKey");
        if (rateLimited(ip)) {
          fixed("limit", "refuse");
        } else {
          const [score, info] = await Promise.all([injectionScore(message), classify(message)]);
          language = info.language === "he" ? "he" : language;
          Object.assign(entry, { language, intent: info.intent, guard: score, hiring: !!info.hiring_interest });

          if (score > 0.8 || info.intent === "suspicious") {
            fixed("suspicious", "suspicious");
          } else if (info.intent === "restricted") {
            fixed("restricted", "refuse");
          } else if (info.intent === "off_topic") {
            fixed("off_topic", "refuse", false);
          } else {
            const found = search(`${info.search || ""} ${message}`, 4);
            const knowledge = found.map((f) => `[${f.chunk.title}] ${f.chunk.text}`).join("\n");
            const sources = [];
            // Source chips: only chunks that scored close to the best match.
            const best = Math.max(0, ...found.filter((f) => !f.chunk.always).map((f) => f.score));
            found.filter((f) => !f.chunk.always && f.score > 0 && f.score >= best * 0.6).forEach((f) => {
              if (!sources.some((s) => s.title === f.chunk.title)) sources.push({ title: f.chunk.title, href: f.chunk.href });
            });
            const cta = !!info.hiring_interest || ["services", "availability", "contact"].includes(info.intent);
            send({ t: "meta", state: "answer", cta, sources: sources.slice(0, 3) });

            const res = await groq({
              model: MODEL_ANSWER,
              stream: true,
              reasoning_effort: "low",
              temperature: 0.5,
              max_completion_tokens: 700,
              messages: [
                {
                  role: "system",
                  content: `${ANSWER_PROMPT}\n\nReply language: ${
                    language === "he" ? "Hebrew" : info.language === "other" ? "the visitor's language" : "English"
                  }.\n\n<knowledge>\n${knowledge}\n</knowledge>`
                },
                ...history.map((m) => ({ role: m.role, content: m.role === "user" ? `<visitor>${m.content}</visitor>` : m.content })),
                { role: "user", content: `<visitor>${message}</visitor>` }
              ]
            });

            let answer = "";
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            for (;;) {
              const { value, done } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop();
              for (const line of lines) {
                const data = line.replace(/^data:\s*/, "").trim();
                if (!data || data === "[DONE]") continue;
                try {
                  const delta = JSON.parse(data).choices?.[0]?.delta?.content;
                  if (delta) {
                    answer += delta;
                    send({ t: "d", v: delta });
                  }
                } catch { /* partial line */ }
              }
            }
            Object.assign(entry, { state: "answer", cta, sources: sources.map((s) => s.title), answer });
          }
        }
      } catch (err) {
        entry.error = String(err.message || err).slice(0, 300);
        fixed("error", "refuse");
      }

      send({ t: "end" });
      await log(entry);
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" }
  });
};

export const config = { path: "/api/chat" };
