
  // export const dynamic = "force-dynamic"

  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import "./globals.css?=42";
  import Navbar from "./navbar/Navbar";
  import NavbarSkeleton from "./navbar/NavbarSkeleton";
  import Footer from "./footer/Footer";
  import React, { Suspense } from "react";
  import Script from "next/script";
  import { Metadata } from "next";
  import { Montserrat } from "next/font/google";
  import ScrollToTop from "./navigation/ScrollToTopGlobal";
  import UTMTracker from "./UTMTracker";
  // import NextTopLoader from "nextjs-toploader";
import NavigationHistory from "@/components/NavigationHistory";
import { BannerProvider } from "@/components/BannerHandler";
import { fetchBanners } from "@/api/banners/api";
import GlobalErrorTracker from "@/components/GlobalErrorTracker";
import { headers } from "next/headers";
import { metaFromSlug } from "@/utils/seo/meta";
import fetchListingsForHead, { buildListingsJsonLd, buildBreadcrumbs } from "@/utils/fetchListingsHead";
import { parseSlugToFilters } from "@/app/components/urlBuilder";

  const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-montserrat",
    preload: true,
  });

  
  export const metadata: Metadata = {
    icons: { icon: "/favicon.ico" },
    // robots: "index, follow",
    verification: {
      google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo", // ✅ this auto generates <meta name="google-site-verification" />
    },

  };
  
  
  export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // Per-slug metadata for /listings/* pages — injected directly into <head> JSX
    // (avoids async generateMetadata + streaming = metadata-in-body issue in Next.js 15)
    const h = await headers();
    const pathname = h.get("x-pathname") ?? "";
    const xRobots = h.get("x-robots") ?? "";
    // Kicked off here, awaited just before render so it overlaps with the
    // listingsForHead fetch below instead of blocking on it.
    const bannersPromise = fetchBanners();
    const isListingSlug =
      pathname.startsWith("/listings/") &&
      pathname !== "/listings/" &&
      pathname !== "/listings";

    let slugTitle = "";
    let slugDescription = "";
    let slugCanonical = "";
    let slugRobots = "";

    const isContactPage = pathname === "/contact/" || pathname === "/contact";
    const isMainListings = pathname === "/listings/" || pathname === "/listings";

    // Static pages whose metadata ends up after </head> due to streaming — inject directly
    const STATIC_META: Record<string, { title: string; description: string; canonical: string }> = {};
    const staticMeta = STATIC_META[pathname] ?? null;

    // Listings JSON-LD — fetched here so both schemas render inside <head>
    // Second call hits Next.js data cache (revalidate: 3600), no extra network round-trip.
    let listingsCollectionLd: object | null = null;
    let listingsSearchResultsLd: object | null = null;
    if (isMainListings || isListingSlug) {
      const normalizedPath = pathname.endsWith("/") ? pathname : pathname + "/";
      const listingsData = await fetchListingsForHead(normalizedPath);
      if (listingsData) {
        const crumbs = buildBreadcrumbs(pathname);
        const pageUrl = `https://www.campervansforsale.au${normalizedPath}`;
        const slugParts = pathname.replace(/^\/listings\//, "").replace(/\/$/, "").split("/").filter(Boolean);
        const parsedFilters = isListingSlug ? parseSlugToFilters(slugParts, {}) : {};
        const { collectionPageLd, searchResultsLd } = buildListingsJsonLd(
          listingsData,
          pageUrl,
          crumbs,
          parsedFilters
        );
        listingsCollectionLd = collectionPageLd;
        listingsSearchResultsLd = searchResultsLd;
      }
    }

    if (isListingSlug) {
      const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
      const slugParts = slugString.split("/").filter(Boolean);

      // All SEO from metaFromSlug — pure computation, no API call
      const meta = await metaFromSlug(slugParts, {});
      slugCanonical = (meta.alternates?.canonical as string) ?? "";
      if (meta.title && typeof meta.title === "object" && "absolute" in meta.title) {
        slugTitle = (meta.title as { absolute: string }).absolute;
      }
      slugDescription = "Browse new and used campervans for sale across Australia. Compare prices, layouts, sleeping capacity and key specifications from dealers and private sellers.";

      // Robots: trust the middleware's live x-robots header (computed from
      // real-time stock + band-filter rules via the /pool API) over
      // metaFromSlug's static url.csv snapshot — the header reflects current
      // stock, the CSV can go stale and disagree with the X-Robots-Tag
      // response header a crawler actually sees.
      if (xRobots) {
        slugRobots = xRobots;
      } else if (meta.robots && typeof meta.robots === "object" && "index" in meta.robots) {
        slugRobots = (meta.robots as { index: boolean }).index ? "index, follow" : "noindex, nofollow";
      } else {
        slugRobots = "index, follow";
      }
    }

    const initialBanners = await bannersPromise;

    return (
      <html lang="en">
        <head>
          {/* Static pages SEO — injected here to avoid metadata-in-body streaming issue */}
          {staticMeta && <title>{staticMeta.title}</title>}
          {staticMeta && <meta name="description" content={staticMeta.description} />}
          {staticMeta && <link rel="canonical" href={staticMeta.canonical} />}
          {staticMeta && <meta name="robots" content="index, follow" />}
          {staticMeta && <meta property="og:title" content={staticMeta.title} />}
          {staticMeta && <meta property="og:description" content={staticMeta.description} />}
          {staticMeta && <meta property="og:url" content={staticMeta.canonical} />}
          {staticMeta && <meta name="twitter:title" content={staticMeta.title} />}
          {staticMeta && <meta name="twitter:description" content={staticMeta.description} />}
          {/* Per-slug SEO tags for /listings/* — rendered before streaming starts */}
          {/* <title> is set by generateMetadata in [...slug]/page.tsx via fast metaFromSlug (no API call) */}
          {isListingSlug && slugDescription && <meta name="description" content={slugDescription} />}
          {isListingSlug && slugCanonical && <link rel="canonical" href={slugCanonical} />}
          {isListingSlug && <meta name="robots" content={slugRobots} />}
          {isListingSlug && <meta property="og:type" content="website" />}
          {isListingSlug && slugTitle && <meta property="og:title" content={slugTitle} />}
          {isListingSlug && slugDescription && <meta property="og:description" content={slugDescription} />}
          {isListingSlug && slugCanonical && <meta property="og:url" content={slugCanonical} />}
          {isListingSlug && <meta property="og:image" content="https://www.campervansforsale.au/images/camper_logo.png" />}
          {isListingSlug && <meta property="og:image:width" content="600" />}
          {isListingSlug && <meta property="og:image:height" content="73" />}
          {isListingSlug && <meta name="twitter:card" content="summary_large_image" />}
          {isListingSlug && slugTitle && <meta name="twitter:title" content={slugTitle} />}
          {isListingSlug && slugDescription && <meta name="twitter:description" content={slugDescription} />}
          {isListingSlug && <meta name="twitter:image" content="https://www.campervansforsale.au/images/camper_logo.png" />}
          {/* Contact page JSON-LD */}
          {isContactPage && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "WebSite",
                      "@id": "https://www.campervansforsale.au/#website",
                      "url": "https://www.campervansforsale.au/",
                      "name": "Campervans For Sale",
                      "alternateName": "Campervans For Sale by Marketplace Network",
                    },
                    {
                      "@type": "Organization",
                      "@id": "https://www.campervansforsale.au/#organization",
                      "name": "Marketplace Network Pty Ltd",
                      "legalName": "Marketplace Network Pty Ltd",
                      "taxID": "ABN 70 694 987 052",
                      "url": "https://www.campervansforsale.au/",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.campervansforsale.au/images/camper_logo.svg",
                        "caption": "Campervans For Sale by Marketplace Network",
                      },
                      "contactPoint": {
                        "@type": "ContactPoint",
                        "contactType": "customer service",
                        "url": "https://www.campervansforsale.au/contact/",
                        "availableLanguage": "en",
                        "areaServed": "AU",
                      },
                    },
                    {
                      "@type": "ContactPage",
                      "@id": "https://www.campervansforsale.au/contact/#webpage",
                      "url": "https://www.campervansforsale.au/contact/",
                      "name": "Contact Us | Get in Touch with Campervans For Sale",
                      "isPartOf": { "@id": "https://www.campervansforsale.au/#website" },
                      "about": { "@id": "https://www.campervansforsale.au/#organization" },
                      "description": "Have a question about buying, selling, or dealer advertising solutions? Fill out our online contact form to get in touch with the Campervans For Sale customer support team.",
                      "breadcrumb": { "@id": "https://www.campervansforsale.au/contact/#breadcrumb" },
                    },
                    {
                      "@type": "BreadcrumbList",
                      "@id": "https://www.campervansforsale.au/contact/#breadcrumb",
                      "itemListElement": [
                        {
                          "@type": "ListItem",
                          "position": 1,
                          "name": "Home",
                          "item": "https://www.campervansforsale.au/",
                        },
                        {
                          "@type": "ListItem",
                          "position": 2,
                          "name": "Contact Us",
                          "item": "https://www.campervansforsale.au/contact/",
                        },
                      ],
                    },
                  ],
                }),
              }}
            />
          )}
          {/* Listings page JSON-LD — CollectionPage + BreadcrumbList */}
          {listingsCollectionLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsCollectionLd) }}
            />
          )}
          {/* Listings page JSON-LD — SearchResultsPage with product list */}
          {listingsSearchResultsLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(listingsSearchResultsLd) }}
            />
          )}
          {/* ✅ Google Tag Manager (Head) */}
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f?f.parentNode.insertBefore(j,f):d.head.appendChild(j);
                })(window,document,'script','dataLayer','GTM-N3362FGQ');
              `,
            }}
          />



        </head>
        <body
          className={`flex flex-col min-h-screen new_font ${montserrat.className}`}
        >
          {/* ✅ Google Tag Manager (noscript) - right after body */}
         <noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-N3362FGQ"
    height="0"
    width="0"
    style={{ display: "none", visibility: "hidden" }}
  />
</noscript>

  
         <Suspense fallback={null}>
  <UTMTracker />
</Suspense>
<Suspense fallback={null}>
  <NavigationHistory />
</Suspense>
<Suspense fallback={<NavbarSkeleton />}>
  <Navbar />
</Suspense>
                  <Suspense fallback={null}>

          <ScrollToTop />
          </Suspense>
          <main className="product-page style-5 flex-1">
            {/* <NextTopLoader
          color="#3f3e82"
          height={3}
          showSpinner={false}
        /> */}
          <GlobalErrorTracker />
          <BannerProvider initialBanners={initialBanners as any}>
          {children}
          </BannerProvider>
                    </main>
          <Footer />
        </body>
      </html>
      
    );
  }
  