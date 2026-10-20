 "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { obfuscateUrl, parseObfuscatedResponse } from "@/lib/obfuscation";

const MAJOR_CITIES = [
  { name: "Adelaide",   state: "south-australia",     region: "adelaide",     href: "/listings/south-australia-state/adelaide-region/",    imgSrc: "/images/Adelaide.png"   },
  { name: "Brisbane",   state: "queensland",          region: "brisbane",     href: "/listings/queensland-state/brisbane-region/",         imgSrc: "/images/Brisbane.png"   },
  { name: "Gold Coast", state: "queensland",          region: "gold-coast",   href: "/listings/queensland-state/gold-coast-region/",       imgSrc: "/images/Gold-Coast.png" },
  { name: "Melbourne",  state: "victoria",            region: "melbourne",    href: "/listings/victoria-state/melbourne-region/",          imgSrc: "/images/Melbourne.png"  },
  { name: "Perth",      state: "western-australia",   region: "perth",        href: "/listings/western-australia-state/perth-region/",     imgSrc: "/images/Perth.png"      },
  { name: "Sydney",     state: "new-south-wales",     region: "sydney",       href: "/listings/new-south-wales-state/sydney-region/",      imgSrc: "/images/Sydney.png"     },
];

const MINOR_CITIES = [
  { name: "Cairns",         state: "queensland",                     region: "cairns",                         href: "/listings/queensland-state/cairns-region/" },
  { name: "Canberra",       state: "australian-capital-territory",   region: "australian-capital-territory",   href: "/listings/australian-capital-territory-state/australian-capital-territory-region/" },
  { name: "Darwin",         state: "northern-territory",             region: "darwin",                         href: "/listings/northern-territory-state/darwin-region/" },
  { name: "Geelong",        state: "victoria",                       region: "geelong",                        href: "/listings/victoria-state/geelong-region/" },
  { name: "Hobart",         state: "tasmania",                       region: "hobart",                         href: "/listings/tasmania-state/hobart-region/" },
  { name: "Newcastle",      state: "new-south-wales",                region: "newcastle",                      href: "/listings/new-south-wales-state/newcastle-region/" },
  { name: "Sunshine Coast", state: "queensland",                     region: "sunshine-coast",                 href: "/listings/queensland-state/sunshine-coast-region/" },
  { name: "Townsville",     state: "queensland",                     region: "townsville",                     href: "/listings/queensland-state/townsville-region/" },
  { name: "Wollongong",     state: "new-south-wales",                region: "illawarra",                      href: "/listings/new-south-wales-state/illawarra-region/" },
  { name: "Ballarat",       state: "victoria",                       region: "ballarat",                       href: "/listings/victoria-state/ballarat-region/" },
];

const FILTERS = [
  {
    icon: <Image src="/images/Budget.png" alt="Budget" width={24} height={24} unoptimized />,
    label: "By Price",
    items: [
      { text: "Under $50,000",        href: "/listings/under-50000/" },
      { text: "$50,000 – $70,000",    href: "/listings/between-50000-70000/" },
      { text: "$70,000 – $80,000",    href: "/listings/between-70000-80000/" },
      { text: "$80,000 – $100,000",   href: "/listings/between-80000-100000/" },
      { text: "$100,000 – $150,000",  href: "/listings/between-100000-150000/" },
      { text: "$150,000 – $200,000",  href: "/listings/between-150000-200000/" },
      { text: "$200,000 – $250,000",  href: "/listings/between-200000-250000/" },
      { text: "Over $250,000",        href: "/listings/over-250000/" },
    ],
  },
  {
    icon: <Image src="/images/ATM.png" alt="Weight GVM" width={24} height={24} unoptimized />,
    label: " By Weight (GVM)",
    items: [
      { text: "Under 3000kg",   href: "/listings/under-3000-kg-gvm/" },
      { text: "Under 3500kg",   href: "/listings/under-3500-kg-gvm/" },
      { text: "Under 4000kg",   href: "/listings/under-4000-kg-gvm/" },
      { text: "Over 4000kg",    href: "/listings/over-4000-kg-gvm/" },
    ],
  },
  {
    icon: <Image src="/images/Length.png" alt="Length" width={24} height={24} unoptimized />,
    label: "By Size (Length)",
    items: [
      { text: "Under 16ft",     href: "/listings/under-16-length-in-feet/" },
      { text: "16ft – 18ft",    href: "/listings/between-16-18-length-in-feet/" },
      { text: "18ft – 20ft",    href: "/listings/between-18-20-length-in-feet/" },
      { text: "20ft – 22ft",    href: "/listings/between-20-22-length-in-feet/" },
      { text: "Over 22ft",      href: "/listings/over-22-length-in-feet/" },
    ],
  },
  {
    icon: <Image src="/images/Sleeping.png" alt="Sleeping" width={24} height={24} unoptimized />,
    label: "By Sleeping Capacity",
    items: [
      { text: "2 Berth",     href: "/listings/2-people-sleeping-capacity/" },
      { text: "3 Berth",     href: "/listings/3-people-sleeping-capacity/" },
      { text: "4 Berth",     href: "/listings/4-people-sleeping-capacity/" },
      { text: "5 Berth",     href: "/listings/5-people-sleeping-capacity/" },
      { text: "6+ Berth",     href: "/listings/over-5-people-sleeping-capacity/" },
      
      
    ],
  },
];


