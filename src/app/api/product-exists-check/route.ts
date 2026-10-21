import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";
import { fetchParamsCountFromKV } from "@/lib/paramsCountKv";

const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;

/**
 * Band-count lookup for the browse-section filter links (Price/ATM/Length/Sleep).
 * Mirrors fetchBandCountServer in fetchBrowseSectionData.ts so the client-side
 * refetch (filters changed after initial SSR) hits the same KV-first path
 * instead of falling back to the heavier pool_test endpoint.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsObj: Record<string, string> = {};
  searchParams.forEach((v, k) => { paramsObj[k] = v; });

  // 1. KV cache (shared with SSR path) — warmer may store total_products for this combo
  const kv = await fetchParamsCountFromKV(paramsObj);
  if (kv?.total_products != null) {
    return NextResponse.json(
      { success: true, exists: kv.total_products > 0, count: kv.total_products },
      { headers: { "X-Params-Cache": "HIT" } }
    );
  }

  // 2. KV miss — live fallback via /pool?per_page=1, read for
  // pagination.total_products. The old product_exists_check call this
  // replaced hit a route that doesn't exist upstream (confirmed 404), so
  // every band panel relying on this endpoint always rendered empty —
  // fetchParamsCountFromKV above also always returns null (KV isn't wired
  // up yet), so step 1 never actually short-circuited this fallback.
  const paramsStr = new URLSearchParams({ per_page: "1", page: "1", ...paramsObj }).toString();
  try {
    const res = await fetch(`${API_BASE}/pool?${paramsStr}`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, exists: false, count: 0 }, { status: res.status });
    }

    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const json = JSON.parse(idx > 0 ? raw.slice(idx) : raw);
    const count = json?.pagination?.total_products ?? json?.counts?.total ?? 0;
    return NextResponse.json(
      { success: true, exists: count > 0, count },
      { headers: { "X-Params-Cache": "MISS" } }
    );
  } catch (err) {
    console.error(
      `[product-exists-check] WP API fetch failed | params="${paramsStr}" | error="${(err as Error).message}"`
    );
    return NextResponse.json({ success: false, exists: false, count: 0 }, { status: 502 });
  }
}
