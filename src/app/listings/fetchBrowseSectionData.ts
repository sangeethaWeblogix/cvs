import {
  PRICE_BANDS,
  GVM_BANDS,
  LENGTH_BANDS,
  SLEEP_BANDS,
  FILTERS_NO_STATE_QUERIES,
  type CountItem,
  type BrowseSectionData,
} from "./browseSectionShared";
import { normalizeCountItems } from "@/lib/paramsCountKv";

const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;

const wpHeaders = (): Record<string
, string> => ({
  Accept: "application/json",
  ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
});

async function fetchGroupCountsServer(
  groupBy: string,
  scope: Record<string, string>
): Promise<CountItem[]> {
  try {
    const qs = new URLSearchParams({ group_by: groupBy, ...scope });
    const res = await fetch(`${API_BASE}/params-count?${qs.toString()}`, {
      headers: wpHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Upstream returns the single group's list directly under .data (see
    // middleware.ts / api/d2) — the nested .data[groupBy] form is kept as a fallback.
    const items = Array.isArray(json?.data) ? json.data : json?.data?.[groupBy];
    return normalizeCountItems(items ?? []);
  } catch {
    return [];
  }
}

/**
 * Band count for all pages — a /pool?per_page=1 probe read for
 * pagination.total_products, same live check sitemapApi.ts's
 * filterPathsByLiveCount uses. The previous product_exists_check call this
 * replaced hit a route that doesn't exist upstream (confirmed 404 — same
 * mistake as the old params_count/X-API-Key usage above), so every band
 * panel these functions feed was always rendering empty server-side.
 */
async function fetchBandCountServer(scope: Record<string, string>, query: string): Promise<number> {
  const bandParams: Record<string, string> = { per_page: "1", page: "1", ...scope };
  new URLSearchParams(query).forEach((v, k) => { bandParams[k] = v; });

  try {
    const qs = new URLSearchParams(bandParams);
    const res = await fetch(`${API_BASE}/pool?${qs.toString()}`, {
      headers: wpHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const json = JSON.parse(idx > 0 ? raw.slice(idx) : raw);
    return json?.pagination?.total_products ?? json?.counts?.total ?? 0;
  } catch {
    return 0;
  }
}

async function fetchAllBandCountsServer(scope: Record<string, string>) {
  const [price, gvm, length, sleep] = await Promise.all([
    Promise.all(PRICE_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    Promise.all(GVM_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    Promise.all(LENGTH_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    Promise.all(SLEEP_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
  ]);
  return { price, gvm, length, sleep };
}

/** Server-side mirror of StateBrowseSection's four client-fetch modes — run
 * during SSR/ISR so the section's links land in the initial HTML instead of
 * only appearing after the client's useEffect fetches finish.
 *
 * Band counts use the live product_exists_check API (returns { count, exists })
 * — same path for both indexed and noindex pages.
 */
export async function fetchBrowseSectionData(
  filters: { state?: string; region?: string; category?: string },
): Promise<BrowseSectionData> {
  const { state, region, category } = filters;
  const hasState = !!state;
  const hasRegion = !!region;
  const hasCategory = !!category;

  const categoryOnly            = !hasState && hasCategory;
  const stateRegionMode         = hasState && hasRegion && !hasCategory;
  const categoryStateMode       = hasState && hasCategory && !hasRegion;
  const categoryStateRegionMode = hasState && hasCategory && hasRegion;

  if (categoryOnly) {
    const scope = { category: category! };
    const [makeCounts, stateCounts, regionCounts, priceCounts] = await Promise.all([
      fetchGroupCountsServer("make", scope),
      fetchGroupCountsServer("state", scope),
      fetchGroupCountsServer("region", scope),
      Promise.all(PRICE_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    ]);
    return { makeCounts, stateCounts, regionCounts, priceCounts };
  }

  if (stateRegionMode) {
    const scope = { state: state!, region: region! };
    const [makeCounts, categoryCounts, priceCounts, gvmCounts, sleepCounts] = await Promise.all([
      fetchGroupCountsServer("make", scope),
      fetchGroupCountsServer("category", scope),
      Promise.all(PRICE_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
      Promise.all(GVM_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
      Promise.all(SLEEP_BANDS.map((b) => fetchBandCountServer(scope, b.query))),
    ]);
    return { makeCounts, categoryCounts, priceCounts, gvmCounts, sleepCounts };
  }

  if (categoryStateMode) {
    const scope = { category: category!, state: state! };
    const [regionCounts, makeCounts, bands] = await Promise.all([
      fetchGroupCountsServer("region", scope),
      fetchGroupCountsServer("make", scope),
      fetchAllBandCountsServer(scope),
    ]);
    return {
      regionCounts,
      makeCounts,
      priceCounts: bands.price,
      gvmCounts: bands.gvm,
      lengthCounts: bands.length,
      sleepCounts: bands.sleep,
    };
  }

  if (categoryStateRegionMode) {
    const scope = { category: category!, state: state!, region: region! };
    const [makeCounts, bands] = await Promise.all([
      fetchGroupCountsServer("make", scope),
      fetchAllBandCountsServer(scope),
    ]);
    return {
      makeCounts,
      priceCounts: bands.price,
      gvmCounts: bands.gvm,
      lengthCounts: bands.length,
      sleepCounts: bands.sleep,
    };
  }

  // Default mode (no state/category, or state-only) — the pills are static
  // (STATES/FILTERS_NO_STATE) or come from getRegionsByState, so they need
  // live counts to hide the ones whose page would be empty (and 410).
  const scope: Record<string, string> = hasState ? { state: state! } : {};
  const [placeCounts, filterCounts] = await Promise.all([
    fetchGroupCountsServer(hasState ? "region" : "state", scope),
    Promise.all(FILTERS_NO_STATE_QUERIES.map((qs) => Promise.all(qs.map((q) => fetchBandCountServer(scope, q))))),
  ]);
  return hasState ? { regionCounts: placeCounts, filterCounts } : { stateCounts: placeCounts, filterCounts };
}

/** Live counts behind the footer's state and new/used links, so none lead to
 * an empty (410) page — they reappear by themselves once stock arrives.
 * An empty stateCounts means unknown (API down); callers keep every state then. */
export async function fetchFooterLinkCounts() {
  const [stateCounts, newCount, usedCount] = await Promise.all([
    fetchGroupCountsServer("state", {}),
    fetchBandCountServer({}, "condition=new"),
    fetchBandCountServer({}, "condition=used"),
  ]);
  return { stateCounts, conditionCounts: { new: newCount, used: usedCount } as Record<string, number> };
}
