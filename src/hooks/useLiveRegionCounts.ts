"use client";

import { useEffect, useState } from "react";
import { obfuscateUrl, parseObfuscatedResponse } from "@/lib/obfuscation";

/** Live region counts, grouped by state — fetched once per unique state.
 * Returns a `{state}:{region}` -> count map, or null while loading (callers
 * should treat null as "show everything" so nothing flashes empty before
 * the fetch resolves). Used anywhere a static list of state/region links
 * needs to hide entries that currently have zero live listings, and show
 * them again automatically once that region has stock. */
export function useLiveRegionCounts(states: string[]) {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      states.map(async (state) => {
        try {
          const qs = new URLSearchParams({ group_by: "region", state });
          const res = await fetch(obfuscateUrl(`/api/d2/?${qs.toString()}`));
          const json = await parseObfuscatedResponse<{ data?: { region?: { slug: string; count: number }[] } }>(res);
          return { state, regions: json?.data?.region ?? [] };
        } catch {
          return { state, regions: [] };
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const map: Record<string, number> = {};
      for (const { state, regions } of results) {
        for (const r of regions) map[`${state}:${r.slug}`] = r.count;
      }
      setCounts(map);
    });
    return () => { cancelled = true; };
  }, [states.join(",")]);

  return counts;
}
