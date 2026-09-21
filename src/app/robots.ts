import type { MetadataRoute } from "next";

import { isUiPreviewMode } from "../lib/preview";
import { getSiteUrl } from "../lib/seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const sitemap = siteUrl ? `${siteUrl}/sitemap.xml` : undefined;

  if (isUiPreviewMode()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      ...(sitemap ? { sitemap } : {}),
    };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ...(sitemap ? { sitemap } : {}),
  };
}
