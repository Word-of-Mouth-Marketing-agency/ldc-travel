import type { CollectionConfig } from "payload";

import { contentFields, marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";

export const Destinations: CollectionConfig = {
  slug: "destinations",
  admin: { useAsTitle: "title", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "country", type: "text", required: true },
    { name: "regionOrCity", type: "text" },
    ...contentFields({ longDescriptionLabel: "Destination story" }),
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    {
      name: "relatedPrograms",
      type: "relationship",
      relationTo: "travel-programs",
      hasMany: true,
    },
    ...seoFields(),
  ],
};
