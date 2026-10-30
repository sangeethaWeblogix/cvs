


 import { cache } from "react";
import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { fetchSitemapPaths } from "@/lib/sitemapApi";

/** Local shapes for the pool_test response fields this file actually reads —
 * kept here instead of importing from the (removed) old listings API module. */
type Item = {
  name: string;
  make?: string;
  model?: string;
  link: string;
  length?: string;
  regular_price?: string;
  sale_price?: string;
  image?: string;
  image_format?: string[];
  categories?: string[];
  axle?: string;
  sku?: string;
  condition?: string;
  lengthFt?: number;
};

type ApiResponse = {
  success?: boolean;
  seo_v2?: {
    h1?: string;
    meta_title?: string;
    meta_description?: string;
    short_description?: string;
    footer_description?: string;
    faq?: string | Faq[];
  };
  pagination?: {
    total_products?: number;
  };
  data?: {
    products?: Item[];
    exclusive_products?: Item[];
    emp_exclusive_products?: Item[];
    premium_products?: Item[];
  };
  emp_exclusive_products?: Item[];
};

 const BASE_URL = "https://www.campervansforsale.au";
const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY;

/** The same /pool endpoint fetchInitialPool.ts and middleware.ts already
 * rely on — this used to call pool_test instead, but that route 404s
 * upstream (confirmed directly), which is why every /listings/* page's
 * JSON-LD (CollectionPage/ItemList/SearchResultsPage/FAQPage) was silently
 * missing: fetchListingsForHead always got null back and layout.tsx just
 * skips rendering the <script> tags when that happens. /pool's response is
 * flat (featured_products/new_products/used_products/exclusive_products/
 * premium_products/seo_v2 at the top level, no products/emp_exclusive_
 * products keys) — adapted below into the nested ApiResponse shape
 * buildListingsJsonLd already expects, so no caller changes are needed. */
