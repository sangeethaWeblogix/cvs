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
    title: "Campervans for Sale by Location",
    description: "Browse campervans for sale by Australian state and region.",
    load: async () => {
      const [states, regions] = await Promise.all([fetchSitemapPaths("states"), fetchSitemapPaths("regions")]);
      return [listings("Campervans for Sale by State", states), listings("Campervans for Sale by Region", regions)];
    },
  },
  {
    id: "makes",
    title: "Campervans for Sale by Make & Model",
    description: "Browse campervans for sale by manufacturer, chassis (vehicle make) and model.",
    load: async () => {
      const [makes, vehicleMakes, models] = await Promise.all([
        fetchSitemapPaths("makes"),
        fetchSitemapPaths("vehicle-makes"),
        filterPathsByLiveCount(await fetchSitemapPaths("models")),
      ]);
      return [
        listings("Campervans for Sale by Make", makes),
        listings("Campervans for Sale by Vehicle Make", vehicleMakes),
        listings("Campervans for Sale by Model", models),
      ];
    },
  },
  {
    id: "makes-by-location",
    title: "Campervans for Sale by Make, State & Region",
    description: "Find a specific make or chassis for sale in your state or region.",
    load: async () => {
      const [stateMake, regionMake, stateVehicle, regionVehicle] = await Promise.all([
        fetchSitemapPaths("state-make"),
        filterPathsByLiveCount(await fetchSitemapPaths("region-make")),
        fetchSitemapPaths("state-vehicle-make"),
        filterPathsByLiveCount(await fetchSitemapPaths("region-vehicle-make")),
      ]);
      return [
        listings("Campervans for Sale by Make and State", stateMake),
        listings("Campervans for Sale by Make and Region", regionMake),
        listings("Campervans for Sale by Vehicle Make and State", stateVehicle),
        listings("Campervans for Sale by Vehicle Make and Region", regionVehicle),
      ];
    },
  },
  {
    id: "price-size-weight",
    title: "Campervans for Sale by Price, Size, Weight and Sleeping Capacity",
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
        listings("Campervans for Sale by Price", price),
        listings("Campervans for Sale by Length", length),
        listings("Campervans for Sale by Weight (GVM)", gvm),
        listings("Campervans for Sale by Price, Size, Weight and Sleeping Capacity", extra),
      ];
    },
  },
  {
    id: "products",
    title: "All Campervans for Sale",
    description: "Every campervan currently listed on CampervansForSale.au.",
    load: async () => [{ heading: "All Campervans for Sale", prefix: "product", paths: await fetchSitemapPaths("listings") }],
  },
];

// A hub page can trigger a few hundred upstream calls (the region-make sets
// are live-checked one by one), so keep each section for an hour per server
// instance. Empty results are never cached — a transient API failure
// shouldn't leave a blank page up for an hour.
const TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, { at: number; value: HubSection }>();

async function getHubSection(id: string): Promise<HubSection | null> {
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

const STATE_ABBR: Record<string, string> = {
  "new-south-wales": "NSW",
  victoria: "VIC",
  queensland: "QLD",
  "south-australia": "SA",
  "western-australia": "WA",
  tasmania: "TAS",
  "northern-territory": "NT",
  "australian-capital-territory": "ACT",
};

/** Price / size / weight / berth filter segments → the text that follows
 * "Campervans for Sale", or null if the segment isn't one of those. */
function bandText(seg: string): string | null {
  let m: RegExpMatchArray | null;
  if ((m = seg.match(/^under-(\d+)-kg-gvm$/))) return `Under ${num(m[1])}kg GVM`;
  if ((m = seg.match(/^over-(\d+)-kg-gvm$/))) return `Over ${num(m[1])}kg GVM`;
  if ((m = seg.match(/^between-(\d+)-kg-(\d+)-kg-gvm$/))) return `${num(m[1])}kg – ${num(m[2])}kg GVM`;
  if ((m = seg.match(/^under-(\d+)-length-in-feet$/))) return `Under ${m[1]}ft`;
  if ((m = seg.match(/^over-(\d+)-length-in-feet$/))) return `Over ${m[1]}ft`;
  if ((m = seg.match(/^between-(\d+)-(\d+)-length-in-feet$/))) return `${m[1]}ft – ${m[2]}ft`;
  if ((m = seg.match(/^over-(\d+)-people-sleeping-capacity$/))) return `Sleeping Over ${m[1]} People`;
  if ((m = seg.match(/^under-(\d+)-people-sleeping-capacity$/))) return `Sleeping Under ${m[1]} People`;
  if ((m = seg.match(/^(\d+)-people-sleeping-capacity$/))) return `Sleeping ${m[1]} People`;
  if ((m = seg.match(/^under-(\d+)$/))) return `Under ${money(m[1])}`;
  if ((m = seg.match(/^over-(\d+)$/))) return `Over ${money(m[1])}`;
  if ((m = seg.match(/^between-(\d+)-(\d+)$/))) return `${money(m[1])} – ${money(m[2])}`;
  return null;
}

/** Link text for a /listings/ path or a /product/ slug, written the way the
 * page would be described in search: "Campervans for Sale in NSW",
 * "Jayco Campervans for Sale in Sydney, NSW",
 * "Campervans for Sale Under $100,000". */
export function hubLinkLabel(path: string, prefix: "listings" | "product"): string {
  const segments = path.split("/").filter(Boolean);
  if (prefix === "product") return titleCase(segments[0] ?? path);

  let make = "";
  let model = "";
  let vehicleMake = "";
  let state = "";
  let region = "";
  let band = "";

  for (const seg of segments) {
    const b = bandText(seg);
    if (b) band = b;
    else if (seg.endsWith("-state")) state = seg.replace(/-state$/, "");
    else if (seg.endsWith("-region")) region = seg.replace(/-region$/, "");
    else if (seg.endsWith("-vehicle-make")) vehicleMake = seg.replace(/-vehicle-make$/, "");
    else if (!make) make = seg;
    else if (!model) model = seg;
  }

  const subject = make
    ? `${titleCase(make)}${model ? ` ${titleCase(model)}` : ""} Campervans`
    : vehicleMake
      ? `${titleCase(vehicleMake)}-Based Campervans`
      : "Campervans";

  const stateName = titleCase(state);
  const stateLabel = STATE_ABBR[state] ?? stateName;
  const regionName = titleCase(region);
  // A few regions share the state's own name (e.g. the ACT) — don't repeat it.
  const place = !state
    ? ""
    : region && regionName.toLowerCase() !== stateName.toLowerCase()
      ? ` in ${regionName}, ${stateLabel}`
      : ` in ${stateLabel}`;

  return `${subject} for Sale${band ? ` ${band}` : ""}${place}`;
}

/** Everything the /site-map/ page lists, in display order: the "buy" filter
 * groups (location, make/model, make-by-location, price/size/weight) and the
 * full product list. */
export async function getSiteMapContent(): Promise<{ buy: HubGroup[]; products: HubGroup[] }> {
  const [locations, makes, makesByLocation, bands, products] = await Promise.all([
    getHubSection("locations"),
    getHubSection("makes"),
    getHubSection("makes-by-location"),
    getHubSection("price-size-weight"),
    getHubSection("products"),
  ]);
  return {
    buy: [locations, makes, makesByLocation, bands].flatMap((sec) => sec?.groups ?? []),
    products: products?.groups ?? [],
  };
}
