import { cache } from "react";
import { normalizeBlogProduct } from "../listings/listingShared";

const API_KEY = process.env.MFS_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const FETCH_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// Cards embedded in the content (<div data-mpn-products="KEY">) — trimmed to
// card fields here so sku/dealer/description stay out of the page payload.
function slimProductSections(json: any) {
  const post = json?.data?.blog_detail;
  if (Array.isArray(post?.product_sections)) {
    post.product_sections = post.product_sections.map((section: any) => ({
      key: section.key,
      link: section.link ?? null,
      products: (section.products ?? []).map(normalizeBlogProduct),
    }));
  }
  return json;
}

// cache() dedupes identical (slug, seed) calls within a single request, so
// generateMetadata + layout + page no longer each hit the WP API separately.
export const fetchBlogDetail = cache(async (slug: string, seed?: number) => {
  const seedParam = seed ? `&seed=${seed}` : "";
  const url = `${API_BASE}/blog-detail-new/?slug=${encodeURIComponent(
    slug
  )}${seedParam}`;

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        lastErr = new Error(`blog-detail-new status ${res.status}`);
        continue;
      }
      const raw = await res.text();
      const idx = raw.indexOf('{"');
      return slimProductSections(JSON.parse(idx >= 0 ? raw.substring(idx) : raw));
    } catch (err) {
      lastErr = err;
    }
  }

  console.error("fetchBlogDetail: all attempts failed", lastErr);
  return null;
});
