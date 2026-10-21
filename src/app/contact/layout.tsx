 import "./contact.css";
import { Metadata } from "next";
import { ReactNode } from "react";



 export const metadata: Metadata = {
   title: {
     default: "Contact Campervans For Sale | Australia’s Campervan Marketplace",
     template: "%s ",
   },
   description:
     "Have a question about campervans in Australia? Contact Campervans For Sale for support, inquiries, or help finding your next campervan today.",
   icons: { icon: "/favicon.ico" },
   robots: "index, follow",
   alternates: {
    canonical: "https://www.campervansforsale.au/contact/",
   },
   openGraph: {
     title: "Contact Campervans For Sale | Australia’s Campervan Marketplace",
     description:
       "Have a question about campervans in Australia? Contact Campervans For Sale for support, inquiries, or help finding your next campervan today.",
     url: "https://www.campervansforsale.au/contact/",
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
     title: "Contact Campervans For Sale | Australia’s Campervan Marketplace",
     description:
       "Have a question about campervans in Australia? Contact Campervans For Sale for support, inquiries, or help finding your next campervan today.",
   },
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
