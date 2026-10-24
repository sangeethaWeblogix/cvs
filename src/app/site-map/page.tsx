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

const ICONS: Record<string, string> = {
  locations: "bi-geo-alt-fill",
  makes: "bi-truck",
  "makes-by-location": "bi-pin-map-fill",
  "price-size-weight": "bi-sliders",
  products: "bi-grid-fill",
};

const OTHER_PAGES = [
  { href: "/", label: "Home" },
  { href: "/listings/", label: "All Campervans for Sale" },
  { href: "/sell-my-campervan/", label: "Sell My Campervan" },
  { href: "/dealer-advertising/", label: "Dealer Advertising" },
  { href: "/blog/", label: "Blog" },
  { href: "/buyer-safety-guide/", label: "Buyer Safety Guide" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact/", label: "Contact Us" },
];

export default function SiteMapPage() {
  const sections = listHubSections();

  return (
    <div className="sm-page">
      <header className="sm-hero">
        <div className="container">
          <nav className="sm-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <span>Site Map</span>
          </nav>
          <h1>Site Map</h1>
        </div>
      </header>

      <div className="container">
        <ul className="sm-cards">
          {sections.map((s) => (
            <li className="sm-card" key={s.id}>
              <a href={`/site-map/${s.id}/`}>
                <span className="sm-card__icon" aria-hidden="true">
                  <i className={`bi ${ICONS[s.id] ?? "bi-list-ul"}`} />
                </span>
                <span className="sm-card__title">{s.title}</span>
                <i className="bi bi-arrow-right sm-card__arrow" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <h2 className="sm-subtitle">Other Pages</h2>
        <div className="sm-other">
          {OTHER_PAGES.map((p) => (
            <a className="sm-pill" href={p.href} key={p.href}>{p.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
