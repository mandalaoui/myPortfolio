// "AI Omer" chat endpoint (Netlify Function, POST /api/chat).
//
// Pipeline per message (cheap checks first; Groq is called only at the end):
//   1. Origin + signed token (from /api/chat/status, bound to the browser id).
//   2. Kill switch, active block, cooldown.
//   3. Bot heuristics: honeypot, too fast after the token, repeated message.
//   4. Site-wide quota (hour / day) -> fixed message, no Groq call.
//   5. Per-IP rate limit (in memory).
//   6. Prompt-injection screen (fixed patterns + Llama Prompt Guard 2) and classifier.
//   7. Suspicious -> strike (warning at 2, 24h block at 3; zero tolerance for a new
//      browser on an IP with an active block). Restricted / off-topic -> fixed reply.
//   8. Otherwise: BM25 retrieval -> grounded answer streamed from gpt-oss-120b,
//      passed through an output filter that stops anything secret-looking.
//   9. Every exchange is logged (Netlify Blobs; a local file in dev).
//
// Response: newline-delimited JSON events
//   {"t":"meta","state":"answer|suspicious|refuse|blocked|quota|busy|disabled", ...}
//   {"t":"d","v":"text chunk"} ...   {"t":"reset","v":"replacement text"}   {"t":"end"}
//
// Secrets: Groq key in `avatarApiKey`; `CHAT_SECRET` signs tokens and keys the hashes.

import { chunks } from "../chat/knowledge.mjs";
import { createRetriever } from "../chat/retrieval.mjs";
import { CLASSIFIER_PROMPT, ANSWER_PROMPT, reply } from "../chat/prompts.mjs";
import {
    originAllowed, validClientId, verifyToken, hashId, chatEnabled, usageStatus, countUsage,
    getVisitor, addStrike, repeatedMessage, leaksSecrets, LIMITS
} from "../chat/security.mjs";
import { store } from "../chat/store.mjs";

const GROQ = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_ANSWER = process.env.CHAT_MODEL_ANSWER || "openai/gpt-oss-120b";
const MODEL_CLASSIFY = process.env.CHAT_MODEL_CLASSIFY || "openai/gpt-oss-20b";
const MODEL_GUARD = process.env.CHAT_MODEL_GUARD || "meta-llama/llama-prompt-guard-2-86m";

const MAX_MESSAGE = 500;      // characters per visitor message
const MAX_HISTORY = 6;        // previous messages sent along for context
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_MAX = 20;          // messages per IP per window (per function instance)
const HOLD_BACK = 48;         // characters held back while streaming, for the output filter

const search = createRetriever(chunks);
const FEATURED_CHUNKS = chunks.filter((c) => c.featured);
// Project names, so a question naming a project is never filed as "off topic"
// (e.g. "Teacher Assistant AI" sounds like education to the classifier).
// Both spellings count: "teacher assistant ai" and "teacherassistantai".
const PROJECT_NAMES = chunks.filter((c) => c.id.startsWith("project-"))
    .flatMap((c) => { const t = c.title.toLowerCase(); return [t, t.replace(/\s+/g, "")]; });
function mentionsProject(text) {
    const t = text.toLowerCase();
    return PROJECT_NAMES.some((name) => t.includes(name));
}
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

