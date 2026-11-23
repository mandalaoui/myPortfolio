// Key-value storage for the chat: Netlify Blobs in production, an in-memory
// map in the local dev server (scripts/dev-server.mjs sets globalThis.__chatDev).
// Stores used: chat-logs, chat-blocks, chat-usage, chat-config, chat-reports.

const devStores = globalThis.__chatDevStores || (globalThis.__chatDevStores = new Map());

function devStore(name) {
    if (!devStores.has(name)) devStores.set(name, new Map());
    const map = devStores.get(name);
    return {
        async get(key, opts) {
            const raw = map.get(key);
            if (raw === undefined) return null;
            return opts && opts.type === "json" ? JSON.parse(raw) : raw;
        },
        async setJSON(key, value) { map.set(key, JSON.stringify(value)); },
        async delete(key) { map.delete(key); },
        async list(opts = {}) {
            const prefix = opts.prefix || "";
            return { blobs: [...map.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) };
        }
    };
}

let blobsModule;

export async function store(name) {
    if (globalThis.__chatDev) return devStore(name);
    if (blobsModule === undefined) {
        try { blobsModule = await import("@netlify/blobs"); } catch { blobsModule = null; }
    }
    if (!blobsModule) return devStore(name);
    return blobsModule.getStore({ name, consistency: "strong" });
}

export async function getJSON(storeName, key, fallback) {
    try {
        const s = await store(storeName);
        const value = await s.get(key, { type: "json" });
        return value == null ? fallback : value;
    } catch {
        return fallback;
    }
}

export async function setJSON(storeName, key, value) {
    try {
        const s = await store(storeName);
        await s.setJSON(key, value);
    } catch { /* storage problems must never break the chat */ }
}
