 "use client";

import Image from "next/image";
import { useLiveRegionCounts } from "@/hooks/useLiveRegionCounts";
import {
  HOME_PRICE_BANDS,
  HOME_GVM_BANDS,
  HOME_LENGTH_BANDS,
  HOME_SLEEP_BANDS,
} from "../listings/browseSectionShared";

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
    items: HOME_PRICE_BANDS,
  },
  {
    icon: <Image src="/images/ATM.png" alt="Weight GVM" width={24} height={24} unoptimized />,
    label: " By Weight (GVM)",
    items: HOME_GVM_BANDS,
  },
  {
    icon: <Image src="/images/Length.png" alt="Length" width={24} height={24} unoptimized />,
    label: "By Size (Length)",
    items: HOME_LENGTH_BANDS,
  },
  {
    icon: <Image src="/images/Sleeping.png" alt="Sleeping" width={24} height={24} unoptimized />,
    label: "By Sleeping Capacity",
    items: HOME_SLEEP_BANDS,
  },
];


interface Props {
  /** Server-fetched region counts (see fetchRegionCounts) — seeds the first
   * render so stock-less cities are already filtered out of the raw SSR HTML
   * instead of only disappearing after a client fetch resolves. */
  initialCounts?: Record<string, number> | null;
  /** Server-fetched band availability (see fetchBandAvailability), keyed by
   * href — same reasoning as initialCounts but for the Price/Weight/Length/
   * Sleep filter chips below. */
  bandAvailability?: Record<string, boolean> | null;
}

export default function HomeLocationSection({ initialCounts, bandAvailability }: Props) {
  const allStates = Array.from(new Set([...MAJOR_CITIES, ...MINOR_CITIES].map((c) => c.state)));
  const regionCounts = useLiveRegionCounts(allStates, initialCounts);

  const hasStock = (city: { state: string; region: string }) =>
    regionCounts === null || (regionCounts[`${city.state}:${city.region}`] ?? 0) > 0;

  const majorCities = MAJOR_CITIES.filter(hasStock);
  const minorCities = MINOR_CITIES.filter(hasStock);

  const hasBandStock = (href: string) => !bandAvailability || bandAvailability[href] !== false;
  const visibleFilters = FILTERS
    .map((f) => ({ ...f, items: f.items.filter((item) => hasBandStock(item.href)) }))
    .filter((f) => f.items.length > 0);

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

          {visibleFilters.map((f) => (
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
