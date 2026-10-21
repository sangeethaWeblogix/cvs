 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Campervan Dealer Advertising | Unlimited Listings $199/Month | CampervansForSale",
     template: "%s ",
   },
   description:
     "Advertise your campervan dealership on CampervansForSale.au. Unlimited listings, zero lead fees, and reach high-intent campervan buyers across Australia.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   alternates: {
    canonical: "https://www.campervansforsale.au/dealer-advertising/",
   },
   openGraph: {
     title: "Campervan Dealer Advertising | Unlimited Listings $199/Month | CampervansForSale",
     description:
       "Advertise your campervan dealership on CampervansForSale.au. Unlimited listings, zero lead fees, and reach high-intent campervan buyers across Australia.",
     url: "https://www.campervansforsale.au/dealer-advertising/",
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
     title: "Campervan Dealer Advertising | Unlimited Listings $199/Month | CampervansForSale",
     description:
       "Advertise your campervan dealership on CampervansForSale.au. Unlimited listings, zero lead fees, and reach high-intent campervan buyers across Australia.",
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
