#!/usr/bin/env node
// Regenerates src/app/url.csv from the live backend sitemap API, so the
// "indexed URL" check (/api/indexed-url/, and [[...slug]]/page.tsx's own
// copy of the same check) stays in sync with real inventory instead of
// drifting from a stale one-off snapshot. Run on a schedule via
// .github/workflows/regenerate-url-csv.yml — this script itself has no
// server to talk to at cron time, so it hits the WordPress API directly
// (the same one NEXT_PUBLIC_MFS_API_BASE points the running app at),
// not the Next.js /*-sitemap.xml routes.
//
// Deliberately excludes: general-sitemap.xml (static pages, no product
// data), listings-sitemap.xml (individual /product/ pages — explicitly
// excluded from url.csv), and blogs-sitemap.xml (WordPress posts, not
// part of this API).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "src", "app", "url.csv");

const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.campervansforsale.au";

if (!API_BASE) {
  console.error("NEXT_PUBLIC_MFS_API_BASE is not set — aborting.");
  process.exit(1);
}

// Every /sitemap/{type} the backend exposes that url.csv should track —
// mirrors src/lib/sitemapApi.ts's fetchSitemapPaths, called directly here
// since there's no running Next.js server for this script to call into.
const API_TYPES = [
  "states", "regions", "makes", "models", "vehicle-makes",
  "state-make", "region-make", "state-vehicle-make", "region-vehicle-make",
  "length", "gvm", "price",
];

async function fetchType(type) {
  try {
    const res = await fetch(`${API_BASE}/sitemap/${type}?min_count=1&bust_cache=0`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) {
      console.warn(`[${type}] HTTP ${res.status} — skipping`);
      return [];
    }
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const json = JSON.parse(idx > 0 ? raw.slice(idx) : raw);
    return Array.isArray(json?.paths) ? json.paths : [];
  } catch (err) {
    console.warn(`[${type}] fetch failed — skipping:`, err.message);
    return [];
  }
}

// attributes-others-sitemap.xml's paths aren't from the API at all (the
// backend has no "sleep" grouping) — kept in exact sync with that route's
// own PRICE_PATHS/GVM_PATHS/LENGTH_PATHS/SLEEP_PATHS/STATE_SLUGS constants,
// including the `query` used to live-check each one (no dedicated
// exists-check endpoint on the backend — product_exists_check 404s — so
// /pool&per_page=1 is the count source, same as that route uses).
const PRICE_PATHS = [
  { path: "under-100000/",          query: "to_price=100000" },
  { path: "between-100000-150000/", query: "from_price=100000&to_price=150000" },
  { path: "between-150000-200000/", query: "from_price=150000&to_price=200000" },
  { path: "between-200000-300000/", query: "from_price=200000&to_price=300000" },
  { path: "over-300000/",           query: "from_price=300000" },
];
const GVM_PATHS = [
  { path: "under-3500-kg-gvm/",           query: "to_gvm=3500" },
  { path: "between-3500-kg-4500-kg-gvm/", query: "from_gvm=3500&to_gvm=4500" },
  { path: "between-4500-kg-6000-kg-gvm/", query: "from_gvm=4500&to_gvm=6000" },
  { path: "between-6000-kg-8000-kg-gvm/", query: "from_gvm=6000&to_gvm=8000" },
  { path: "over-8000-kg-gvm/",             query: "from_gvm=8000" },
];
const LENGTH_PATHS = [
  { path: "under-20-length-in-feet/",     query: "to_length=20" },
  { path: "between-20-23-length-in-feet/", query: "from_length=20&to_length=23" },
  { path: "between-23-26-length-in-feet/", query: "from_length=23&to_length=26" },
  { path: "between-26-30-length-in-feet/", query: "from_length=26&to_length=30" },
  { path: "over-30-length-in-feet/",       query: "from_length=30" },
];
const SLEEP_PATHS = [
  { path: "2-people-sleeping-capacity/",      query: "from_sleep=2&to_sleep=2" },
  { path: "3-people-sleeping-capacity/",      query: "from_sleep=3&to_sleep=3" },
  { path: "4-people-sleeping-capacity/",      query: "from_sleep=4&to_sleep=4" },
  { path: "5-people-sleeping-capacity/",      query: "from_sleep=5&to_sleep=5" },
  { path: "over-5-people-sleeping-capacity/", query: "from_sleep=5" },
];
const STATE_SLUGS = [
  "victoria", "new-south-wales", "queensland",
  "south-australia", "western-australia", "tasmania",
];

async function existsLive(query) {
  try {
    const res = await fetch(`${API_BASE}/pool?${query}&per_page=1&page=1`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return false;
    const json = await res.json();
    const total = json?.pagination?.total_products ?? json?.counts?.total ?? 0;
    return total > 0;
  } catch {
    return false;
  }
}

async function buildAttributesOthersPaths() {
  const bands = [...PRICE_PATHS, ...GVM_PATHS, ...LENGTH_PATHS, ...SLEEP_PATHS];
  const candidates = [...bands];
  for (const state of STATE_SLUGS) {
    const prefix = `${state}-state/`;
    for (const b of bands) {
      candidates.push({ path: prefix + b.path, query: `${b.query}&state=${state}` });
    }
  }

  const checks = await Promise.all(candidates.map((c) => existsLive(c.query)));
  return candidates.filter((_, i) => checks[i]).map((c) => c.path);
}

async function main() {
  const urls = new Set();

  // The bare, unfiltered catalog page — none of the API_TYPES/attribute
  // combinations above ever produce this path since it has zero filters,
  // so it must be added explicitly or it's silently treated as non-indexed.
  urls.add(`${SITE_URL}/listings/`);

  const results = await Promise.all(API_TYPES.map((t) => fetchType(t)));
  results.forEach((paths) => {
    for (const p of paths) urls.add(`${SITE_URL}/listings/${p}`);
  });

  const attributePaths = await buildAttributesOthersPaths();
  for (const p of attributePaths) {
    urls.add(`${SITE_URL}/listings/${p}`);
  }

  if (urls.size === 0) {
    console.error("Fetched zero URLs from every type — not overwriting url.csv.");
    process.exit(1);
  }

  const sorted = Array.from(urls).sort();
  fs.writeFileSync(OUT_PATH, sorted.join("\n") + "\n", "utf-8");
  console.log(`Wrote ${sorted.length} URLs to ${OUT_PATH}`);
}

main();
