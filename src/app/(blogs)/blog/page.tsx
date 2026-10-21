import Blogs from "./page/[page]/BlogListClient";
import "./blog.css?=3";
import { Metadata } from "next";
import { fetchBlogs } from "@/api/blog/api";

export const metadata: Metadata = {
  title: { default: "Latest News, Reviews & Advice", template: "%s " },
  description:
    "Latest news, in-depth reviews, and expert advice on the latest in the campervan market. Stay informed and make smarter decisions.",
  icons: { icon: "/favicon.ico" },
  robots: "index, follow",
  alternates: {
    canonical: "https://www.campervansforsale.au/blog/",

   },
  openGraph: {
    title: "Latest News, Reviews & Advice",
    description:
      "Latest news, in-depth reviews, and expert advice on the latest in the campervan market. Stay informed and make smarter decisions.",
    url: "https://www.campervansforsale.au/blog/",
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
    title: "Latest News, Reviews & Advice",
    description:
      "Latest news, in-depth reviews, and expert advice on the latest in the campervan market. Stay informed and make smarter decisions.",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const data = await fetchBlogs(1);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Campervans for Sale Blog",
      description:
        "Latest news, in-depth reviews, and expert advice on the latest in the campervan market.",
      url: "https://www.campervansforsale.au/blog/",
      publisher: {
        "@type": "Organization",
        name: "Campervans for Sale",
        url: "https://www.campervansforsale.au",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.campervansforsale.au/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.campervansforsale.au/blog/" },
      ],
    },
    ...(data.items.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Latest Blog Posts",
            itemListElement: data.items.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: post.link,
              name: post.title,
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Blogs data={data} currentPage={1} />
    </>
  );
}
