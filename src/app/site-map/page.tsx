import type { Metadata } from "next";
import { listHubSections } from "@/lib/siteMapHub";
import "./site-map.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Map | Campervans for Sale Australia",
  description:
    "Browse every section of CampervansForSale.au — campervans by state, region, make, model, price, size and weight.",
  alternates: { canonical: "https://www.campervansforsale.au/site-map/" },
  robots: { index: true, follow: true },
};

export default function SiteMapPage() {
  const sections = listHubSections();

  return (
    <section className="sm-wrap">
      <div className="container">
        <h1>Site Map</h1>
        <p className="sm-intro">
          Every way to browse campervans for sale on CampervansForSale.au. Pick a section below to see all current
          listings and filters.
        </p>

        <ul className="sm-sections">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`/site-map/${s.id}/`}>{s.title}</a>
              <p>{s.description}</p>
            </li>
          ))}
        </ul>

        <div className="sm-group" style={{ marginTop: 36 }}>
          <h2>Other Pages</h2>
          <ul className="sm-list">
            <li><a href="/">Home</a></li>
            <li><a href="/listings/">All Campervans for Sale</a></li>
            <li><a href="/sell-my-campervan/">Sell My Campervan</a></li>
            <li><a href="/dealer-advertising/">Dealer Advertising</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/buyer-safety-guide/">Buyer Safety Guide</a></li>
            <li><a href="/about-us/">About Us</a></li>
            <li><a href="/contact/">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
