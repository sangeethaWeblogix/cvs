import { fetchSitemapPaths, filterPathsByLiveCount } from "@/lib/sitemapApi";
import { fetchAttributePaths } from "@/lib/attributePaths";

/**
 * Data behind the HTML /site-map/ hub — the same live, stock-checked URL sets
 * the XML sitemaps publish (so the two never disagree), rendered as real
 * <a href> links so every indexable URL has at least one internal link
 * pointing at it. Nothing here is hand-listed per combination: whatever the
 * backend sitemap API returns (and the same live-count filter the XML routes
 * apply) shows up automatically, and drops out again when stock hits zero.
 */

export type HubGroup = {
  heading: string;
  /** URL prefix the group's paths hang off: /listings/{path} or /product/{path} */
  prefix: "listings" | "product";
  paths: string[];
};

export type HubSection = {
  id: string;
  title: string;
  description: string;
  groups: HubGroup[];
};

type SectionDef = {
  id: string;
  title: string;
  description: string;
  load: () => Promise<HubGroup[]>;
};

const listings = (heading: string, paths: string[]): HubGroup => ({ heading, prefix: "listings", paths });

const SECTION_DEFS: SectionDef[] = [
  {
    id: "locations",
    title: "Campervans by Location",
    description: "Browse campervans for sale by Australian state and region.",
    load: async () => {
      const [states, regions] = await Promise.all([fetchSitemapPaths("states"), fetchSitemapPaths("regions")]);
      return [listings("Campervans for Sale by State", states), listings("Campervans for Sale by Region", regions)];
    },
  },
  {
    id: "makes",
    title: "Campervans by Make and Model",
    description: "Browse campervans for sale by manufacturer, chassis (vehicle make) and model.",
    load: async () => {
      const [makes, vehicleMakes, models] = await Promise.all([
        fetchSitemapPaths("makes"),
        fetchSitemapPaths("vehicle-makes"),
        filterPathsByLiveCount(await fetchSitemapPaths("models")),
      ]);
      return [
        listings("Campervan Makes", makes),
        listings("Vehicle Makes (Chassis)", vehicleMakes),
        listings("Campervan Models", models),
      ];
    },
  },
  {
    id: "makes-by-location",
    title: "Makes by State and Region",
    description: "Find a specific make or chassis for sale in your state or region.",
    load: async () => {
      const [stateMake, regionMake, stateVehicle, regionVehicle] = await Promise.all([
        fetchSitemapPaths("state-make"),
        filterPathsByLiveCount(await fetchSitemapPaths("region-make")),
        fetchSitemapPaths("state-vehicle-make"),
        filterPathsByLiveCount(await fetchSitemapPaths("region-vehicle-make")),
      ]);
      return [
        listings("Makes by State", stateMake),
        listings("Makes by Region", regionMake),
        listings("Vehicle Makes by State", stateVehicle),
        listings("Vehicle Makes by Region", regionVehicle),
      ];
    },
  },
  {
    id: "price-size-weight",
    title: "Campervans by Price, Size, Weight and Sleeping Capacity",
    description: "Browse campervans for sale by price range, length, GVM weight and number of berths.",
    load: async () => {
      const [price, length, gvm, attributes] = await Promise.all([
        fetchSitemapPaths("price"),
        fetchSitemapPaths("length"),
        fetchSitemapPaths("gvm"),
        fetchAttributePaths(),
      ]);
      // attributes-others repeats the unscoped bands and adds per-state ones —
      // list each URL once.
      const seen = new Set([...price, ...length, ...gvm]);
      const extra = attributes.filter((p) => !seen.has(p));
      return [
        listings("By Price", price),
        listings("By Length", length),
        listings("By Weight (GVM)", gvm),
        listings("More Price, Size, Weight and Sleeping Capacity Filters", extra),
      ];
    },
  },
  {
    id: "products",
    title: "All Campervans for Sale",
    description: "Every campervan currently listed on CampervansForSale.au.",
    load: async () => [{ heading: "Campervans", prefix: "product", paths: await fetchSitemapPaths("listings") }],
  },
];

export const HUB_SECTION_IDS = SECTION_DEFS.map((s) => s.id);

export function getHubSectionMeta(id: string) {
  const def = SECTION_DEFS.find((s) => s.id === id);
  return def ? { id: def.id, title: def.title, description: def.description } : null;
}

export function listHubSections() {
  return SECTION_DEFS.map(({ id, title, description }) => ({ id, title, description }));
}

// A hub page can trigger a few hundred upstream calls (the region-make sets
// are live-checked one by one), so keep each section for an hour per server
// instance. Empty results are never cached — a transient API failure
// shouldn't leave a blank page up for an hour.
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; value: HubSection }>();

export async function getHubSection(id: string): Promise<HubSection | null> {
  const def = SECTION_DEFS.find((s) => s.id === id);
  if (!def) return null;

  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value;

  const groups = (await def.load()).filter((g) => g.paths.length > 0);
  const section: HubSection = { id: def.id, title: def.title, description: def.description, groups };
  if (groups.length > 0) cache.set(id, { at: Date.now(), value: section });
  return section;
}

/* ---------- link labels ---------- */

const titleCase = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const money = (n: string) => `$${Number(n).toLocaleString("en-AU")}`;
const num = (n: string) => Number(n).toLocaleString("en-AU");

function segmentLabel(seg: string): string {
  let m: RegExpMatchArray | null;
  if ((m = seg.match(/^under-(\d+)-kg-gvm$/))) return `Under ${num(m[1])}kg GVM`;
  if ((m = seg.match(/^over-(\d+)-kg-gvm$/))) return `Over ${num(m[1])}kg GVM`;
  if ((m = seg.match(/^between-(\d+)-kg-(\d+)-kg-gvm$/))) return `${num(m[1])}kg – ${num(m[2])}kg GVM`;
  if ((m = seg.match(/^under-(\d+)-length-in-feet$/))) return `Under ${m[1]}ft`;
  if ((m = seg.match(/^over-(\d+)-length-in-feet$/))) return `Over ${m[1]}ft`;
  if ((m = seg.match(/^between-(\d+)-(\d+)-length-in-feet$/))) return `${m[1]}ft – ${m[2]}ft`;
  if ((m = seg.match(/^over-(\d+)-people-sleeping-capacity$/))) return `Sleeps over ${m[1]}`;
  if ((m = seg.match(/^under-(\d+)-people-sleeping-capacity$/))) return `Sleeps under ${m[1]}`;
  if ((m = seg.match(/^(\d+)-people-sleeping-capacity$/))) return `Sleeps ${m[1]}`;
  if ((m = seg.match(/^under-(\d+)$/))) return `Under ${money(m[1])}`;
  if ((m = seg.match(/^over-(\d+)$/))) return `Over ${money(m[1])}`;
  if ((m = seg.match(/^between-(\d+)-(\d+)$/))) return `${money(m[1])} – ${money(m[2])}`;
  if (seg.endsWith("-vehicle-make")) return `${titleCase(seg.replace(/-vehicle-make$/, ""))} (Vehicle Make)`;
  if (seg.endsWith("-state")) return titleCase(seg.replace(/-state$/, ""));
  if (seg.endsWith("-region")) return titleCase(seg.replace(/-region$/, ""));
  return titleCase(seg);
}

/** Human-readable link text for a /listings/ path or a /product/ slug. */
export function hubLinkLabel(path: string, prefix: "listings" | "product"): string {
  const segments = path.split("/").filter(Boolean);
  if (prefix === "product") return titleCase(segments[0] ?? path);
  return segments.map(segmentLabel).join(" › ");
}
