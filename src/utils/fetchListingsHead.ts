


 import { cache } from "react";
import { parseSlugToFilters } from "@/app/components/urlBuilder";

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
};

type ApiResponse = {
  success?: boolean;
  seo_v2?: {
    h1?: string;
    meta_title?: string;
    meta_description?: string;
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
  if (filters.acustom_fromyears) params.set("acustom_fromyears", String(filters.acustom_fromyears));
  if (filters.acustom_toyears) params.set("acustom_toyears", String(filters.acustom_toyears));
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
  };
}

function parseLengthFt(raw: string): number {
  // handles "19'6 ft" (feet+inches) and "24.93 ft" (decimal feet)
  const feetInches = raw.match(/^(\d+)'(\d+)/);
  if (feetInches) return parseInt(feetInches[1]) + parseInt(feetInches[2]) / 12;
  return parseFloat(raw);
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

function buildProductListItem(item: Item, position: number) {
  const rawPrice = item.sale_price && item.sale_price !== "" ? item.sale_price : item.regular_price;
  const price = cleanPrice(rawPrice ?? "");
  const lengthFt = parseLengthFt(item.length ?? "");
  const widthMt =
    !isNaN(lengthFt) && lengthFt > 0
      ? (lengthFt * 0.3048).toFixed(2)
      : "";
  const images =
    item.image_format && item.image_format.length > 0
      ? item.image_format
          .slice(0, 5)
          .map((url) => ({ "@type": "ImageObject", url }))
      : item.image
      ? [{ "@type": "ImageObject", url: item.image }]
      : [];
  return {
    "@type": "ListItem",
    position,
    item: {
      "@type": "Vehicle",
      bodyType: item.categories && item.categories.length > 0
        ? item.categories.join(", ")
        : "",
      vehicleConfiguration: item.axle ?? "",
      width: {
        "@type": "QuantitativeValue",
        unitCode: "MT",
        value: widthMt,
      },
      url: item.link,
      name: item.name,
      model: item.model ?? "",
      brand: {
        "@type": "Brand",
        name: item.make ?? "",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "AUD",
        price: price,
      },
      image: images,
    },
  };
}

function slugToTitleCase(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

export function buildListingsJsonLd(
  response: ApiResponse,
  pageUrl: string,
  breadcrumbs: { name: string; url: string }[],
  filters: ListingsFilters = {}
) {
  const pageTitle =
    response?.seo_v2?.h1 ||
    response?.seo_v2?.meta_title ||
    "Campervans for Sale in Australia";
  const totalProducts = response?.pagination?.total_products ?? 0;

  const allProducts = [
    ...(response.data?.products || []),
    ...(response.data?.emp_exclusive_products || []),
  ];
const weburl = "https://www.campervansforsale.au"

  // "Model page" = make + model and nothing else narrowing the result further.
  const isModelOnlyPage =
    !!filters.make &&
    !!filters.model &&
    !filters.state && !filters.region && !filters.category && !filters.suburb &&
    !filters.from_price && !filters.to_price && !filters.minKg && !filters.maxKg &&
    !filters.from_length && !filters.to_length && !filters.from_sleep && !filters.to_sleep &&
    !filters.condition && !filters.search && !filters.keyword;

  const footerDescription = response?.seo_v2?.footer_description
    ? stripHtml(response.seo_v2.footer_description)
    : "";
  const pageDescription =
    footerDescription || response?.seo_v2?.meta_description || "";

  const faqItems = parseFaq(response?.seo_v2?.faq);

  const collectionPageLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: pageTitle,
        url: pageUrl,
        inLanguage: "en-AU",
        ...(pageDescription && { description: pageDescription }),
        ...(totalProducts > 0 && { numberOfItems: totalProducts }),
      },
      {
        "@type": "BreadcrumbList",
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
              itemListElement: allProducts.map((item, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: item.link,
                name: item.name,
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

  const searchResultsLd = {
    "@context": "https://schema.org/",
    "@type": "SearchResultsPage",
    audience: { "@type": "Audience", audienceType: "campervan buyers" },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: weburl },
    },
    mainEntity: {
      "@type": "OfferCatalog",
      numberOfItems: allProducts.length,
      itemListElement: allProducts.map((item, idx) =>
        buildProductListItem(item, idx + 1)
      ),
    },
  };

  return { collectionPageLd, searchResultsLd };
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
