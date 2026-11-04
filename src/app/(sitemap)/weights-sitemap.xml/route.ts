import { NextResponse } from "next/server";
import { fetchSitemapPaths, buildSitemapXml } from "@/lib/sitemapApi";
import { isIndexableListingsPath } from "@/utils/seo/band-utils";

export async function GET() {
  // Only list pages middleware serves as index — noindex pages in a sitemap are an Ahrefs error.
  const paths = (await fetchSitemapPaths("gvm")).filter(isIndexableListingsPath);
  const sitemap = buildSitemapXml(paths, "listings");

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