async function fetchPoolListingsForHead(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any,
  page: number
): Promise<ApiResponse | null> {
  const params = new URLSearchParams();
  params.set("orderby", "default");
  params.set("seed", "1"); // fixed seed — this is for SEO schema, not user-facing shuffle
  params.set("page", String(page));
  if (filters.state) params.set("state", String(filters.state));
  if (filters.category) params.set("category", String(filters.category));
  if (filters.make) params.set("campervan_make", String(filters.make));
  if (filters.model) params.set("model", String(filters.model));
  if (filters.region) params.set("region", String(filters.region));
  if (filters.suburb) params.set("suburb", String(filters.suburb));
  if (filters.pincode) params.set("pincode", String(filters.pincode));
  if (filters.from_price) params.set("from_price", String(filters.from_price));
  if (filters.to_price) params.set("to_price", String(filters.to_price));
  if (filters.minKg) params.set("from_gvm", String(filters.minKg));
  if (filters.maxKg) params.set("to_gvm", String(filters.maxKg));
  if (filters.from_sleep) params.set("from_sleep", String(filters.from_sleep));
  if (filters.to_sleep) params.set("to_sleep", String(filters.to_sleep));
  if (filters.acustom_fromyears) params.set("from_year", String(filters.acustom_fromyears));
  if (filters.acustom_toyears) params.set("to_year", String(filters.acustom_toyears));
  if (filters.from_length) params.set("from_length", String(filters.from_length));
  if (filters.to_length) params.set("to_length", String(filters.to_length));
  if (filters.condition) params.set("condition", String(filters.condition));
  if (filters.search || filters.keyword) params.set("search", String(filters.search ?? filters.keyword));

  const url = `${API_BASE}/pool?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      cache: "no-store",
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const raw = await res.text();
  const jsonStart = raw.indexOf("{");
  const cleaned = jsonStart <= 0 ? raw : raw.substring(jsonStart);

  let json: any;
  try {
    json = JSON.parse(cleaned);
  } catch {
    return null;
  }

  const data: ApiResponse = {
    success: json.success,
    seo_v2: json.seo_v2,
    pagination: json.pagination,
    data: {
      products: [
        ...(json.featured_products ?? []),
        ...(json.new_products ?? []),
        ...(json.used_products ?? []),
        ...(json.exclusive_products ?? []),
      ].map(normalizeItem),
      exclusive_products: (json.exclusive_products ?? []).map(normalizeItem),
      emp_exclusive_products: [],
      premium_products: (json.premium_products ?? []).map(normalizeItem),
    },
    emp_exclusive_products: [],
  };
  return data;
}

/** /pool's raw product fields use different names/types than this file's
 * Item shape (title vs name, r2_thumbnails vs image_format, category vs
 * categories, numeric regular_price/sale_price vs string, slug vs a full
 * product link) — same mismatch listingShared.ts's normalizeListing already
 * handles for the main grid, mirrored here for this file's own Item type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(raw: any): Item {
  return {
    name: raw.name ?? raw.title ?? "",
    make: raw.make,
    model: raw.model,
    link: raw.link ?? (raw.slug ? `${BASE_URL}/product/${raw.slug}/` : ""),
    length: raw.length != null ? String(raw.length) : undefined,
    regular_price: raw.regular_price != null ? String(raw.regular_price) : undefined,
    sale_price: raw.sale_price != null ? String(raw.sale_price) : undefined,
    image: raw.image,
    image_format: Array.isArray(raw.image_format)
      ? raw.image_format
      : Array.isArray(raw.r2_thumbnails)
        ? raw.r2_thumbnails
        : undefined,
    categories: Array.isArray(raw.categories)
      ? raw.categories
      : Array.isArray(raw.category)
        ? raw.category
        : raw.category
          ? [raw.category]
          : undefined,
    axle: raw.axle,
    sku: raw.sku,
    condition: raw.condition,
    lengthFt: Number(raw.length) > 0 ? Number(raw.length) : undefined,
  };
}

function cleanPrice(raw: string | number | null | undefined): string {
  return String(raw ?? "").replace(/[$,]/g, "").trim();
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<\/(h[1-6]|p|div|li|br)\s*>/gi, ". ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s*\.\s*\.\s*/g, ". ") // collapse doubled periods from adjacent block tags
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

type Faq = { q: string; a: string };

/** seo_v2.faq comes back as either a JSON-encoded string or an already-parsed
 * array, depending on endpoint/response (same ambiguity listingShared.ts's
 * SeoV2 type notes) — /pool returns it already parsed, so JSON.parse(raw)
 * on an array threw and silently dropped every page's FAQPage schema. */
function parseFaq(raw?: string | Faq[]): Faq[] {
  if (!raw) return [];
  const parsed = Array.isArray(raw) ? raw : (() => {
    try { return JSON.parse(raw); } catch { return null; }
  })();
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((f): f is Faq => !!f?.q && !!f?.a);
}

function slugToTitleCase(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ---------- Vehicle items for the ItemList ----------
 * /pool items carry only title/sku/condition/price/length — no make, model,
 * year, chassis or features. Those are recovered from the title against the
 * backend's own make / vehicle-make / model lists (the same ones the XML
 * sitemaps use), so a field is only emitted when it was actually found. */

type Taxonomy = { makes: string[]; vehicleMakes: string[]; models: string[] };
let taxonomyCache: { at: number; value: Taxonomy } | null = null;

async function getTaxonomy(): Promise<Taxonomy> {
  if (taxonomyCache && Date.now() - taxonomyCache.at < 60 * 60 * 1000) return taxonomyCache.value;
  const [makes, vehicleMakes, models] = await Promise.all([
    fetchSitemapPaths("makes"),
    fetchSitemapPaths("vehicle-makes"),
    fetchSitemapPaths("models"),
  ]);
  const value: Taxonomy = {
    makes: makes.map((p) => p.replace(/\/$/, "")),
    vehicleMakes: vehicleMakes.map((p) => p.replace(/\/$/, "").replace(/-vehicle-make$/, "")),
    models: models.map((p) => p.replace(/\/$/, "")),
  };
  // Don't cache an empty result — a failed fetch shouldn't stick for an hour.
  if (value.makes.length > 0) taxonomyCache = { at: Date.now(), value };
  return value;
}

const BRAND_CASE: Record<string, string> = {
  kea: "KEA",
  ldv: "LDV",
  "mercedes-benz": "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
};

const brandLabel = (slug: string) => BRAND_CASE[slug] ?? slugToTitleCase(slug);

/** Case-insensitive match of a slug's words (hyphens ≈ spaces/hyphens) in a title. */
function findInTitle(title: string, slug: string): RegExpMatchArray | null {
  const words = slug.split("-").filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (words.length === 0) return null;
  return title.match(new RegExp(`(?<![A-Za-z0-9])${words.join("[\\s-]+")}(?![A-Za-z0-9])`, "i"));
}

const FEATURES: [RegExp, string][] = [
  [/lithium battery/i, "lithium battery"],
  [/solar panels?/i, "solar panels"],
  [/revers(?:e|ing) camera/i, "reverse camera"],
  [/awning/i, "awning"],
  [/slide[\s-]?out/i, "slide out"],
  [/diesel heater/i, "diesel heater"],
  [/tow bar/i, "tow bar"],
  [/cruise control/i, "cruise control"],
  [/turbo(?:charged)?/i, "turbocharged"],
  [/drop[\s-]?down bed/i, "drop down bed"],
  [/inverter system/i, "inverter system"],
  [/washing machine/i, "washing machine"],
  [/air[\s-]?con(?:ditioning|ditioner)?/i, "air conditioning"],
  [/microwave/i, "microwave"],
  [/external shower/i, "external shower"],
  [/shower/i, "shower"],
  [/toilet/i, "toilet"],
];

function buildVehicleLd(item: Item, tax: Taxonomy) {
  const title = item.name;
  const url = item.link;
  const yearMatch = title.match(/^(\d{4})\b/);
  const year = yearMatch && Number(yearMatch[1]) >= 1950 && Number(yearMatch[1]) <= 2100 ? yearMatch[1] : "";

  // Longest make name first so "Dove Camper Conversions"/"Custom Built" win over shorter ones.
  const makeSlug = [...tax.makes]
    .sort((a, b) => b.length - a.length)
    .find((slug) => findInTitle(title, slug));
  const chassisSlug = [...tax.vehicleMakes]
    .sort((a, b) => b.length - a.length)
    .find((slug) => findInTitle(title, slug));

  let model = "";
  if (makeSlug) {
    const best = tax.models
      .filter((m) => m.startsWith(`${makeSlug}/`))
      .map((m) => m.slice(makeSlug.length + 1))
      .sort((a, b) => b.length - a.length)
      .find((slug) => findInTitle(title, slug));
    if (best) {
      const matched = findInTitle(title, best)?.[0] ?? "";
      model = matched === matched.toLowerCase() ? slugToTitleCase(best) : matched;
    }
  }

  const price = Number(cleanPrice(item.sale_price && item.sale_price !== "" ? item.sale_price : item.regular_price));
  const isNew = String(item.condition ?? "").toLowerCase() === "new";
  const condition = isNew ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition";

  const transmission = /\bautomatic\b/i.test(title) ? "Automatic" : /\bmanual\b/i.test(title) ? "Manual" : "";
  const fuel = /\bdiesel\b/i.test(title) ? "Diesel" : /\bpetrol\b/i.test(title) ? "Petrol" : "";
  const displacement = title.match(/\b(\d(?:\.\d)?)\s?L\b/);

  const features = FEATURES.filter(([re]) => re.test(title)).map(([, label]) => label);
  const featuresText = features.length ? features.join(", ").replace(/^./, (c) => c.toUpperCase()) : "";

  const images = (item.image_format ?? (item.image ? [item.image] : [])).slice(0, 5);

  const additionalProperty = [
    ...(chassisSlug ? [{ "@type": "PropertyValue", name: "Chassis", value: brandLabel(chassisSlug) }] : []),
    ...(item.lengthFt ? [{ "@type": "PropertyValue", name: "Length", value: item.lengthFt, unitCode: "FOT" }] : []),
    ...(featuresText ? [{ "@type": "PropertyValue", name: "Features", value: featuresText }] : []),
  ];

  return {
    "@type": "Vehicle",
    "@id": `${url}#vehicle`,
    name: title,
    url,
    ...(item.sku && { sku: item.sku }),
    bodyType: "Campervan",
    ...(makeSlug && { brand: { "@type": "Brand", name: brandLabel(makeSlug) } }),
    ...(model && { model }),
    ...(year && { vehicleModelDate: year }),
    ...(fuel && { fuelType: fuel }),
    ...(transmission && { vehicleTransmission: transmission }),
    ...(displacement && {
      vehicleEngine: {
        "@type": "EngineSpecification",
        engineDisplacement: { "@type": "QuantitativeValue", value: Number(displacement[1]), unitCode: "LTR" },
      },
    }),
    ...(additionalProperty.length > 0 && { additionalProperty }),
    ...(images.length > 0 && { image: images }),
    itemCondition: condition,
    ...(price > 0 && {
      offers: {
        "@type": "Offer",
        url,
        price,
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        itemCondition: condition,
      },
    }),
  };
}

