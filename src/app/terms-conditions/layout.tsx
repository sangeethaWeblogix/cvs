 import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Terms of Use – CampervansForSale.au | Marketplace Network",
     template: "%s ",
   },
   description:
     "Terms of Use for CampervansForSale.au, operated by Marketplace Network Pty Ltd (ABN 70 694 987 052) — listings, user responsibilities, and policies.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   alternates: {
    canonical: "https://www.campervansforsale.au/terms-conditions/",

   },

   openGraph: {
      url: "https://www.campervansforsale.au/terms-conditions/",
     title: "Terms of Use – CampervansForSale.au | Marketplace Network",
       description:
     "Terms of Use for CampervansForSale.au, operated by Marketplace Network Pty Ltd (ABN 70 694 987 052) — listings, user responsibilities, and policies.",
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
     title: "Terms of Use – CampervansForSale.au | Marketplace Network",
     description:
       "Terms of Use for CampervansForSale.au, operated by Marketplace Network Pty Ltd (ABN 70 694 987 052) — listings, user responsibilities, and policies.",
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
