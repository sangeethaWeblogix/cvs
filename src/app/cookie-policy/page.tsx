import { Metadata } from "next";
import Statement from "./statement";
import "./statement.css?=123";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Cookie Policy - Marketplace Network";
  const metaDescription =
    "Read our Cookie Policy for Marketplace Network Pty Ltd (ABN 70 694 987 052) covering how we collect, use, and protect your personal information.";

  const robots = "index";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: "https://www.campervansforsale.au/cookie-policy/",
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://www.campervansforsale.au/cookie-policy/",
      siteName: "Campervans for Sale",
      images: [
        {
          url: "https://www.campervansforsale.au/images/camper_logo.png",
          width: 600,
          height: 73,
          alt: "Campervans for Sale Australia",
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
    },
  };
}

export default function Home() {
  return <Statement />;
}