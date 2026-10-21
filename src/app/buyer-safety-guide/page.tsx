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

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Buyer Safety Guide",
  description:
    "Learn how to buy a campervan safely on CampervansForSale.au with our buyer checklist: VIN checks, PPSR searches, secure payments, and scam prevention tips.",
  image: "https://www.campervansforsale.au/images/camper_logo.png",
  datePublished: "2026-09-19",
  dateModified: "2026-10-21",
  author: { "@type": "Organization", name: "Campervans For Sale" },
  publisher: {
    "@type": "Organization",
    name: "Campervans For Sale",
    logo: { "@type": "ImageObject", url: "https://www.campervansforsale.au/images/camper_logo.png" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.campervansforsale.au/buyer-safety-guide/",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Statement />
    </>
  );
}