/** A /listings/{make}/{model}/ page with no other filter (state/price/etc.)
 * is effectively a model page — Ahrefs expects Product schema there even
 * though the backend may return more than one matching unit. Built from the
 * cheapest matching item's offer (single Offer) or, with several, an
 * AggregateOffer spanning their price range — never attached to a generic
 * multi-item listing page (e.g. a price band), which isn't one product. */
function buildModelProductLd(
  make: string,
  model: string,
  products: Item[],
  pageUrl: string
) {
  const prices = products
    .map((p) => Number(cleanPrice(p.sale_price && p.sale_price !== "" ? p.sale_price : p.regular_price)))
    .filter((n) => !isNaN(n) && n > 0);
  const images =
    products[0]?.image_format && products[0].image_format.length > 0
      ? products[0].image_format.slice(0, 5)
      : products[0]?.image
      ? [products[0].image]
      : [];

  const offers =
    prices.length === 0
      ? undefined
      : prices.length === 1 || products.length === 1
      ? { "@type": "Offer", url: pageUrl, priceCurrency: "AUD", price: prices[0], availability: "https://schema.org/InStock" }
      : {
          "@type": "AggregateOffer",
          priceCurrency: "AUD",
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: products.length,
        };

  return {
    "@type": "Product",
    name: `${slugToTitleCase(make)} ${slugToTitleCase(model)}`,
    brand: { "@type": "Brand", name: slugToTitleCase(make) },
    ...(images.length > 0 && { image: images }),
    ...(offers && { offers }),
  };
}

