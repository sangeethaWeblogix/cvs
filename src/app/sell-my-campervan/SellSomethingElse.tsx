interface Props {
  state?: string;
  region?: string;
}

const titleCase = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Cross-links to the sister marketplaces' own sell pages, scoped to the
 * current state/region only — mirrors ExploreOtherTravelOptions on the
 * buy side. */
export default function SellSomethingElse({ state, region }: Props) {
  const pathSuffix = state && region
    ? `${state}/${region}/`
    : state
      ? `${state}/`
      : "";

  const place = region ? titleCase(region) : state ? titleCase(state) : "";
  const heading = place
    ? `Have something other than a campervan to sell in ${place}?`
    : "Have something other than a campervan to sell?";

  return (
    <section className="sell-cross-section">
      <div className="container">
        <h2 className="sell-cross-title">{heading}</h2>
        <p className="sell-cross-body">
          You can{" "}
          <a href={`https://www.caravansforsale.com.au/sell-my-caravan/${pathSuffix}`} className="sell-cross-link" target="_blank" rel="noopener noreferrer">sell your caravan</a>
          ,{" "}
          <a href={`https://www.motorhomesforsale.com.au/sell-my-motorhome/${pathSuffix}`} className="sell-cross-link" target="_blank" rel="noopener noreferrer">sell your motorhome</a>
          {" "}or{" "}
          <a href={`https://www.campingtrailersforsale.com.au/sell-my-camper-trailer/${pathSuffix}`} className="sell-cross-link" target="_blank" rel="noopener noreferrer">sell your camper trailer</a>
          {" "}through our other marketplaces. Visit the relevant website to see your listing options and get started.
        </p>
      </div>
    </section>
  );
}
