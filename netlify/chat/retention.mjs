// Retention rules (promised in privacy.html), applied daily by
// netlify/functions/cleanup-chat-logs.mjs:
//   chat-logs     conversation records          -> deleted after RETENTION_DAYS
//   chat-reports  daily summaries (counts)       -> deleted after RETENTION_DAYS
//   chat-blocks   strikes / blocks / cooldowns   -> deleted once nothing in them is active
//   chat-usage    daily / hourly message counts  -> deleted after USAGE_DAYS
// Log keys look like "YYYY-MM-DD/<ISO timestamp>-<random>" (see chat.mjs),
// report keys "YYYY-MM-DD", usage keys "day/YYYY-MM-DD" and "hour/YYYY-MM-DDTHH".

import { LIMITS } from "./security.mjs";

export const RETENTION_DAYS = 365;
export const USAGE_DAYS = 2;
const DAY = 24 * 60 * 60 * 1000;

function cutoffDay(now, days) {
    return new Date(now.getTime() - days * DAY).toISOString().slice(0, 10);
}

function olderThan(keys, days, now, dayOf) {
    const cutoff = cutoffDay(now, days);
    return keys.filter((key) => {
        const day = dayOf(String(key));
        return /^\d{4}-\d{2}-\d{2}$/.test(day) && day < cutoff;
    });
}

// chat-logs and chat-reports: the key starts with the date.
export function expiredKeys(keys, now = new Date(), days = RETENTION_DAYS) {
    return olderThan(keys, days, now, (key) => key.slice(0, 10));
}

// chat-usage: "day/2026-11-21" or "hour/2026-11-21T14".
export function expiredUsageKeys(keys, now = new Date()) {
    return olderThan(keys, USAGE_DAYS, now, (key) => key.split("/")[1]?.slice(0, 10) || "");
}

// chat-blocks: a record can go once every block, cooldown, strike and
// repeat-counter in it has run out (about a day after the visitor's last event).
export function staleBlockRecord(record, now = Date.now()) {
    if (!record || typeof record !== "object") return true;
    const lastStrike = Math.max(0, ...(record.strikes || []));
    const activeUntil = Math.max(
        record.blockedUntil || 0,
        record.cooldownUntil || 0,
        record.watchUntil || 0,
        lastStrike ? lastStrike + LIMITS.strikeWindowMs : 0,
        record.dup?.ts ? record.dup.ts + LIMITS.dupWindowMs : 0
    );
    return activeUntil < now;
}
