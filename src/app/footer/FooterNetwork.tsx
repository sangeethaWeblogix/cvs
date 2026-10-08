import Image from "next/image";

const SITES = [
  { name: "caravansforsale.com.au", href: "https://www.caravansforsale.com.au/", logo: "/images/our_sites/cfs-logo-black.svg", w: 160, h: 20 },
  { name: "motorhomesforsale.com.au", href: "https://www.motorhomesforsale.com.au/", logo: "/images/our_sites/mfs-logo.svg", w: 170, h: 20 },
  { name: "campervansforsale.au", href: "/", logo: "/images/our_sites/camper_logo.svg", w: 170, h: 21 },
  { name: "campingtrailersforsale.com.au", href: "https://www.campingtrailersforsale.com.au/", logo: "/images/our_sites/cts-logo.svg", w: 170, h: 21 },
];

export default function FooterNetwork() {
  return (
    <div className="foot-network">
      <h6 className="foot-col__title">Our Marketplace Network</h6>
      <div className="foot-network__grid">
        {SITES.map((s) =>
          s.href === "/" ? (
            <div key={s.name} className="foot-network__card foot-network__card--current" aria-label={s.name}>
              <Image src={s.logo} alt={s.name} width={s.w} height={s.h} unoptimized />
            </div>
          ) : (
            <a
              key={s.name}
              href={s.href}
              className="foot-network__card"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
            >
              <Image src={s.logo} alt={s.name} width={s.w} height={s.h} unoptimized />
            </a>
          )
        )}
      </div>
    </div>
  );
}