// Deterministic screen for common instruction-override / jailbreak phrasing,
// in English and Hebrew. Prompt Guard scores Hebrew attempts low, and the
// classifier may file them as "off topic", so these always count as suspicious.
const OVERRIDE_PATTERNS = [
    /\b(ignore|disregard|forget|override|bypass)\b[^.!?\n]{0,30}\b(instructions?|rules?|prompts?|guidelines?|directions?)\b/i,
    /\b(system|developer|hidden|initial)\s+(prompt|message|instructions?)\b/i,
    /\b(you are now|from now on you|pretend (to be|you are)|act as|roleplay|role-play|jailbreak|developer mode)\b/i,
    /(שכח|תשכח|תשכחי|התעלם|תתעלם|תתעלמי|בטל|עקוף|תעקוף)[^.!?\n]{0,30}(הנחיות|הוראות|כללים|חוקים|הגדרות|פרומפט)/,
    /(הנחיות|הוראות)\s*(קודמות|המערכת|מערכת|הקודמות)/,
    /(אתה עכשיו|מעכשיו אתה|מעכשיו תהיה|תעמיד פנים|תעמידי פנים|תתנהג כמו|תתחזה)/,
    /(פרומפט|prompt)\s*(המערכת|מערכת|שלך)/i,
    // Trust / authority claims used to unlock information ("social engineering").
    /\b(trust me|you can trust me|i am (omer|the (developer|owner|admin|administrator))|i'm (omer|the (developer|owner|admin|administrator)))\b/i,
    /(אפשר לסמוך עליי|תוכל לסמוך עליי|יכול לסמוך עליי|תסמוך עליי|סמוך עליי|אני עומר|אני המפתח|אני הבעלים|אני המנהל|אני האדמין)/,
    // Fishing for secrets. Always: explicit secret names. Otherwise only when the
    // message asks to give/show/reveal one (so "what is a token in AI?" is fine).
    /\b(api[\s_-]?keys?|secret[\s_-]?keys?|access[\s_-]?tokens?|private[\s_-]?keys?|env(ironment)? var(iable)?s?|\.env|avatarApiKey)\b/i,
    /\b(groq|openai|netlify)\b[^.!?\n]{0,20}\b(keys?|tokens?|secrets?)\b/i,
    /\b(what|give|show|tell|share|reveal|send|print|leak)\b[^.!?\n]{0,25}\b(your|the|his|omer'?s)\s+(keys?|tokens?|passwords?|secrets?|credentials?)\b/i,
    /מפתח\s*(ה)?(סודי|גישה|הצפנה|api|ה-?api|ל-?groq|לגרוק|של\s*(groq|ה-?api|גרוק))/i,
    /(ה)?מפתח(ות)?\s*(ה)?סוד(י|יים)/,
    /(מה|תן|תני|תגיד|תגידי|תראה|תראי|שלח|תשלח|תחשוף|תחשפי|חשוף)[^.!?\n]{0,20}(ה)?(סיסמ[הא]|סיסמאות|טוקן|אישורי הגישה|משתני הסביבה|הסודות)/
];

function looksLikeOverride(text) {
    return OVERRIDE_PATTERNS.some((re) => re.test(text));
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
        return 0; // the patterns and the classifier still screen for manipulation
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
    if (globalThis.__chatDev) {
        if (typeof globalThis.__chatLog === "function") globalThis.__chatLog(entry);
        return;
    }
    try {
        const s = await store("chat-logs");
        const key = `${entry.ts.slice(0, 10)}/${entry.ts}-${Math.random().toString(36).slice(2, 8)}`;
        await s.setJSON(key, entry);
    } catch { /* logging must never break the chat */ }
}

function cleanHistory(history) {
    if (!Array.isArray(history)) return [];
    return history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE * 2) }));
}

function json(status, obj) {
    return new Response(JSON.stringify(obj), {
        status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
    });
}

