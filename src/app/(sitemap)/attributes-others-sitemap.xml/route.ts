import { NextResponse } from "next/server";
import { fetchAttributePaths } from "@/lib/attributePaths";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.campervansforsale.au";

export async function GET() {
  const paths = await fetchAttributePaths();

  const lastmod = new Date().toISOString();
  const urls = paths
    .map(
      (path) => `
  <url>
    <loc>${SITE_URL}/listings/${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
