// Picks the filter-page link a product's spec value should point to. Only
// bands the backend sitemap API lists (so: real, stocked, indexable pages) are
// ever produced — never a value-specific URL like /under-2092-length-in-feet/
// or /under-4250-kg-gvm/, which middleware marks noindex. A product always has
// stock in the band it falls in, so the target is never an empty page.

const LENGTH_MIN = 12;
const LENGTH_MAX = 28;
const GVM_UNDER_STEPS = [2250, 2500, 2750, 3000, 3500];
const GVM_OVER_AT = 3500;

/** "20.92 ft" -> "/listings/under-21-length-in-feet/" */
export function lengthBandHref(feet: number): string {
  if (!Number.isFinite(feet) || feet <= 0) return "";
  const n = Math.ceil(feet);
  if (n > LENGTH_MAX) return `/listings/over-${LENGTH_MAX}-length-in-feet/`;
  return `/listings/under-${Math.max(n, LENGTH_MIN)}-length-in-feet/`;
}

/** "4250 Kg" -> "/listings/over-3500-kg-gvm/"; "3150 Kg" -> ".../under-3500-kg-gvm/" */
export function gvmBandHref(kg: number): string {
  if (!Number.isFinite(kg) || kg <= 0) return "";
  if (kg > GVM_OVER_AT) return `/listings/over-${GVM_OVER_AT}-kg-gvm/`;
  const step = GVM_UNDER_STEPS.find((s) => s >= kg) ?? GVM_UNDER_STEPS[0];
  return `/listings/under-${step}-kg-gvm/`;
}

/** "2 People" -> "/listings/2-people-sleeping-capacity/"; 6+ -> over-5 */
export function sleepBandHref(berths: number): string {
  if (!Number.isFinite(berths) || berths < 2) return "";
  if (berths > 5) return "/listings/over-5-people-sleeping-capacity/";
  return `/listings/${berths}-people-sleeping-capacity/`;
}

