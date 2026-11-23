// "AI Omer" chat status (Netlify Function, GET /api/chat/status?client=<browser id>).
//
// Called by the page before the visitor types, so every limitation is shown up
// front with a fixed message (no Groq call, no tokens). Also issues the signed
// token that /api/chat requires.
//
// Response: { state, token?, until?, resetAt?, retryAt?, near? }
//   state: "available" | "blocked" | "busy" | "quota" | "disabled"

import { validClientId, issueToken, hashId, chatEnabled, usageStatus, getVisitor } from "../chat/security.mjs";

function json(status, obj) {
    return new Response(JSON.stringify(obj), {
        status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
    });
}

export default async (request) => {
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
    const clientId = new URL(request.url).searchParams.get("client");
    if (!validClientId(clientId)) return json(400, { error: "bad-request" });

    const now = Date.now();
    if (!(await chatEnabled())) return json(200, { state: "disabled" });

    const visitor = await getVisitor(hashId("c", clientId));
    if (visitor.blockedUntil > now) return json(200, { state: "blocked", until: visitor.blockedUntil });

    const usage = await usageStatus(now);
    if (usage.quota) return json(200, { state: "quota", resetAt: usage.resetAt });

    const token = issueToken(clientId, now);
    if (visitor.cooldownUntil > now) return json(200, { state: "busy", retryAt: visitor.cooldownUntil, token });
    if (usage.busy) return json(200, { state: "busy", retryAt: usage.retryAt, token });
    return json(200, { state: "available", near: usage.near, token });
};

export const config = { path: "/api/chat/status" };
