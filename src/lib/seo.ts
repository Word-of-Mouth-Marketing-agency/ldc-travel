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

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return undefined;

  try {
    const url = new URL(configured);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.origin;
  } catch {
    return undefined;
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
  const siteSuffix = ` | ${siteName}`;
  const pageTitle = title.endsWith(siteSuffix) ? title.slice(0, -siteSuffix.length) : title;

  return {
    title: pageTitle,
    description,
    robots: isUiPreviewMode() ? { index: false, follow: false } : { index: true, follow: true },
    alternates: canonical ? { canonical } : undefined,
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
