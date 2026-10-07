interface Props {
  state?: string;
  region?: string;
}

const titleCase = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Cross-links to the sister marketplaces, scoped to the current state/
 * region filter only — every other filter (make, price, length, gvm, etc.)
 * is ignored so the destination is always a real page on those sites. */
export default function ExploreOtherTravelOptions({ state, region }: Props) {
  const path = state && region
    ? `/listings/${state}-state/${region}-region/`
    : state
      ? `/listings/${state}-state/`
      : "/listings/";

  const place = region ? titleCase(region) : state ? titleCase(state) : "Australia";

  return (
    <section className="lsd-explore-section">
      <div className="container">
        <div className="lsd-explore-inner">
          <h2 className="lsd-explore-title">{`Explore Other Travel Options in ${place}`}</h2>
          <p className="lsd-explore-body">
            Need more space than a campervan? Browse{" "}
            <a href={`https://www.motorhomesforsale.com.au${path}`} className="lsd-explore-link" target="_blank" rel="noopener noreferrer">motorhomes for sale</a>
            , or take a look at{" "}
            <a href={`https://www.caravansforsale.com.au${path}`} className="lsd-explore-link" target="_blank" rel="noopener noreferrer">caravans for sale</a>
            {" "}if you prefer to tow. You can also compare{" "}
            <a href={`https://www.campingtrailersforsale.com.au${path}`} className="lsd-explore-link" target="_blank" rel="noopener noreferrer">camper trailers for sale</a>
            {" "}for your next camping trip. You&apos;ll find these on our other marketplaces.
          </p>
        </div>
      </div>
    </section>
  );
}
