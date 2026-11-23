// Abuse protection for the "AI Omer" chat (see SECURITY_PLAN.md).
//
//   Visitor identity   anonymous browser id (random, from localStorage) + IP.
//                      Both are stored only as keyed hashes (HMAC with CHAT_SECRET).
//   Strikes / blocks   3 suspicious messages in 24h -> warning at the 2nd, 24h block
//                      at the 3rd. A new browser from an IP that has an active block
//                      is blocked on its first suspicious message ("zero tolerance");
//                      normal visitors on that IP are not affected.
//   Usage quota        site-wide caps per hour and per day (no Groq call once hit).
//   Signed token       issued by /api/chat/status, bound to the browser id, valid 1h;
//                      required by /api/chat together with an allowed Origin.
//   Bot heuristics     honeypot field, message sent < 1s after the token was issued,
//                      the same message repeated more than 3 times in 10 minutes.
//   Kill switch        env CHAT_ENABLED=false, or chat-config/settings {"enabled":false}.
//   Output filter      answers that would contain secrets / internal prompt text are cut.

import crypto from "node:crypto";
import { getJSON, setJSON } from "./store.mjs";

const HOUR = 60 * 60 * 1000;

export const LIMITS = {
    strikesToBlock: 3,
    warnAt: 2,
    strikeWindowMs: 24 * HOUR,
    blockMs: 24 * HOUR,
    tokenTtlMs: HOUR,
    minDelayMs: 1000,
    dupMax: 3,
    dupWindowMs: 10 * 60 * 1000,
    dupCooldownMs: 60 * 1000,
    nearQuotaRatio: 0.9
};

export function dayLimit() { return Number(process.env.CHAT_DAY_LIMIT) || 300; }
export function hourLimit() { return Number(process.env.CHAT_HOUR_LIMIT) || 60; }

// CHAT_SECRET signs tokens and keys the hashes. Until it is set in Netlify, a
// key derived from the Groq key is used so the chat keeps working.
function secret() {
    return process.env.CHAT_SECRET || `fallback:${process.env.avatarApiKey || "dev"}`;
}

function hmac(text) {
    return crypto.createHmac("sha256", secret()).update(text).digest("base64url");
}

export function hashId(kind, value) {
    return hmac(`${kind}:${value}`).slice(0, 32);
}

export function validClientId(id) {
    return typeof id === "string" && /^[A-Za-z0-9-]{8,64}$/.test(id);
}

