import { STATES } from "@/app/listings/browseSectionShared";
import FooterPopularLocations from "./FooterPopularLocations";
import FooterSellByLocationLink from "./FooterSellByLocationLink";

export default function FooterColumns() {
  return (
    <div className="foot-cols">
      <div className="foot-col">
        <h4 className="foot-col__title">Browse Campervans</h4>
        <ul className="foot-col__list">
          <li><a href="/listings/">All Campervans for Sale</a></li>
          <li><a href="/listings/new-condition/">New Campervans</a></li>
          <li><a href="/listings/used-condition/">Used Campervans</a></li>
        </ul>
      </div>

      <div className="foot-col">
        <h4 className="foot-col__title">Browse by State</h4>
        <ul className="foot-col__list">
          {STATES.map((s) => (
            <li key={s.href}><a href={s.href}>{s.name}</a></li>
          ))}
        </ul>
      </div>

      <FooterPopularLocations />

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
