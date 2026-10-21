import { Metadata } from "next";
import Statement from "./statement";
import "./statement.css?=123";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Buyer Safety Guide - CampervansForSale";
  const metaDescription =
    "Learn how to buy a campervan safely on CampervansForSale.au with our buyer checklist: VIN checks, PPSR searches, secure payments, and scam prevention tips.";

  const robots = "index";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: "https://www.campervansforsale.au/buyer-safety-guide/",
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://www.campervansforsale.au/buyer-safety-guide/",
      type: "article",
    },

    twitter: {
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default function Home() {
  return <Statement />;
}