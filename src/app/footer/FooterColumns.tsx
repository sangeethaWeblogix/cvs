import { STATES, toStateSlug, type CountItem } from "@/app/listings/browseSectionShared";
import FooterPopularLocations from "./FooterPopularLocations";
import FooterSellByLocationLink from "./FooterSellByLocationLink";

interface Props {
  initialRegionCounts?: Record<string, number> | null;
  /** Live state + new/used counts (fetchFooterLinkCounts) — links whose page
   * would be empty (410) are left out and return once stock arrives. */
  linkCounts?: { stateCounts: CountItem[]; conditionCounts: Record<string, number> } | null;
}

export default function FooterColumns({ initialRegionCounts, linkCounts }: Props) {
  const stateCounts = linkCounts?.stateCounts;
  // Empty stateCounts = unknown (API down) — keep every state then.
  const states = STATES.filter((s) =>
    !stateCounts?.length || stateCounts.some((c) => c.slug === toStateSlug(s.name) && c.count > 0)
  );
  const hasCondition = (condition: string) => !linkCounts || (linkCounts.conditionCounts[condition] ?? 0) > 0;

  return (
    <div className="foot-cols">
      <div className="foot-col">
        <h4 className="foot-col__title">Browse Campervans</h4>
        <ul className="foot-col__list">
          <li><a href="/listings/">All Campervans for Sale</a></li>
          {hasCondition("new") && <li><a href="/listings/new-condition/">New Campervans</a></li>}
          {hasCondition("used") && <li><a href="/listings/used-condition/">Used Campervans</a></li>}
        </ul>
      </div>

      <div className="foot-col">
        <h4 className="foot-col__title">Browse by State</h4>
        <ul className="foot-col__list">
          {states.map((s) => (
            <li key={s.href}><a href={s.href}>{s.name}</a></li>
          ))}
        </ul>
      </div>

      <FooterPopularLocations initialCounts={initialRegionCounts} />

      <div className="foot-col">
        <h4 className="foot-col__title">Private Sellers</h4>
        <ul className="foot-col__list">
          <li><a href="/sell-my-campervan/">Sell My Campervan</a></li>
          <li><FooterSellByLocationLink /></li>
          <li><a href="https://seller.marketplacenetwork.com.au/seller-login/">Seller Login</a></li>
        </ul>

        <h4 className="foot-col__title foot-col__title--spaced">For Dealers</h4>
        <ul className="foot-col__list">
          <li><a href="https://seller.marketplacenetwork.com.au/subscriber-login/">Dealer Login</a></li>
          <li><a href="/dealer-advertising/">Dealer Advertising</a></li>
          <li><a href="https://seller.marketplacenetwork.com.au/campervan-dealer-subscription/">Dealer Sign Up</a></li>
        </ul>
      </div>

      <div className="foot-col">
        <h4 className="foot-col__title">Guides &amp; Support</h4>
        <ul className="foot-col__list">
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/buyer-safety-guide/">Buyer Safety Guide</a></li>
          <li><a href="/about-us/">About Us</a></li>
          <li><a href="/contact/">Contact Us</a></li>
        </ul>
      </div>
    </div>
  );
}