// ── Origin ───────────────────────────────────────────────────────────────
const SITE_ORIGIN = /^https:\/\/([a-z0-9-]+--)?omer-mandalaoui\.netlify\.app$/;   // site + deploy previews
const DEV_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function originAllowed(request) {
    const origin = request.headers.get("origin");
    if (!origin) return false;
    if (SITE_ORIGIN.test(origin)) return true;
    if (globalThis.__chatDev && DEV_ORIGIN.test(origin)) return true;
    const extra = (process.env.CHAT_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    return extra.includes(origin);
}

// ── Signed token ─────────────────────────────────────────────────────────
export function issueToken(clientId, now = Date.now()) {
    const body = `${clientId}.${now}`;
    return `${body}.${hmac(`tok:${body}`).slice(0, 32)}`;
}

// Returns the issue time if valid for this client, otherwise null.
export function verifyToken(token, clientId, now = Date.now()) {
    if (typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [id, iat, sig] = parts;
    if (id !== clientId) return null;
    const issued = Number(iat);
    if (!Number.isFinite(issued) || issued > now + 5000 || now - issued > LIMITS.tokenTtlMs) return null;
    const expected = hmac(`tok:${id}.${iat}`).slice(0, 32);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return issued;
}

// ── Kill switch ──────────────────────────────────────────────────────────
export async function chatEnabled() {
    if (String(process.env.CHAT_ENABLED || "").toLowerCase() === "false") return false;
    const settings = await getJSON("chat-config", "settings", null);
    return !(settings && settings.enabled === false);
}

// ── Usage quota (Israel time days/hours) ─────────────────────────────────
function israelParts(now) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date(now));
    return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

function periods(now) {
    const p = israelParts(now);
    const day = `${p.year}-${p.month}-${p.day}`;
    // Israel's UTC offset at this moment, to find the next Israeli midnight.
    const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    const offset = wall - Math.floor(now / 1000) * 1000;
    const nextMidnight = Date.UTC(+p.year, +p.month - 1, +p.day + 1) - offset;
    const nextHour = Math.floor(now / HOUR) * HOUR + HOUR;
    return { dayKey: `day/${day}`, hourKey: `hour/${day}T${p.hour}`, resetAt: nextMidnight, retryAt: nextHour };
}

export async function usageStatus(now = Date.now()) {
    const p = periods(now);
    const day = (await getJSON("chat-usage", p.dayKey, { count: 0 })).count || 0;
    const hour = (await getJSON("chat-usage", p.hourKey, { count: 0 })).count || 0;
    return {
        day, hour,
        quota: day >= dayLimit(),
        busy: hour >= hourLimit(),
        near: day >= dayLimit() * LIMITS.nearQuotaRatio,
        resetAt: p.resetAt,
        retryAt: p.retryAt
    };
}

export async function countUsage(now = Date.now()) {
    const p = periods(now);
    for (const key of [p.dayKey, p.hourKey]) {
        const value = await getJSON("chat-usage", key, { count: 0 });
        await setJSON("chat-usage", key, { count: (value.count || 0) + 1 });
    }
}

// ── Visitor records ──────────────────────────────────────────────────────
export async function getVisitor(clientHash) {
    return getJSON("chat-blocks", `c/${clientHash}`, { strikes: [], blockedUntil: 0, cooldownUntil: 0, dup: null });
}

export async function saveVisitor(clientHash, record) {
    await setJSON("chat-blocks", `c/${clientHash}`, record);
}

async function getIp(ipHash) {
    return getJSON("chat-blocks", `ip/${ipHash}`, { watchUntil: 0 });
}

// Records a suspicious message. Returns "strike" | "warning" | "blocked".
export async function addStrike(clientHash, ipHash, record, now = Date.now()) {
    const ip = await getIp(ipHash);
    const zeroTolerance = ip.watchUntil > now;
    record.strikes = (record.strikes || []).filter((t) => now - t < LIMITS.strikeWindowMs);
    record.strikes.push(now);
    let result = "strike";
    if (zeroTolerance || record.strikes.length >= LIMITS.strikesToBlock) {
        record.blockedUntil = now + LIMITS.blockMs;
        result = "blocked";
        await setJSON("chat-blocks", `ip/${ipHash}`, { watchUntil: now + LIMITS.blockMs });
    } else if (record.strikes.length >= LIMITS.warnAt) {
        result = "warning";
    }
    await saveVisitor(clientHash, record);
    return { result, zeroTolerance, until: record.blockedUntil };
}

// Same message repeated too often -> short cooldown. Mutates and saves the record.
export async function repeatedMessage(clientHash, record, message, now = Date.now()) {
    const h = crypto.createHash("sha256").update(message.trim().toLowerCase()).digest("base64url").slice(0, 16);
    if (record.dup && record.dup.h === h && now - record.dup.ts < LIMITS.dupWindowMs) {
        record.dup = { h, n: record.dup.n + 1, ts: now };
    } else {
        record.dup = { h, n: 1, ts: now };
    }
    const repeated = record.dup.n > LIMITS.dupMax;
    if (repeated) record.cooldownUntil = now + LIMITS.dupCooldownMs;
    await saveVisitor(clientHash, record);
    return repeated;
}

// ── Output filter ────────────────────────────────────────────────────────
const LEAK_PATTERNS = [
    /gsk_[A-Za-z0-9]{8,}/,
    /\bavatarApiKey\b/i,
    /\bCHAT_SECRET\b/i,
    /<\/?knowledge>/i,
    /these never change/i,
    /You are "AI Omer"/i,
    /Return ONLY a JSON object/i
];

export function leaksSecrets(text) {
    return LEAK_PATTERNS.some((re) => re.test(text));
}