type ListingsFilters = {
  make?: string; model?: string; state?: unknown; region?: unknown; category?: unknown;
  suburb?: unknown; from_price?: unknown; to_price?: unknown; minKg?: unknown; maxKg?: unknown;
  from_length?: unknown; to_length?: unknown; from_sleep?: unknown; to_sleep?: unknown;
  condition?: unknown; search?: unknown; keyword?: unknown;
};

export async function buildListingsJsonLd(
  response: ApiResponse,
  pageUrl: string,
  breadcrumbs: { name: string; url: string }[],
  filters: ListingsFilters = {}
) {
  const pageTitle =
    response?.seo_v2?.h1 ||
    response?.seo_v2?.meta_title ||
    "Campervans for Sale in Australia";

  const allProducts = [
    ...(response.data?.products || []),
    ...(response.data?.emp_exclusive_products || []),
  ];

  // "Model page" = make + model and nothing else narrowing the result further.
  const isModelOnlyPage =
    !!filters.make &&
    !!filters.model &&
    !filters.state && !filters.region && !filters.category && !filters.suburb &&
    !filters.from_price && !filters.to_price && !filters.minKg && !filters.maxKg &&
    !filters.from_length && !filters.to_length && !filters.from_sleep && !filters.to_sleep &&
    !filters.condition && !filters.search && !filters.keyword;

  const shortDescription = response?.seo_v2?.short_description
    ? stripHtml(response.seo_v2.short_description)
    : "";
  const pageDescription = shortDescription || response?.seo_v2?.meta_description || "";

  const faqItems = parseFaq(response?.seo_v2?.faq);

  const taxonomy = allProducts.length > 0 ? await getTaxonomy() : { makes: [], vehicleMakes: [], models: [] };
  const siteId = `${BASE_URL}/#website`;
  const webPageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const itemListId = `${pageUrl}#itemlist`;
  // The CollectionPage name carries the live count ("37 Campervans for Sale in …");
  // the list's own name is the plain heading, as page 1 of the results.
  const listName = pageTitle.replace(/^d[d,]*s+/, "");

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": siteId,
        url: `${BASE_URL}/`,
        name: "Campervans For Sale",
        inLanguage: "en-AU",
      },
      {
        "@type": "CollectionPage",
        "@id": webPageId,
        url: pageUrl,
        name: pageTitle,
        ...(pageDescription && { description: pageDescription }),
        inLanguage: "en-AU",
        isPartOf: { "@id": siteId },
        breadcrumb: { "@id": breadcrumbId },
        ...(allProducts.length > 0 && { mainEntity: { "@id": itemListId } }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
      ...(allProducts.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": itemListId,
              name: `${listName} – Page 1`,
              numberOfItems: allProducts.length,
              itemListOrder: "https://schema.org/ItemListUnordered",
              itemListElement: allProducts.map((item, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: item.link,
                item: buildVehicleLd(item, taxonomy),
              })),
            },
          ]
        : []),
      ...(isModelOnlyPage && allProducts.length > 0
        ? [buildModelProductLd(filters.make!, filters.model!, allProducts, pageUrl)]
        : []),
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: stripHtml(f.q),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: stripHtml(f.a),
                },
              })),
            },
          ]
        : []),
    ],
  };

  return { collectionPageLd };
}

