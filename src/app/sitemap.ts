import type { MetadataRoute } from "next";

import { isUiPreviewMode } from "../lib/preview";
import { getSiteUrl } from "../lib/seo";

export const dynamic = "force-dynamic";

const publicPaths = [
  "/",
  "/destinations",
  "/destinations/turkey",
  "/destinations/russia",
  "/destinations/bali",
  "/destinations/georgia",
  "/destinations/indonesia",
  "/destinations/thailand",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (isUiPreviewMode()) return [];

  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return publicPaths.map((pathname) => ({
    url: new URL(pathname, siteUrl).toString(),
  }));
}
