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
    canonical: "https://www.motorhomesforsale.com.au/contact/",
   },
   
 
 };
 
   export default function Layout({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }
