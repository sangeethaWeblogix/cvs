const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;

/** Server-side live-stock check for a flat list of band links (price/GVM/
 * length/sleep), keyed by href. Used to seed HomeLocationSection's static
 * filter chips so a band that's currently out of stock (e.g. 410) is
 * already absent from the first HTML byte instead of staying linked
 * regardless of stock — see fetchRegionCounts for why that matters for
 * crawlers reading raw server HTML.
 *
 * Deliberately calls /pool directly (same live check sitemapApi.ts's
 * filterPathsByLiveCount uses) rather than product_exists_check/
 * product-exists-check — that endpoint's KV-cache-first path can mask a
 * live call that 404s (confirmed: the plain /product_exists_check route
 * fetchBandCountServer calls doesn't exist upstream), so it isn't a
 * trustworthy live source on its own. */
export async function fetchBandAvailability(
  bands: { href: string; query: string }[]
): Promise<Record<string, boolean>> {
  const map: Record<string, boolean> = {};
  await Promise.all(
    bands.map(async (b) => {
      try {
        const res = await fetch(`${API_BASE}/pool?per_page=1&page=1&${b.query}`, {
          headers: {
            Accept: "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
          cache: "no-store",
        });
        if (!res.ok) { map[b.href] = false; return; }
        const raw = await res.text();
        const idx = raw.indexOf('{"');
        const json = JSON.parse(idx > 0 ? raw.slice(idx) : raw);
        const total = json?.pagination?.total_products ?? json?.counts?.total ?? 0;
        map[b.href] = total > 0;
      } catch {
        map[b.href] = false;
      }
    })
  );
  return map;
}
