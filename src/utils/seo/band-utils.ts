// Edge-runtime-safe: no fs, path, or process.cwd()
//
// These allowlists need to cover every band slug that any OTHER part of the
// site can actually generate a link to, or that page gets marked noindex
// despite having real, indexed-in-sitemap stock. There are 2 other band-slug
// sources that don't share thresholds with this file's original list:
//   - browseSectionShared.ts's PRICE_BANDS/GVM_BANDS/LENGTH_BANDS/SLEEP_BANDS
//     (the live "Browse by Price/Weight/Size/Sleeping Capacity" UI pills)
//   - attributes-others-sitemap.xml's PRICE_PATHS/GVM_PATHS/LENGTH_PATHS/
//     SLEEP_PATHS (live-count-filtered, so anything it lists already has
//     real stock)
// Both are merged in below rather than replacing the original list, so nothing
// previously allowed stops being allowed.

export const PRICE_BANDS_ORDERED = [
  "under-10000",
  "between-10000-20000",
  "under-20000",
  "between-20000-30000",
  "under-30000",
  "between-30000-40000",
  "under-40000",
  "between-40000-50000",
  "under-50000",
  "between-50000-60000",
  "under-60000",
  "between-60000-70000",
  "under-70000",
  "between-70000-80000",
  "under-80000",
  "between-80000-90000",
  "under-90000",
  "between-90000-100000",
  "under-100000",
  "between-100000-125000",
  "under-125000",
  "between-125000-150000",
  "under-150000",
  "between-150000-175000",
  "under-175000",
  "between-175000-200000",
  "under-200000",
  "between-200000-225000",
  "under-225000",
  "between-225000-250000",
  "under-250000",
  "between-250000-275000",
  "under-275000",
  "between-275000-300000",
  "under-300000",
  "over-200000",
  // browseSectionShared.ts PRICE_BANDS
  "under-30000",
  "between-30000-40000",
  "between-40000-50000",
  "between-50000-70000",
  "between-70000-80000",
  "between-80000-100000",
  "over-100000",
  // attributes-others-sitemap.xml PRICE_PATHS
  "between-100000-150000",
  "between-150000-200000",
  "between-200000-300000",
  "over-300000",
];

export const GVM_BANDS_ORDERED = [
  "under-600-kg-gvm",
  "under-800-kg-gvm",
  "under-1000-kg-gvm",
  "under-1250-kg-gvm",
  "under-1500-kg-gvm",
  "under-1750-kg-gvm",
  "under-2000-kg-gvm",
  "under-2250-kg-gvm",
  "under-2500-kg-gvm",
  "under-2750-kg-gvm",
  "under-3000-kg-gvm",
  "under-3500-kg-gvm",
  "under-4000-kg-gvm",
  "under-4500-kg-gvm",
  "over-3500-kg-gvm",
  // browseSectionShared.ts GVM_BANDS
  "under-2000-kg-gvm",
  "under-2500-kg-gvm",
  "under-3000-kg-gvm",
  "over-3000-kg-gvm",
  // attributes-others-sitemap.xml GVM_PATHS
  "between-3500-kg-4500-kg-gvm",
  "between-4500-kg-6000-kg-gvm",
  "between-6000-kg-8000-kg-gvm",
  "over-8000-kg-gvm",
];

export const SLEEP_BANDS_ORDERED = [
  "under-2-people-sleeping-capacity",
  "between-2-2-people-sleeping-capacity",
  "under-3-people-sleeping-capacity",
  "between-3-3-people-sleeping-capacity",
  "under-4-people-sleeping-capacity",
  "between-4-4-people-sleeping-capacity",
  "under-5-people-sleeping-capacity",
  "between-5-5-people-sleeping-capacity",
  "between-6-6-people-sleeping-capacity",
  "over-5-people-sleeping-capacity",
  // browseSectionShared.ts SLEEP_BANDS / attributes-others-sitemap.xml SLEEP_PATHS
  // (both use this bare "N-people-sleeping-capacity" form)
  "2-people-sleeping-capacity",
  "3-people-sleeping-capacity",
  "4-people-sleeping-capacity",
  "5-people-sleeping-capacity",
];

export const LENGTH_BANDS_ORDERED = [
  "under-12-length-in-feet",
  "under-13-length-in-feet",
  "between-12-14-length-in-feet",
  "under-14-length-in-feet",
  "under-15-length-in-feet",
  "between-14-16-length-in-feet",
  "under-16-length-in-feet",
  "under-17-length-in-feet",
  "between-16-18-length-in-feet",
  "under-18-length-in-feet",
  "under-19-length-in-feet",
  "between-18-20-length-in-feet",
  "under-20-length-in-feet",
  "under-21-length-in-feet",
  "between-20-22-length-in-feet",
  "under-22-length-in-feet",
  "under-23-length-in-feet",
  "between-22-24-length-in-feet",
  "under-24-length-in-feet",
  "under-25-length-in-feet",
  "between-24-26-length-in-feet",
  "under-26-length-in-feet",
  "under-27-length-in-feet",
  "between-26-28-length-in-feet",
  "under-28-length-in-feet",
  "over-24-length-in-feet",
  // browseSectionShared.ts LENGTH_BANDS
  "over-22-length-in-feet",
  // attributes-others-sitemap.xml LENGTH_PATHS
  "between-20-23-length-in-feet",
  "between-23-26-length-in-feet",
  "between-26-30-length-in-feet",
  "over-30-length-in-feet",
];

export const ALLOWED_PRICE_BANDS  = new Set(PRICE_BANDS_ORDERED);
export const ALLOWED_GVM_BANDS    = new Set(GVM_BANDS_ORDERED);
export const ALLOWED_SLEEP_BANDS  = new Set(SLEEP_BANDS_ORDERED);
export const ALLOWED_LENGTH_BANDS = new Set(LENGTH_BANDS_ORDERED);

export function isAllowedSingleBand(slugSegments: string[]): boolean {
  const price  = slugSegments.find(s => /^(under|over)-\d+$/.test(s) || /^between-\d+-\d+$/.test(s));
  const gvm    = slugSegments.find(s => s.includes("-kg-gvm"));
  const sleep  = slugSegments.find(s => s.includes("-people-sleeping-capacity"));
  const length = slugSegments.find(s => s.includes("-length-in-feet"));
  if (price)  return ALLOWED_PRICE_BANDS.has(price);
  if (gvm)    return ALLOWED_GVM_BANDS.has(gvm);
  if (sleep)  return ALLOWED_SLEEP_BANDS.has(sleep);
  if (length) return ALLOWED_LENGTH_BANDS.has(length);
  return false;
}
