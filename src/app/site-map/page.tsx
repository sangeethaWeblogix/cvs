import type { Metadata } from "next";
import { getSiteMapContent, hubLinkLabel, type HubGroup } from "@/lib/siteMapHub";
import "./site-map.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Site Map | Campervans for Sale Australia",
  description:
    "Browse every section of CampervansForSale.au — campervans by state, region, make, model, price, size and weight.",
  alternates: { canonical: "https://www.campervansforsale.au/site-map/" },
  robots: { index: true, follow: true },
};

type LinkItem = { href: string; label: string };

const toLinks = (group: HubGroup): LinkItem[] =>
  group.paths.map((path) => ({
    href: `/${group.prefix}/${path}`,
    label: hubLinkLabel(path, group.prefix),
  }));

const CAMPERVANS_FOR_SALE: LinkItem[] = [
  { href: "/listings/", label: "All Campervans for Sale" },
  { href: "/listings/new-condition/", label: "New Campervans for Sale" },
  { href: "/listings/used-condition/", label: "Used Campervans for Sale" },
];

const SELL: LinkItem[] = [
  { href: "/sell-my-campervan/", label: "Sell My Campervan" },
  { href: "/dealer-advertising/", label: "Dealer Advertising" },
];

const NEWS_AND_INFO: LinkItem[] = [
  { href: "/blog/", label: "Campervan News and Reviews" },
  { href: "/buyer-safety-guide/", label: "Buyer Safety Guide" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact/", label: "Contact Us" },
];

function Subcategory({ heading, links, wide }: { heading: string; links: LinkItem[]; wide?: boolean }) {
  return (
    <div className={`subcategory${wide ? " subcategory--wide" : ""}`}>
      <h3 className="subcategory-heading">{heading}</h3>
      <ul className="subcategory-list">
        {links.map((l) => (
          <li className="subcategory-item" key={l.href}>
            <a className="subcategory-link" href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SiteMapPage() {
  const { buy, products } = await getSiteMapContent();

  return (
    <section className="sitemap">
      <div className="container">
        <h1 className="title">Site Map</h1>

        <div className="category">
          <h2 className="category-heading">Buy</h2>
          <div className="subcategories">
            <Subcategory heading="Campervans for Sale" links={CAMPERVANS_FOR_SALE} />
            {buy.map((group) => (
              <Subcategory key={group.heading} heading={group.heading} links={toLinks(group)} />
            ))}
          </div>
        </div>

        {products.length > 0 && (
          <div className="category">
            <h2 className="category-heading">All Campervans</h2>
            <div className="subcategories">
              {products.map((group) => (
                <Subcategory key={group.heading} heading={group.heading} links={toLinks(group)} wide />
              ))}
            </div>
          </div>
        )}

        <div className="category">
          <h2 className="category-heading">Sell</h2>
          <div className="subcategories">
            <Subcategory heading="Sell Your Campervan" links={SELL} />
          </div>
        </div>

        <div className="category">
          <h2 className="category-heading">News and Information</h2>
          <div className="subcategories">
            <Subcategory heading="Guides and Support" links={NEWS_AND_INFO} />
          </div>
        </div>
      </div>
    </section>
  );
}
