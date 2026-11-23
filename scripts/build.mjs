// Production build: copies the site into dist/ (what Netlify publishes, see
// netlify.toml) with comments removed and HTML/CSS/JS minified. The source
// files keep their comments; `npm run dev` keeps serving the source.
//
//   npm run build            -> dist/
//   npm run dev -- --dist    -> serve dist/ locally to check it
//
// Only the public site is copied: no server code (netlify/ is bundled by
// Netlify separately), no scripts, docs, logs or image originals (src/).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import { minify as minifyHtml } from "html-minifier-terser";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

// What gets published (relative to the project root).
const INCLUDE = [
    "index.html", "privacy.html", "terms.html", "accessibility.html",
    "_headers", "favicon.ico", "laptop.glb", "Omer_Mandalaoui_CV.pdf",
    "assets", "images", "videos"
];
// Never published, wherever they are.
const SKIP_DIRS = new Set(["src"]);          // image originals (images/src, images/avatar/src)
const SKIP_FILES = new Set(["desktop.ini", ".DS_Store", "Thumbs.db"]);

const HTML_OPTIONS = {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,               // keep one space where there was whitespace (inline text)
    removeRedundantAttributes: false,
    keepClosingSlash: true,
    minifyCSS: false,                         // no inline <style>/<script> on this site (CSP)
    minifyJS: false
};

const stats = { html: [0, 0], css: [0, 0], js: [0, 0], copied: 0 };

async function processFile(src, dest) {
    const ext = path.extname(src).toLowerCase();
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (ext === ".html" || ext === ".css" || ext === ".js") {
        const input = fs.readFileSync(src, "utf8");
        let output;
        if (ext === ".html") {
            output = await minifyHtml(input, HTML_OPTIONS);
        } else {
            // Per-file minify (no bundling): import paths, ?v= versions and
            // top-level globals of classic scripts stay exactly as they are.
            const result = await transform(input, {
                loader: ext.slice(1),
                minify: true,
                legalComments: "none",
                target: ext === ".css" ? ["chrome100", "safari15", "firefox100"] : "es2020"
            });
            output = result.code;
        }
        fs.writeFileSync(dest, output);
        const key = ext.slice(1);
        stats[key][0] += Buffer.byteLength(input);
        stats[key][1] += Buffer.byteLength(output);
        return;
    }
    fs.copyFileSync(src, dest);
    stats.copied++;
}

async function walk(rel) {
    const src = path.join(root, rel);
    if (!fs.existsSync(src)) return;
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (SKIP_DIRS.has(path.basename(src))) return;
        for (const name of fs.readdirSync(src)) await walk(path.join(rel, name));
        return;
    }
    if (SKIP_FILES.has(path.basename(src))) return;
    await processFile(src, path.join(dist, rel));
}

fs.rmSync(dist, { recursive: true, force: true });
for (const item of INCLUDE) await walk(item);

const kb = (n) => `${Math.round(n / 1024)}KB`;
for (const key of ["html", "css", "js"]) {
    const [before, after] = stats[key];
    console.log(`${key.padEnd(4)} ${kb(before)} -> ${kb(after)}`);
}
console.log(`copied ${stats.copied} other files -> dist/`);
