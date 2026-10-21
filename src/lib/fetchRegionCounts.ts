const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;

/** Server-side counterpart to useLiveRegionCounts — fetched during SSR so a
 * page's live-stock-filtered region links are already correct in the first
 * HTML byte. Without this, "use client" components that only filter inside
 * a post-mount useEffect render with their stock check still unresolved
 * (regionCounts === null) on the very first pass, so the raw server HTML —
 * what a non-JS crawler or `curl` sees — always lists every region
 * regardless of current stock. */
export async function fetchRegionCounts(states: string[]): Promise<Record<string, number>> {
  const map: Record<string, number> = {};
  await Promise.all(
    states.map(async (state) => {
      try {
        const qs = new URLSearchParams({ group_by: "region", state });
        const res = await fetch(`${API_BASE}/params-count?${qs.toString()}`, {
          headers: {
            Accept: "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
          cache: "no-store",
        });
        if (!res.ok) return;
        const raw = await res.text();
        const idx = raw.indexOf('{"');
        const json = JSON.parse(idx > 0 ? raw.slice(idx) : raw);
        for (const r of json?.data ?? []) {
          map[`${state}:${r.slug}`] = r.count;
        }
      } catch {
        // leave this state's regions out of the map on failure — callers
        // treat an absent key the same as a 0 count, not "unknown".
      }
    })
  );
  return map;
}
