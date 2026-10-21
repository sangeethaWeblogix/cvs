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
    canonical: "https://www.campervansforsale.au/about-us/",
   },
   openGraph: {
     title: "About Campervan Marketplace - Your Trusted Campervan Resource",
     description:
       "Campervan Marketplace is your go-to platform for finding the perfect campervan from the right manufacturer or dealer at the right price.",
     url: "https://www.campervansforsale.au/about-us/",
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
     title: "About Campervan Marketplace - Your Trusted Campervan Resource",
     description:
       "Campervan Marketplace is your go-to platform for finding the perfect campervan from the right manufacturer or dealer at the right price.",
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