// React.cache deduplicates within a single request; the 1hr cross-request cache
// is handled by headPoolCache above.
const fetchListingsForHead = cache(
  async (pathnameKey: string): Promise<ApiResponse | null> => {
    try {
      if (pathnameKey === "/listings/") {
        return await fetchPoolListingsForHead({}, 1);
      }
      const slugString = pathnameKey
        .replace(/^\/listings\//, "")
        .replace(/\/$/, "");
      const slugParts = slugString.split("/").filter(Boolean);
      const rawFilters = parseSlugToFilters(slugParts, {});
      const page = rawFilters.page ? Number(rawFilters.page) : 1;
      return await fetchPoolListingsForHead(rawFilters, page);
    } catch {
      return null;
    }
  }
);

export function buildBreadcrumbs(pathname: string): { name: string; url: string }[] {
  const crumbs: { name: string; url: string }[] = [
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Campervans for Sale", url: `${BASE_URL}/listings/` },
  ];
  if (pathname === "/listings/" || pathname === "/listings") return crumbs;

  const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
  const slugParts = slugString.split("/").filter(Boolean);
  slugParts.forEach((segment, i) => {
    const label = segment
      .replace(/-(category|state|region|condition|search|suburb)$/, "")
      .replace(/[-+]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      name: label,
      url: `${BASE_URL}/listings/${slugParts.slice(0, i + 1).join("/")}/`,
    });
  });
  return crumbs;
}

export default fetchListingsForHead;
