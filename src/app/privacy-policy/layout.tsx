 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Privacy Policy – Marketplace Network",
     template: "%s ",
   },
   description:
     "Read the Privacy Policy for Marketplace Network Pty Ltd (ABN 70 694 987 052) covering how we collect, use, and protect your personal information.",
   icons: { icon: "/favicon.ico" },
   robots: "index",
   alternates: {
    canonical: "https://www.campervansforsale.au/privacy-policy/",

   },
   
   openGraph: {
      url: "https://www.campervansforsale.au/privacy-policy/",
     title: "Privacy Policy - campervansforsale.au - Campervan Marketplace",
       description:
     "Learn about Campervan Marketplace's privacy policy on data collection, usage, security measures, and your rights regarding your information.",
     siteName: "Campervans for Sale",
     images: [
       {
         url: "https://www.campervansforsale.au/images/camper_logo.png",
         width: 600,
         height: 73,
         alt: "Campervans for Sale Australia",
       },
     ],
     type: "website",
   },
   twitter: {
     card: "summary_large_image",
     title: "Privacy Policy - campervansforsale.au - Campervan Marketplace",
     description:
       "Learn about Campervan Marketplace's privacy policy on data collection, usage, security measures, and your rights regarding your information.",
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
