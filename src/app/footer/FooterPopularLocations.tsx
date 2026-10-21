"use client";

import { useState } from "react";
import { PARSED_POPULAR_REGION_PATHS } from "@/app/listings/browseSectionShared";
import { useLiveRegionCounts } from "@/hooks/useLiveRegionCounts";

const PREVIEW_COUNT = 7;

interface Props {
  /** Server-fetched region counts (see fetchRegionCounts) — seeds the first
   * render so stock-less locations are already filtered out of the raw SSR
   * HTML instead of only disappearing after a client fetch resolves. */
  initialCounts?: Record<string, number> | null;
}

export default function FooterPopularLocations({ initialCounts }: Props) {
  const [expanded, setExpanded] = useState(false);
  const allStates = Array.from(new Set(PARSED_POPULAR_REGION_PATHS.map((l) => l.state)));
  const regionCounts = useLiveRegionCounts(allStates, initialCounts);

  const livePaths = PARSED_POPULAR_REGION_PATHS.filter(
    (l) => regionCounts === null || (regionCounts[`${l.state}:${l.region}`] ?? 0) > 0
  );
  const locations = expanded ? livePaths : livePaths.slice(0, PREVIEW_COUNT);

  return (
    <div className="foot-col">
      <h6 className="foot-col__title">Popular Locations</h6>
      <ul className="foot-col__list">
        {locations.map((l) => (
          <li key={l.path}><a href={`/listings/${l.path}`}>{l.name}</a></li>
        ))}
        {!expanded && (
          <li>
            <button type="button" className="foot-col__view-all" onClick={() => setExpanded(true)}>
              View All Locations
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
