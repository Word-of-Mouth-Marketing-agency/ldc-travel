import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";

import { isUiPreviewMode } from "../../lib/preview";
import { getSiteUrl } from "../../lib/seo";
import { SiteStructuredData } from "../../components/seo/StructuredData";
import "../globals.css";

const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: "Explore International Destinations",
    template: "%s | LDC Travel",
  },
  description:
    "Explore international destinations with LDC Travel, then start a clear conversation about the places and experiences you want to discover.",
  robots: isUiPreviewMode() ? { index: false, follow: false } : { index: true, follow: true },
};

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <SiteStructuredData />
        {children}
      </body>
    </html>
  );
}
