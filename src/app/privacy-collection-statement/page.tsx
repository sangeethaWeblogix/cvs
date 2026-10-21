import { Metadata } from "next";
import Statement from "./statement";
import "./statement.css?=123";

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = "Privacy Collection Statement - Marketplace Network";
  const metaDescription =
    "Learn how Marketplace Network Pty Ltd collects and uses personal information when you submit enquiries or interact with our marketplace websites.";

  const robots = "index";

  return {
    title: metaTitle,
    description: metaDescription,
    robots: robots,

    alternates: {
      canonical: "https://www.campervansforsale.au/privacy-collection-statement/",
    },

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://www.campervansforsale.au/privacy-collection-statement/",
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
