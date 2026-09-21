import type { Metadata } from "next";

export type SeoInput = {
  siteName: string;
  siteUrl: string;
  title: string;
  description: string;
  pathname?: string;
  socialImageUrl?: string | null;
};

export function buildPageMetadata({
  siteName,
  siteUrl,
  title,
  description,
  pathname = "/",
  socialImageUrl,
}: SeoInput): Metadata {
  const canonical = new URL(pathname, siteUrl).toString();
  const siteSuffix = ` | ${siteName}`;
  const pageTitle = title.endsWith(siteSuffix) ? title.slice(0, -siteSuffix.length) : title;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName,
      type: "website",
      images: socialImageUrl ? [{ url: socialImageUrl }] : undefined,
    },
    twitter: {
      card: socialImageUrl ? "summary_large_image" : "summary",
      title: pageTitle,
      description,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}
