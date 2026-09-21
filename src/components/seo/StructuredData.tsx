import type { ReactNode } from "react";

import type { DestinationDetailViewModel } from "../../content/destinations";
import { getSiteUrl, toAbsoluteUrl } from "../../lib/seo";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

function serialize(value: JsonLdValue) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function StructuredData({ data }: { data: JsonLdValue }): ReactNode {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(data) }} />;
}

const socialUrls = [
  "https://www.instagram.com/ldctravels.eg/",
  "https://www.facebook.com/profile.php?id=61591627376189",
  "https://www.tiktok.com/@ldc.travel.agency",
  "https://www.linkedin.com/company/ldctravel/",
];

export function SiteStructuredData() {
  const siteUrl = getSiteUrl();
  const organizationId = siteUrl ? `${siteUrl}/#organization` : undefined;
  const websiteId = siteUrl ? `${siteUrl}/#website` : undefined;

  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            ...(organizationId ? { "@id": organizationId, url: siteUrl, logo: toAbsoluteUrl("/brand/ldc-logo-blue.webp", siteUrl) } : {}),
            name: "LDC Travel",
            sameAs: socialUrls,
          },
          {
            "@type": "WebSite",
            ...(websiteId ? { "@id": websiteId, url: siteUrl } : {}),
            name: "LDC Travel",
            publisher: organizationId ? { "@id": organizationId } : { "@type": "Organization", name: "LDC Travel" },
          },
        ],
      }}
    />
  );
}

export function DestinationStructuredData({ destination }: { destination: DestinationDetailViewModel }) {
  const siteUrl = getSiteUrl();
  const pageUrl = siteUrl ? `${siteUrl}/destinations/${destination.slug}` : undefined;
  const imageUrl = toAbsoluteUrl(destination.heroImage.src, siteUrl);

  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl ? `${siteUrl}/` : undefined },
              { "@type": "ListItem", position: 2, name: "Destinations", item: siteUrl ? `${siteUrl}/destinations` : undefined },
              { "@type": "ListItem", position: 3, name: destination.title, item: pageUrl },
            ],
          },
          {
            "@type": "TouristDestination",
            ...(pageUrl ? { "@id": pageUrl, url: pageUrl } : {}),
            name: destination.title,
            description: destination.overview,
            ...(imageUrl ? { image: imageUrl } : {}),
            containedInPlace: { "@type": "Country", name: destination.country },
          },
        ],
      }}
    />
  );
}
