// Local dev server: serves the static site and runs the chat functions like
// Netlify does in production. No dependencies.
//   node scripts/dev-server.mjs   (or: npm run dev)   -> http://localhost:5174
//
// - Reads secrets from .env.local (avatarApiKey, CHAT_SECRET).
// - /api/chat and /api/chat/status run netlify/functions/*.mjs.
// - Storage is in memory (netlify/chat/store.mjs); chat logs go to
//   logs/chat-log.jsonl (git-ignored).
// - Applies the headers from _headers, like Netlify (to test the CSP).
// - Dev-only helpers for testing states (never deployed):
//     GET  /__dev/state?store=chat-usage            -> all keys/values of a store
//     POST /__dev/state  {store, key, value}         -> set a value (value null deletes)
//     POST /__dev/reset                              -> clear all stores
//     GET  /__dev/client-key?client=<id>             -> storage key of a browser id
//   A request header `x-dev-ip` overrides the client IP (simulate another network).

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// `npm run dev -- --dist` serves the production build (dist/, from `npm run build`).
const siteRoot = process.argv.includes("--dist") ? path.join(root, "dist") : root;
const PORT = Number(process.env.PORT || 5174);

for (const file of [".env.local", ".env"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
}

globalThis.__chatDev = true;
fs.mkdirSync(path.join(root, "logs"), { recursive: true });
globalThis.__chatLog = (entry) =>
    fs.appendFileSync(path.join(root, "logs", "chat-log.jsonl"), JSON.stringify(entry) + "\n");

const fn = async (name) => (await import(pathToFileURL(path.join(root, "netlify/functions", name)).href)).default;
const chat = await fn("chat.mjs");
const chatStatus = await fn("chat-status.mjs");

// _headers -> headers for a path, like Netlify: every block whose path
// pattern matches (* = any characters) adds its headers. Cache-Control is
// skipped locally (no-cache instead), so edits show up on reload.
function siteHeaders(pathname) {
    const p = path.join(siteRoot, "_headers");
    if (!fs.existsSync(p)) return [];
    const out = [];
    let matches = false;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
        if (!line.trim() || line.trim().startsWith("#")) continue;
        if (!/^\s/.test(line)) {
            const pattern = line.trim().replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
            matches = new RegExp(`^${pattern}$`).test(pathname);
            continue;
        }
        const m = line.trim().match(/^([A-Za-z-]+):\s*(.*)$/);
        if (matches && m && m[1].toLowerCase() !== "cache-control") out.push([m[1], m[2]]);
    }
    out.push(["Cache-Control", "no-cache"]);
    return out;
}

const TYPES = {
    ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
    ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".webp": "image/webp", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".mp4": "video/mp4", ".glb": "model/gltf-binary"
};

async function readBody(req) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return Buffer.concat(chunks);
}

async function runFunction(handler, req, res, url) {
    const body = req.method === "POST" ? await readBody(req) : undefined;
    const request = new Request(url, { method: req.method, headers: req.headers, body });
    const ip = req.headers["x-dev-ip"] || req.socket.remoteAddress;
    const response = await handler(request, { ip });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) for await (const c of response.body) res.write(c);
    res.end();
}

http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    try {
        if (url.pathname === "/api/chat") return await runFunction(chat, req, res, url);
        if (url.pathname === "/api/chat/status") return await runFunction(chatStatus, req, res, url);

        if (url.pathname.startsWith("/__dev/")) {
            const stores = globalThis.__chatDevStores || new Map();
            res.setHeader("Content-Type", "application/json");
            if (url.pathname === "/__dev/reset" && req.method === "POST") {
                stores.forEach((m) => m.clear());
                return res.end('{"ok":true}');
            }
            if (url.pathname === "/__dev/client-key" && req.method === "GET") {
                const { hashId } = await import(pathToFileURL(path.join(root, "netlify/chat/security.mjs")).href);
                return res.end(JSON.stringify({ key: `c/${hashId("c", url.searchParams.get("client") || "")}` }));
            }
            if (url.pathname === "/__dev/state" && req.method === "GET") {
                const m = stores.get(url.searchParams.get("store")) || new Map();
                return res.end(JSON.stringify(Object.fromEntries([...m].map(([k, v]) => [k, JSON.parse(v)]))));
            }
            if (url.pathname === "/__dev/state" && req.method === "POST") {
                const { store: name, key, value } = JSON.parse((await readBody(req)).toString() || "{}");
                if (!stores.has(name)) stores.set(name, new Map());
                if (value === null) stores.get(name).delete(key); else stores.get(name).set(key, JSON.stringify(value));
                return res.end('{"ok":true}');
            }
            res.writeHead(404);
            return res.end("{}");
        }

        let file = path.normalize(path.join(siteRoot, decodeURIComponent(url.pathname)));
        if (!file.startsWith(siteRoot)) { res.writeHead(403); return res.end(); }
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
        if (!fs.existsSync(file)) { res.writeHead(404); return res.end("Not found"); }
        const headers = { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" };
        for (const [k, v] of siteHeaders(url.pathname)) headers[k] = v;
        // Byte ranges (like Netlify): browsers need them to seek in <video>.
        const size = fs.statSync(file).size;
        headers["Accept-Ranges"] = "bytes";
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
        if (range && (range[1] || range[2])) {
            let start = range[1] ? Number(range[1]) : size - Number(range[2]);
            let end = range[1] && range[2] ? Number(range[2]) : size - 1;
            start = Math.max(0, start);
            end = Math.min(end, size - 1);
            if (start > end) {
                res.writeHead(416, { "Content-Range": `bytes */${size}` });
                return res.end();
            }
            headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
            headers["Content-Length"] = end - start + 1;
            res.writeHead(206, headers);
            return fs.createReadStream(file, { start, end }).pipe(res);
        }
        headers["Content-Length"] = size;
        res.writeHead(200, headers);
        fs.createReadStream(file).pipe(res);
    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.writeHead(500);
        res.end("Server error");
    }
}).listen(PORT, () => console.log(`Dev server: http://localhost:${PORT}${siteRoot === root ? "" : "  (serving dist/)"}`));
