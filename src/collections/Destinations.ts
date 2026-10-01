import type { CollectionConfig, Where } from "payload";

import { approvedDestinationSlugs } from "../content/destinations";
import { contentFields, marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";
import { authenticatedWriteAccess } from "./access";

export const Destinations: CollectionConfig = {
  slug: "destinations",
  admin: { useAsTitle: "title", group: "Content" },
  access: {
    ...authenticatedWriteAccess,
    read: async ({ req }) => {
      if (req.user) return true;

      try {
        const markets = await req.payload.find({
          collection: "markets",
          where: {
            and: [
              { code: { equals: process.env.NEXT_PUBLIC_LAUNCH_MARKET_CODE?.trim() || "EG" } },
              { isActive: { equals: true } },
              { isPublic: { equals: true } },
            ],
          },
          depth: 0,
          limit: 1,
          overrideAccess: false,
          req,
        });
        const market = markets.docs[0];
        if (!market) return false;

        const publicDestinationsWhere: Where = {
          and: [
            { status: { equals: "published" } },
            { slug: { in: approvedDestinationSlugs } },
            { markets: { in: [market.id] } },
          ],
        };
        return publicDestinationsWhere;
      } catch {
        return false;
      }
    },
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "country", type: "text", required: true },
    { name: "regionOrCity", type: "text" },
    { name: "eyebrow", type: "text", maxLength: 100, admin: { description: "Short destination hero label displayed above the title." } },
    ...contentFields({ longDescriptionLabel: "Destination story" }),
    { name: "overview", type: "textarea", admin: { description: "Concise destination overview shown near the top of the detail page." } },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "heroImage", type: "upload", relationTo: "media", admin: { description: "Optional destination-detail hero image. If empty, the primary cover image is used." } },
    {
      name: "imageUrl",
      type: "text",
      admin: { hidden: true, description: "Legacy demo URL retained for migration compatibility. Use the Media fields instead." },
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true, admin: { description: "Optional supporting image gallery. Add meaningful alt text to each image." } },
    {
      name: "highlights",
      type: "array",
      admin: { description: "Structured places or areas to discover. Select Media uploads for images; records without an image remain text-only." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageUrl", type: "text", admin: { hidden: true, description: "Legacy demo URL retained for migration compatibility. Use the Media image field instead." } },
        { name: "alt", type: "text" },
      ],
    },
    {
      name: "experiences",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "icon", type: "text", admin: { description: "Shared icon key such as city, mountain, waves, sparkles, or compass." } },
      ],
    },
    { name: "bestTimeToVisit", type: "textarea", admin: { description: "Use nuanced seasonal guidance; avoid declaring one universal best month." } },
    {
      name: "usefulInformation",
      type: "array",
      admin: { description: "Stable context such as language, currency, geography, or planning considerations. Do not add legal advice." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "textarea", required: true },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    { name: "relatedDestinations", type: "relationship", relationTo: "destinations", hasMany: true },
    { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true, admin: { description: "Destination-specific questions that help visitors decide whether to start an inquiry." } },
    {
      name: "relatedPrograms",
      type: "relationship",
      relationTo: "travel-programs",
      hasMany: true,
      admin: { hidden: true, description: "Legacy field retained for schema compatibility; programs are not part of the public destination product." },
    },
    ...seoFields(),
  ],
};
