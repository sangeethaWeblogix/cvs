import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sell My Campervan Online Australia | List Until Sold for $49",
  description:
    "Sell your campervan online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine campervan buyers.",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.campervansforsale.au/sell-my-campervan/",
  },
  openGraph: {
    title: "Sell My Campervan Online Australia | List Until Sold for $49",
    description:
      "Sell your campervan online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine campervan buyers.",
    url: "https://www.campervansforsale.au/sell-my-campervan/",
    siteName: "Campervans for Sale",
    images: [
      {
        url: "https://www.campervansforsale.au/images/cfs-logo-black.png",
        width: 1024,
        height: 240,
        alt: "Campervans for Sale Australia",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell My Campervan Online Australia | List Until Sold for $49",
    description:
      "Sell your campervan online across Australia for just $49. List until sold, edit anytime, pay no commission and connect directly with genuine campervan buyers.",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
