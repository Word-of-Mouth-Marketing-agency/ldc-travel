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

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: "website",
      images: socialImageUrl ? [{ url: socialImageUrl }] : undefined,
    },
    twitter: {
      card: socialImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImageUrl ? [socialImageUrl] : undefined,
    },
  };
}
