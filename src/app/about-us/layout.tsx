 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "About Campervan Marketplace - Your Trusted Campervan Resource",
     template: "%s ",
   },
   description:
     "Campervan Marketplace is your go-to platform for finding the perfect campervan from the right manufacturer or dealer at the right price.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   alternates: {
    canonical: "https://www.motorhomesforsale.com.au/about-us/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
