import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { buildConfig } from "payload";

import { Destinations } from "./src/collections/Destinations";
import { Events } from "./src/collections/Events";
import { FAQs } from "./src/collections/FAQs";
import { Guides } from "./src/collections/Guides";
import { Inquiries } from "./src/collections/Inquiries";
import { Markets } from "./src/collections/Markets";
import { Media } from "./src/collections/Media";
import { Offers } from "./src/collections/Offers";
import { Services } from "./src/collections/Services";
import { Testimonials } from "./src/collections/Testimonials";
import { TravelPrograms } from "./src/collections/TravelPrograms";
import { Users } from "./src/collections/Users";
import { Homepage } from "./src/globals/Homepage";
import { SiteSettings } from "./src/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — LDC Travel CMS",
    },
  },
  collections: [
    Users,
    Media,
    Markets,
    Destinations,
    TravelPrograms,
    Events,
    Services,
    Offers,
    Guides,
    Testimonials,
    FAQs,
    Inquiries,
  ],
  editor: lexicalEditor(),
  globals: [SiteSettings, Homepage],
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? "",
    },
    push: process.env.NODE_ENV !== "production",
  }),
  sharp,
  cors: siteUrl ? [siteUrl] : undefined,
  csrf: siteUrl ? [siteUrl] : undefined,
});
