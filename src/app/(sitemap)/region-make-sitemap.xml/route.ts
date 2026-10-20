import { NextResponse } from "next/server";
import { fetchSitemapPaths, filterPathsByLiveCount, buildSitemapXml } from "@/lib/sitemapApi";

export async function GET() {
  const paths = await filterPathsByLiveCount(await fetchSitemapPaths("region-make"));
  const sitemap = buildSitemapXml(paths, "listings");

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
