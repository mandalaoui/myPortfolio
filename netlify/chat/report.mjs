// Daily chat summary (SECURITY_PLAN.md 3.4): turns one day of chat-logs
// entries into counts, so abuse shows up without reading every log.
// Pure function, used by netlify/functions/chat-daily-report.mjs.

const inc = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };

export function summarize(entries, day) {
    const report = {
        day,
        total: entries.length,
        visitors: new Set(entries.map((e) => e.client).filter(Boolean)).size,
        networks: new Set(entries.map((e) => e.ip).filter(Boolean)).size,
        states: {},      // answer / suspicious / refuse / quota / busy / blocked / disabled
        intents: {},
        languages: {},
        strikes: {},     // strike / warning / blocked
        bots: {},        // honeypot / too-fast / repeated
        zeroTolerance: 0,
        filtered: 0,     // answers stopped by the output leak filter
        errors: 0,
        hiring: 0,
        topSuspicious: []
    };
    const suspiciousBy = {};

    for (const e of entries) {
        inc(report.states, e.state || "unknown");
        if (e.intent) inc(report.intents, e.intent);
        if (e.language) inc(report.languages, e.language);
        if (e.strike) inc(report.strikes, e.strike);
        if (e.bot) inc(report.bots, e.bot);
        if (e.zeroTolerance) report.zeroTolerance++;
        if (e.filtered) report.filtered++;
        if (e.error) report.errors++;
        if (e.hiring) report.hiring++;
        if (e.state === "suspicious" && e.client) inc(suspiciousBy, e.client);
    }

    // Hashed browser IDs with the most manipulation attempts (no raw IDs exist).
    report.topSuspicious = Object.entries(suspiciousBy)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([client, count]) => ({ client: client.slice(0, 12), count }));

    // Anything that deserves a look.
    report.alert = report.filtered > 0 || report.errors > 5 || (report.strikes.blocked || 0) > 0
        || (report.states.quota || 0) > 0 || Object.keys(report.bots).length > 0;
    return report;
}

export function yesterday(now = new Date()) {
    return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
