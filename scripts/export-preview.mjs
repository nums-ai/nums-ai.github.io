import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";

// Run after `npm run build`. Package the rendered routes without a Next server.
const root = process.cwd();
const blogPosts = JSON.parse(await readFile(join(root, "src/components/blog/posts.json"), "utf8"));
const routes = ["/", "/use-cases/", "/blog/", ...blogPosts.map(post => `/blog/${post.slug}/`), "/careers/", "/careers/en/"];
const stylesheets = new Set();
const assetCache = new Map();
const pages = {};
const mimeTypes = { ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon" };

async function embedAsset(path) {
  if (!assetCache.has(path)) {
    const bytes = await readFile(join(root, "out", path.split("?")[0]));
    assetCache.set(path, `data:${mimeTypes[extname(path)] ?? "application/octet-stream"};base64,${bytes.toString("base64")}`);
  }
  return assetCache.get(path);
}

async function inlineImages(html) {
  for (const match of html.matchAll(/src="(\/[^" ]+)"/g)) {
    html = html.replaceAll(`src="${match[1]}"`, `src="${await embedAsset(match[1])}"`);
  }
  return html;
}

for (const route of routes) {
  const html = await readFile(join(root, "out", route, "index.html"), "utf8");
  for (const match of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
    const href = match[0].match(/href="([^"]+)"/)?.[1];
    if (href) stylesheets.add(href);
  }
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1];
  if (!body) throw new Error(`Missing body for ${route}`);
  pages[route] = {
    title: html.match(/<title>(.*?)<\/title>/)?.[1] ?? "Nums AI",
    lang: "en",
    body: await inlineImages(body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")),
  };
}

let css = "";
for (const path of stylesheets) css += await readFile(join(root, "out", path), "utf8");
for (const match of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) {
  css = css.replaceAll(match[0], `url("${await embedAsset(match[1])}")`);
}

const explorerController = (await readFile(join(root, "src/components/use-cases/explorer-controller.js"), "utf8")).replace("export function initUseCases", "function initUseCases");
const eloController = (await readFile(join(root, "src/components/homepage/elo-chart-controller.js"), "utf8")).replace("export function initEloChart", "function initEloChart");
const pythonController = (await readFile(join(root, "src/components/homepage/python-quick-start-controller.js"), "utf8")).replace("export function initPythonQuickStart", "function initPythonQuickStart");
const careersController = (await readFile(join(root, "src/app/careers/outline-controller.js"), "utf8")).replace("export function initCareersOutline", "function initCareersOutline");
const script = explorerController + "\n" + eloController + "\n" + pythonController + "\n" + careersController + String.raw`
const pages = JSON.parse(document.getElementById("preview-pages").textContent);
const root = document.getElementById("preview-root");
let currentRoute = "/";
let cleanupExplorer = () => {};
let cleanupElo = () => {};
let cleanupPython = () => {};
let cleanupCareers = () => {};

function render() {
  const requested = location.hash.startsWith("#/") ? location.hash.slice(1) : "/";
  const url = new URL(requested, "https://preview.nums.invalid");
  const route = pages[url.pathname] ? url.pathname : "/";
  const page = pages[route];
  const pageKey = route + url.search;
  if (root.dataset.route !== pageKey) {
    cleanupExplorer();
    cleanupElo();
    cleanupPython();
    cleanupCareers();
    root.innerHTML = page.body;
    root.dataset.route = pageKey;
    cleanupExplorer = initUseCases(root.querySelector("[data-use-cases]"), url.searchParams.get("domain") ?? "", url.searchParams.get("dataset") ?? "");
    cleanupElo = initEloChart(root.querySelector("[data-elo-chart]"));
    cleanupPython = initPythonQuickStart(root.querySelector("[data-python-quick-start]"));
    cleanupCareers = initCareersOutline(root.querySelector("[data-careers]"));
  }
  document.documentElement.lang = page.lang;
  document.title = page.title + " · Homepage draft";
  currentRoute = pageKey;
  requestAnimationFrame(() => {
    if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({behavior:"instant"});
    else window.scrollTo({top:0, behavior:"instant"});
  });
}

document.addEventListener("click", event => {
  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const href = link.getAttribute("href");
  if (!href.startsWith("/") && !href.startsWith("#")) return;
  const target = href.startsWith("#") ? currentRoute + href : href;
  const url = new URL(target, "https://preview.nums.invalid");
  if (!pages[url.pathname]) return;
  event.preventDefault();
  document.querySelectorAll("[data-preview-menu][open]").forEach(menu => menu.open = false);
  if (location.hash === "#" + target) render();
  else location.hash = target;
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") document.querySelectorAll("[data-preview-menu][open]").forEach(menu => {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  });
});

document.addEventListener("pointerdown", event => {
  document.querySelectorAll("[data-preview-menu][open]").forEach(menu => {
    if (!menu.contains(event.target)) menu.open = false;
  });
});
window.addEventListener("hashchange", render);
render();
`;

const output = `<!DOCTYPE html>
<html lang="en" data-scroll-behavior="smooth"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Nums AI · Homepage draft</title><style>${css}</style></head><body><div id="preview-root" data-route="">${pages["/"].body}</div><script type="application/json" id="preview-pages">${JSON.stringify(pages).replaceAll("<", "\\u003c")}</script><script>${script}</script></body></html>`;

await mkdir(join(root, "artifacts"), { recursive: true });
const destinations = ["artifacts/nums-ai.html", "artifacts/nums-homepage-preview.html", "out/preview.html"];
await Promise.all(destinations.map(destination => writeFile(join(root, destination), output)));
console.log(`Created ${destinations.join(", ")} (${Math.round(Buffer.byteLength(output) / 1024)} KB each).`);
