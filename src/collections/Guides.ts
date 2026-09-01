import type { CollectionConfig } from "payload";

import { contentFields, marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";

export const Guides: CollectionConfig = {
  slug: "guides",
  admin: { useAsTitle: "title", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    ...contentFields({ longDescriptionLabel: "Article content", includeExcerpt: true }),
    {
      name: "category",
      type: "select",
      options: ["Destination guide", "Travel tips", "Inspiration", "Planning"],
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
    },
    { name: "relatedDestinations", type: "relationship", relationTo: "destinations", hasMany: true },
    { name: "publishedAt", type: "date" },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    ...seoFields(),
  ],
};