/** Live region counts, grouped by state — fetched once per unique state
 * across MAJOR_CITIES/MINOR_CITIES. A city's link is hidden while its
 * state/region combo has zero current listings, and reappears automatically
 * the next time this count is fetched (page load) after it has stock again —
 * no manual re-enabling needed. */
function useLiveRegionCounts(states: string[]) {
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

export default function HomeLocationSection() {
  const allStates = Array.from(new Set([...MAJOR_CITIES, ...MINOR_CITIES].map((c) => c.state)));
  const regionCounts = useLiveRegionCounts(allStates);

  const hasStock = (city: { state: string; region: string }) =>
    regionCounts === null || (regionCounts[`${city.state}:${city.region}`] ?? 0) > 0;

  const majorCities = MAJOR_CITIES.filter(hasStock);
  const minorCities = MINOR_CITIES.filter(hasStock);

  return (
    <section className="hloc-section">
      <div className="container">

        <div className="hloc-header">
          <h2 className="hloc-title">
            Find Campervans for Sale by <span className="hloc-title-accent">Popular Location</span>
          </h2>
          <p className="hloc-subtitle">Browse campervans for sale near you by major Australian cities.</p>
          
        </div>

        <div className="hloc-major-grid">
          {majorCities.map((city) => (
            <a key={city.name} href={city.href} className="hloc-city-card">
              <div className="hloc-city-img-wrap">
                <div className="hloc-city-circle" />
                <Image
                  src={city.imgSrc}
                  alt={city.name}
                  width={110}
                  height={80}
                  className="hloc-city-img"
                  unoptimized
                />
              </div>
              <h3 className="hloc-city-name">
                {city.name} <span className="hloc-city-arrow"></span>
              </h3>
            </a>
          ))}
        </div>

        <div className="hloc-minor-wrap">
          {minorCities.map((city, idx) => (
            <a
              key={city.name}
              href={city.href}
              className={`hloc-minor-pill${idx === 0 ? " hloc-minor-pill--active" : ""}`}
            >
              <h3>{city.name}</h3>
            </a>
          ))}
        </div>
<div className="hloc-header">
  <h2 className="hloc-title">
           Search Campervans for Sale <span className="hloc-title-accent">Your Way</span>
          </h2>
   
        </div>
        <div className="hloc-filters">
          
          {FILTERS.map((f) => (
            <div key={f.label} className="hloc-filter-row">
              <div className="hloc-filter-label">
                <span className="hloc-filter-icon-box">{f.icon}</span>
                <span className="hloc-filter-text">{f.label}</span>
              </div>
              <div className="hloc-filter-chips">
                <h3>
                {f.items.map((item,) => (

                  <a key={item.text} href={item.href} className="hloc-chip">
                   {item.text}</a>
                ))}
                </h3>
              </div>
            </div>
          ))}
        </div>
 
        

      </div>
    </section>
  );
}
