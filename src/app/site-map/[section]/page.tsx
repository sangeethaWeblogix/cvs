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
    <section className="sm-wrap">
      <div className="container">
        <nav className="sm-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a> › <a href="/site-map/">Site Map</a> › {section.title}
        </nav>

        <h1>{section.title}</h1>
        <p className="sm-intro">{section.description}</p>

        {section.groups.map((group) => (
          <div className="sm-group" key={group.heading}>
            <h2>{group.heading}</h2>
            <ul className="sm-list">
              {group.paths.map((path) => (
                <li key={path}>
                  <a href={`/${group.prefix}/${path}`}>{hubLinkLabel(path, group.prefix)}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