export default async (request, context) => {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    if (!originAllowed(request)) return json(403, { error: "origin" });

    let body;
    try {
        body = await request.json();
    } catch {
        return json(400, { error: "bad-request" });
    }
    const message = String(body?.message || "").trim().slice(0, MAX_MESSAGE);
    const clientId = body?.client;
    if (!message || !validClientId(clientId)) return json(400, { error: "bad-request" });
    const now = Date.now();
    const issuedAt = verifyToken(body?.token, clientId, now);
    if (issuedAt === null) return json(401, { error: "token" });   // the page fetches a new token and retries

    const history = cleanHistory(body?.history);
    const ip = context?.ip || request.headers.get("x-nf-client-connection-ip") || request.headers.get("x-forwarded-for") || "local";
    const clientHash = hashId("c", clientId);
    const ipHash = hashId("ip", ip);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
            const entry = { ts: new Date(now).toISOString(), message, history: history.length, client: clientHash, ip: ipHash };
            let language = detectLanguage(message);

            const fixed = (kind, state, extra = {}) => {
                const text = reply(kind, language);
                send({ t: "meta", state, cta: true, sources: [], ...extra });
                send({ t: "d", v: text });
                Object.assign(entry, { state, answer: text }, extra);
            };

            try {
                if (!apiKey()) throw new Error("Missing avatarApiKey");
                const visitor = await getVisitor(clientHash);

                if (!(await chatEnabled())) {
                    fixed("disabled", "disabled");
                } else if (visitor.blockedUntil > now) {
                    fixed("blocked", "blocked", { until: visitor.blockedUntil });
                } else if (visitor.cooldownUntil > now) {
                    fixed("busy", "busy", { retryAt: visitor.cooldownUntil });
                } else if (typeof body?.hp === "string" && body.hp.trim() !== "") {
                    entry.bot = "honeypot";                 // silent: looks like a normal refusal
                    fixed("off_topic", "refuse");
                } else if (now - issuedAt < LIMITS.minDelayMs) {
                    entry.bot = "too-fast";
                    fixed("busy", "busy", { retryAt: now + 3000 });
                } else if (await repeatedMessage(clientHash, visitor, message, now)) {
                    entry.bot = "repeated";
                    fixed("busy", "busy", { retryAt: visitor.cooldownUntil });
                } else {
                    const usage = await usageStatus(now);
                    if (usage.quota) {
                        fixed("quota", "quota", { resetAt: usage.resetAt });
                    } else if (usage.busy) {
                        fixed("busy", "busy", { retryAt: usage.retryAt });
                    } else if (rateLimited(ip)) {
                        fixed("limit", "refuse");
                    } else {
                        await countUsage(now);
                        await answer({ send, fixed, entry, message, history, clientHash, ipHash, visitor, now,
                            near: usage.near,
                            setLanguage: (l) => { language = l; }, getLanguage: () => language });
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

// Classifies the message and streams the grounded answer (or a fixed reply).
async function answer({ send, fixed, entry, message, history, clientHash, ipHash, visitor, now, near, setLanguage, getLanguage }) {
    const [score, info] = await Promise.all([injectionScore(message), classify(message)]);
    if (info.language === "he") setLanguage("he");
    const language = getLanguage();
    if (info.intent === "off_topic" && mentionsProject(message)) info.intent = "projects";
    const override = looksLikeOverride(message);
    Object.assign(entry, { language, intent: info.intent, guard: score, override, hiring: !!info.hiring_interest });

    if (override || score > 0.8 || info.intent === "suspicious") {
        const strike = await addStrike(clientHash, ipHash, visitor, now);
        entry.strike = strike.result;
        if (strike.zeroTolerance) entry.zeroTolerance = true;
        if (strike.result === "blocked") {
            fixed("blocked", "blocked", { until: strike.until });
        } else {
            const text = strike.result === "warning"
                ? `${reply("suspicious", language)}\n\n${reply("warning", language)}`
                : reply("suspicious", language);
            send({ t: "meta", state: "suspicious", cta: true, sources: [], warning: strike.result === "warning" });
            send({ t: "d", v: text });
            Object.assign(entry, { state: "suspicious", answer: text });
        }
        return;
    }
    if (info.intent === "restricted") return fixed("restricted", "refuse");
    if (info.intent === "off_topic") return fixed("off_topic", "refuse", { cta: false });

    const found = search(`${info.search || ""} ${message}`, 4);
    // Questions about projects often name several of them; give the model the
    // real description of every featured project so it never has to guess.
    const context = [...found.map((f) => f.chunk)];
    if (info.intent === "projects") {
        FEATURED_CHUNKS.forEach((c) => { if (!context.includes(c)) context.push(c); });
    }
    const knowledge = context.map((c) => `[${c.title}] ${c.text}`).join("\n");
    const sources = [];
    // Source chips: only chunks that scored close to the best match.
    const best = Math.max(0, ...found.filter((f) => !f.chunk.always).map((f) => f.score));
    found.filter((f) => !f.chunk.always && f.score > 0 && f.score >= best * 0.6).forEach((f) => {
        if (!sources.some((s) => s.title === f.chunk.title)) sources.push({ title: f.chunk.title, href: f.chunk.href });
    });
    const cta = !!info.hiring_interest || ["services", "availability", "contact"].includes(info.intent);
    send({ t: "meta", state: "answer", cta, near: !!near, sources: sources.slice(0, 3) });

    const res = await groq({
        model: MODEL_ANSWER,
        stream: true,
        reasoning_effort: "low",
        temperature: 0.2,  // low: stick to the retrieved facts
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

    // Stream with a small hold-back so the output filter can stop a secret even
    // when it is split across chunks.
    let text = "";
    let sent = 0;
    let filtered = false;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    outer: for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
            const data = line.replace(/^data:\s*/, "").trim();
            if (!data || data === "[DONE]") continue;
            let delta;
            try { delta = JSON.parse(data).choices?.[0]?.delta?.content; } catch { continue; }
            if (!delta) continue;
            text += delta;
            if (leaksSecrets(text)) { filtered = true; break outer; }
            if (text.length - sent > HOLD_BACK) {
                send({ t: "d", v: text.slice(sent, text.length - HOLD_BACK) });
                sent = text.length - HOLD_BACK;
            }
        }
    }
    if (!filtered && leaksSecrets(text)) filtered = true;
    if (filtered) {
        try { await reader.cancel(); } catch { /* ignore */ }
        const safe = reply("filtered", language);
        send({ t: "reset", v: safe });
        Object.assign(entry, { state: "answer", filtered: true, answer: safe, blockedOutput: text.slice(0, 500) });
        return;
    }
    if (sent < text.length) send({ t: "d", v: text.slice(sent) });
    Object.assign(entry, { state: "answer", cta, sources: sources.map((s) => s.title), answer: text });
}

export const config = { path: "/api/chat" };
