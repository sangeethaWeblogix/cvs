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
              <div className="foot-bottom__right">
                <p className="foot-bottom__copy">
                  &copy; {currentYear ?? "----"} Marketplace Network Pty Ltd &middot; ABN 70 694 987 052
                </p>
                <ul className="foot-social" aria-label="Follow us on social media">
                  <li>
                    <a
                      href="https://www.facebook.com/campervansforsale.au"
                      className="foot-social__btn foot-social__btn--facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="CampervansForSale.au on Facebook"
                    >
                      <svg fill="currentColor" viewBox="0 0 320 512" width="1em" height="1em" aria-hidden="true">
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/campervansforsale.au"
                      className="foot-social__btn foot-social__btn--instagram"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="CampervansForSale.au on Instagram"
                    >
                      <svg fill="currentColor" viewBox="0 0 448 512" width="1em" height="1em" aria-hidden="true">
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
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
