// Scheduled Netlify Function: once a day, delete chat data that is past its
// retention period (rules in netlify/chat/retention.mjs, promised in privacy.html).
// Runs only on Netlify (scheduled functions don't run in the local dev server).

import { store } from "../chat/store.mjs";
import { expiredKeys, expiredUsageKeys, staleBlockRecord, RETENTION_DAYS } from "../chat/retention.mjs";

async function remove(storeName, pickKeys) {
    const s = await store(storeName);
    const { blobs } = await s.list();
    const keys = await pickKeys(s, blobs.map((b) => b.key));
    for (const key of keys) await s.delete(key);
    return `${storeName}: ${keys.length} of ${blobs.length} deleted`;
}

export default async () => {
    const now = new Date();
    const results = [
        await remove("chat-logs", async (s, keys) => expiredKeys(keys, now)),
        await remove("chat-reports", async (s, keys) => expiredKeys(keys, now)),
        await remove("chat-usage", async (s, keys) => expiredUsageKeys(keys, now)),
        await remove("chat-blocks", async (s, keys) => {
            const stale = [];
            for (const key of keys) {
                const record = await s.get(key, { type: "json" }).catch(() => null);
                if (staleBlockRecord(record, now.getTime())) stale.push(key);
            }
            return stale;
        })
    ];
    console.log(`chat cleanup (logs/reports kept ${RETENTION_DAYS} days): ${results.join("; ")}`);
};

export const config = { schedule: "@daily" };
