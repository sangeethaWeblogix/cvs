"use client";

import { useState } from "react";
import { POPULAR_REGION_PATHS } from "@/app/listings/browseSectionShared";
import { useLiveRegionCounts } from "@/hooks/useLiveRegionCounts";

const PREVIEW_COUNT = 7;

const PARSED_PATHS = POPULAR_REGION_PATHS.map((l) => {
  const [stateSeg, regionSeg] = l.path.split("/");
  return { ...l, state: stateSeg.replace(/-state$/, ""), region: regionSeg.replace(/-region$/, "") };
});

export default function FooterPopularLocations() {
  const [expanded, setExpanded] = useState(false);
  const allStates = Array.from(new Set(PARSED_PATHS.map((l) => l.state)));
  const regionCounts = useLiveRegionCounts(allStates);

  const livePaths = PARSED_PATHS.filter(
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
