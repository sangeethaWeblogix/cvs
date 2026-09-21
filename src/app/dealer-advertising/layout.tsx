 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Campervan Dealer Advertising | Unlimited Listings $299/Month | MotorhomesForSale",
     template: "%s ",
   },
   description:
     "Advertise your campervan dealership on MotorhomesForSale.com.au. Unlimited listings, zero lead fees, and reach high-intent campervan buyers across Australia.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   alternates: {
    canonical: "https://www.motorhomesforsale.com.au/dealer-advertising/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
