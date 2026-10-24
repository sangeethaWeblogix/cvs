import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHubSection, getHubSectionMeta, hubLinkLabel } from "@/lib/siteMapHub";
import "../site-map.css";

export const dynamic = "force-dynamic";

type Params = Promise<{ section: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section } = await params;
  const meta = getHubSectionMeta(section);
  if (!meta) return {};
  return {
    title: `${meta.title} | Site Map | Campervans for Sale`,
    description: meta.description,
    alternates: { canonical: `https://www.campervansforsale.au/site-map/${meta.id}/` },
    robots: { index: true, follow: true },
  };
}

export default async function SiteMapSectionPage({ params }: { params: Params }) {
  const { section: id } = await params;
  const section = await getHubSection(id);
  if (!section) notFound();

  return (
    <div className="sm-page">
      <header className="sm-hero">
        <div className="container">
          <nav className="sm-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <a href="/site-map/">Site Map</a>
            <span className="sep">/</span>
            <span>{section.title}</span>
          </nav>
          <h1>{section.title}</h1>
        </div>
      </header>

      <div className="container">
        {section.groups.map((group) => (
          <section className="sm-group" key={group.heading}>
            <div className="sm-group__head">
              <h2>{group.heading}</h2>
              <span className="sm-count">{group.paths.length}</span>
            </div>

            {group.prefix === "product" ? (
              <ul className="sm-list">
                {group.paths.map((path) => (
                  <li key={path}>
                    <a href={`/${group.prefix}/${path}`}>{hubLinkLabel(path, group.prefix)}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="sm-pills">
                {group.paths.map((path) => (
                  <a className="sm-pill" href={`/${group.prefix}/${path}`} key={path}>
                    {hubLinkLabel(path, group.prefix)}
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
