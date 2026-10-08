"use client";

export default function FooterSellByLocationLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const toggle = document.getElementById("foot-sell-accordion-toggle");
    const section = document.getElementById("foot-sell-accordion");
    if (toggle?.getAttribute("aria-expanded") === "false") {
      toggle.click();
    }
    // Let the panel expand first so the scroll lands on its final position.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  return (
    <a href="/sell-my-campervan/" onClick={handleClick}>
      Sell by Location
    </a>
  );
}
