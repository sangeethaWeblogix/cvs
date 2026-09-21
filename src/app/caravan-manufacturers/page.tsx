// export const dynamic = "force-dynamic"
;

import Header from "./Header";
import Middle from "./Middle";
import FaqSection from "./FaqSection";
import "./comman.css?=1";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campervan Manufacturers in Australia | Brands & Builders",
  description:
    "Explore campervan manufacturers across Australia. Find trusted builders of off-road, luxury, hybrid, pop top and touring campervans for every budget and lifestyle.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.motorhomesforsale.com.au/caravan-manufacturers/",
  },
  openGraph: {
    title: "Campervan Manufacturers in Australia | Brands & Builders",
    description:
      "Explore campervan manufacturers across Australia. Find trusted builders of off-road, luxury, hybrid, pop top and touring campervans for every budget and lifestyle.",
    url: "https://www.motorhomesforsale.com.au/caravan-manufacturers/",
    images: [
      {
        url: "https://www.motorhomesforsale.com.au/images/mfs-logo.png",
        width: 800,
        height: 600,
        alt: "Campervan Manufacturers Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campervan Manufacturers in Australia | Brands & Builders",
    description:
      "Explore campervan manufacturers across Australia. Find trusted builders of off-road, luxury, hybrid, pop top and touring campervans for every budget and lifestyle.",
  },
};

export default function Home() {
  return (
    <div>
      <Header />
      <Middle />
      <FaqSection />
    </div>
  );
}
