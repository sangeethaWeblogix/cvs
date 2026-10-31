import "./footer.css?=20";
import BackToTopButton from "./BackToTopButton";
import FooterColumns from "./FooterColumns";
import FooterNetwork from "./FooterNetwork";
import FooterSellAccordion from "./FooterSellAccordion";
import { PARSED_POPULAR_REGION_PATHS } from "@/app/listings/browseSectionShared";
import { fetchRegionCounts } from "@/lib/fetchRegionCounts";
import { fetchFooterLinkCounts } from "@/app/listings/fetchBrowseSectionData";

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const allStates = Array.from(new Set(PARSED_POPULAR_REGION_PATHS.map((l) => l.state)));
  const [initialRegionCounts, linkCounts] = await Promise.all([
    fetchRegionCounts(allStates),
    fetchFooterLinkCounts(),
  ]);

  return (
    <>
      <footer className="style-8">
        <div className="container">
          <div className="foot py-4 brd-gray">
            <FooterColumns initialRegionCounts={initialRegionCounts} linkCounts={linkCounts} />
            <FooterNetwork />
            <FooterSellAccordion />

            <div className="foot-bottom">
              <ul className="foot-bottom__links">
                <li><a href="/terms-conditions/" rel="nofollow">Terms &amp; Conditions</a></li>
                <li><a href="/privacy-policy/" rel="nofollow">Privacy Policy</a></li>
                <li><a href="/privacy-collection-statement/" rel="nofollow">Privacy Collection Statement</a></li>
                <li><a href="/cookie-policy/" rel="nofollow">Cookie Policy</a></li>
                <li><a href="/site-map/">Site Map</a></li>
              </ul>
              <p className="foot-bottom__copy">
                &copy; {currentYear ?? "----"} Marketplace Network Pty Ltd &middot; ABN 70 694 987 052
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* To Top Button */}
      <BackToTopButton />
    </>
  );
};

export default Footer;
