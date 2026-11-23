// Scheduled Netlify Function: every day, summarize yesterday's chat
// (UTC day, same as the chat-logs keys) into the Blobs store "chat-reports"
// under the key "<YYYY-MM-DD>", and print it to the function log.
// Read it in Netlify: Project → Blobs → chat-reports, or Logs → Functions.
// Runs only on Netlify (scheduled functions don't run in the local dev server).

import { store } from "../chat/store.mjs";
import { summarize, yesterday } from "../chat/report.mjs";

export default async () => {
    const day = yesterday();
    const logs = await store("chat-logs");
    const { blobs } = await logs.list({ prefix: `${day}/` });
    const entries = [];
    for (const { key } of blobs) {
        const entry = await logs.get(key, { type: "json" }).catch(() => null);
        if (entry) entries.push(entry);
    }

    const report = summarize(entries, day);
    await (await store("chat-reports")).setJSON(day, report);
    console.log(`chat report ${day}${report.alert ? " [CHECK]" : ""}: ${JSON.stringify(report)}`);
};

export const config = { schedule: "@daily" };
