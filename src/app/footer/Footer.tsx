import "./footer.css?=20";
import BackToTopButton from "./BackToTopButton";
import FooterColumns from "./FooterColumns";
import FooterNetwork from "./FooterNetwork";
import FooterSellAccordion from "./FooterSellAccordion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="style-8">
        <div className="container">
          <div className="foot py-4 brd-gray">
            <FooterColumns />
            <FooterNetwork />
            <FooterSellAccordion />

            <div className="foot-bottom">
              <ul className="foot-bottom__links">
                <li><a href="/terms-conditions/" rel="nofollow">Terms &amp; Conditions</a></li>
                <li><a href="/privacy-policy/" rel="nofollow">Privacy Policy</a></li>
                <li><a href="/privacy-collection-statement/" rel="nofollow">Privacy Collection Statement</a></li>
                <li><a href="/cookie-policy/" rel="nofollow">Cookie Policy</a></li>
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
