const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;

/**
 * The full "By Price / By Weight (GVM) / By Size (Length) / By Sleeping
 * Capacity" band set shown on the home page and every /listings/ page
 * (browseSectionShared.ts's FILTERS_NO_STATE / SLEEP_BANDS), unscoped and
 * per-state — kept together here as one complete, self-contained list even
 * though the unscoped Price/GVM/Length paths are also covered individually
 * by prices-sitemap.xml/weights-sitemap.xml/length-sitemap.xml. Sleeping
 * Capacity has no dedicated sitemap type on the backend at all, so this is
 * its only coverage (unscoped and per-state).
 *
 * `query` is the equivalent /pool params for that path (same from/to field
 * names parseSlugToFilters derives from the slug itself) — every path is
 * live-checked before being included, so a band with zero current matches
 * (e.g. nobody currently lists a 5-berth campervan) doesn't end up in the
 * sitemap just to 410 the moment it's crawled.
 *
 * Shared by attributes-others-sitemap.xml and the HTML /site-map/ hub so the
 * two always list exactly the same URLs.
 */
const PRICE_PATHS = [
  { path: "under-100000/",          query: "to_price=100000" },
  { path: "between-100000-150000/", query: "from_price=100000&to_price=150000" },
  { path: "between-150000-200000/", query: "from_price=150000&to_price=200000" },
  { path: "between-200000-300000/", query: "from_price=200000&to_price=300000" },
  { path: "over-300000/",           query: "from_price=300000" },
];
const GVM_PATHS = [
  { path: "under-3500-kg-gvm/",             query: "to_gvm=3500" },
  { path: "between-3500-kg-4500-kg-gvm/",   query: "from_gvm=3500&to_gvm=4500" },
  { path: "between-4500-kg-6000-kg-gvm/",   query: "from_gvm=4500&to_gvm=6000" },
  { path: "between-6000-kg-8000-kg-gvm/",   query: "from_gvm=6000&to_gvm=8000" },
  { path: "over-8000-kg-gvm/",               query: "from_gvm=8000" },
];
const LENGTH_PATHS = [
  { path: "under-20-length-in-feet/",           query: "to_length=20" },
  { path: "between-20-23-length-in-feet/",       query: "from_length=20&to_length=23" },
  { path: "between-23-26-length-in-feet/",       query: "from_length=23&to_length=26" },
  { path: "between-26-30-length-in-feet/",       query: "from_length=26&to_length=30" },
  { path: "over-30-length-in-feet/",             query: "from_length=30" },
];
const SLEEP_PATHS = [
  { path: "2-people-sleeping-capacity/",         query: "from_sleep=2&to_sleep=2" },
  { path: "3-people-sleeping-capacity/",         query: "from_sleep=3&to_sleep=3" },
  { path: "4-people-sleeping-capacity/",         query: "from_sleep=4&to_sleep=4" },
  { path: "5-people-sleeping-capacity/",         query: "from_sleep=5&to_sleep=5" },
  { path: "over-5-people-sleeping-capacity/",    query: "from_sleep=5" },
];

const STATE_SLUGS = [
  "victoria", "new-south-wales", "queensland",
  "south-australia", "western-australia", "tasmania",
];

function buildCandidates(): { path: string; query: string }[] {
  const bands = [...PRICE_PATHS, ...GVM_PATHS, ...LENGTH_PATHS, ...SLEEP_PATHS];
  const candidates = [...bands];

  for (const state of STATE_SLUGS) {
    const prefix = `${state}-state/`;
    for (const b of bands) {
      candidates.push({ path: prefix + b.path, query: `${b.query}&state=${state}` });
    }
  }

  return candidates;
}

// No dedicated exists-check endpoint on the live backend (product_exists_check
// 404s) — /pool is the confirmed-working way to get a real count for an
// arbitrary filter combo, same as every other live count check in this app.
async function existsLive(query: string): Promise<boolean> {
  if (!API_BASE) return true; // fail open — don't blank the whole sitemap over a misconfigured env
  try {
    const res = await fetch(`${API_BASE}/pool?${query}&per_page=1&page=1`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const json = await res.json();
    const total = json?.pagination?.total_products ?? json?.counts?.total ?? 0;
    return total > 0;
  } catch {
    return false;
  }
}

/** Live-checked /listings/ band paths (price/GVM/length/sleep, unscoped and
 * per state) that currently have at least one matching campervan. */
export async function fetchAttributePaths(): Promise<string[]> {
  const candidates = buildCandidates();
  const checks = await Promise.all(candidates.map((c) => existsLive(c.query)));
  return candidates.filter((_, i) => checks[i]).map((c) => c.path);
}
