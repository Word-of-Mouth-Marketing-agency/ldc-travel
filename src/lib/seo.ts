import type { Metadata } from "next";

import { isUiPreviewMode } from "./preview";

export type SeoInput = {
  siteName: string;
  siteUrl?: string | null;
  title: string;
  description: string;
  pathname?: string;
  socialImageUrl?: string | null;
};

const productionSiteUrl = "https://ldc-tourism.com";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return productionSiteUrl;

  try {
    const url = new URL(configured);
    if (url.protocol !== "http:" && url.protocol !== "https:") return productionSiteUrl;
    return url.origin;
  } catch {
    return productionSiteUrl;
  }
}

export function toAbsoluteUrl(value: string, siteUrl = getSiteUrl()) {
  if (/^https?:\/\//i.test(value)) return value;
  return siteUrl ? new URL(value, siteUrl).toString() : undefined;
}

export function buildPageMetadata({
  siteName,
  siteUrl,
  title,
  description,
  pathname = "/",
  socialImageUrl,
}: SeoInput): Metadata {
  const canonical = siteUrl ? new URL(pathname, siteUrl).toString() : undefined;
  return {
    title: { absolute: title },
    description,
    robots: isUiPreviewMode() ? { index: false, follow: false } : { index: true, follow: true },
    alternates: canonical ? { canonical } : undefined,
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

export function buildUnavailableMetadata(title: string): Metadata {
  return {
    title: { absolute: title },
    description: "LDC Travel content is temporarily unavailable. Please try again shortly.",
    robots: { index: false, follow: false },
  };
}
