// Small BM25 keyword retriever over the knowledge chunks.
// Queries arrive in English (the classifier rewrites Hebrew/other questions
// into English search terms), so plain keyword matching is enough here and
// needs no embeddings service.

const STOP = new Set("a an the and or of to in on for with is are was were be been i you me my your it this that what which who how do does did can could would should about from at by as me tell please".split(" "));

function tokens(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function createRetriever(chunks) {
  const docs = chunks.map((c) => {
    const toks = tokens(`${c.title} ${c.title} ${c.text} ${c.keywords || ""}`);
    const tf = new Map();
    toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
    return { chunk: c, tf, len: toks.length };
  });
  const N = docs.length;
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / N;
  const df = new Map();
  docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const k1 = 1.4;
  const b = 0.75;

  return function search(query, k = 4) {
    const q = [...new Set(tokens(query))];
    const scored = docs.map((d) => {
      let score = 0;
      q.forEach((t) => {
        const f = d.tf.get(t);
        if (!f) return;
        const idf = Math.log(1 + (N - df.get(t) + 0.5) / (df.get(t) + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avgLen)));
      });
      return { chunk: d.chunk, score };
    });
    const top = scored.filter((s) => s.score > 0).sort((a, b2) => b2.score - a.score).slice(0, k);
    // The short profile chunk is always included for grounding.
    const always = docs.filter((d) => d.chunk.always && !top.some((t) => t.chunk === d.chunk));
    return [...always.map((d) => ({ chunk: d.chunk, score: 0 })), ...top];
  };
}
