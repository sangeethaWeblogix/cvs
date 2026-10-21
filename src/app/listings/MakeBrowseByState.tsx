"use client";

import { useEffect, useState } from "react";
import { obfuscateUrl, parseObfuscatedResponse } from "@/lib/obfuscation";
import { STATES } from "./browseSectionShared";

interface Props {
  /** Campervan make slug (e.g. "jayco") — mutually exclusive with vehicleMake. */
  make?: string;
  /** Vehicle (chassis) make slug (e.g. "fiat") — mutually exclusive with make. */
  vehicleMake?: string;
  label: string;
}

/** Adds the missing internal links a plain make/vehicle-make page needs: a
 * "Browse {label} by State" list, live-filtered to states that currently
 * have stock. Purely additive — doesn't touch any existing browse/filter
 * component — added specifically so these make+state combo pages (already
 * in state-make-sitemap.xml / state-vehicle-make-sitemap.xml) have at least
 * one real on-site link pointing to them instead of being sitemap-only
 * orphans. */
export default function MakeBrowseByState({ make, vehicleMake, label }: Props) {
  const [stateCounts, setStateCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const param = make ? "campervan_make" : "vehicle_make";
    const value = make ?? vehicleMake ?? "";
    if (!value) return;

    const qs = new URLSearchParams({ group_by: "state", [param]: value });
    fetch(obfuscateUrl(`/api/d2/?${qs.toString()}`))
      .then((res) => parseObfuscatedResponse<{ data?: { state?: { slug: string; count: number }[] } }>(res))
      .then((json) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const s of json?.data?.state ?? []) map[s.slug] = s.count;
        setStateCounts(map);
      })
      .catch(() => { if (!cancelled) setStateCounts({}); });
    return () => { cancelled = true; };
  }, [make, vehicleMake]);

  if (stateCounts === null) return null;

  const base = make ? `/listings/${make}` : `/listings/${vehicleMake}-vehicle-make`;
  const links = STATES
    .map((s) => ({ name: s.name, slug: s.href.match(/\/listings\/([a-z-]+)-state\/$/)?.[1] ?? "", tail: s.href.replace("/listings/", "") }))
    .filter((s) => s.slug && (stateCounts[s.slug] ?? 0) > 0)
    .map((s) => ({ name: s.name, href: `${base}/${s.tail}` }));

  if (links.length === 0) return null;

  return (
    <section className="lsd-make-states">
      <div className="container">
        <h2 className="lsd-make-states__title">{`Browse ${label} by State`}</h2>
        <div className="lsd-make-states__pills">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="lsd-make-states__pill">{l.name}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
