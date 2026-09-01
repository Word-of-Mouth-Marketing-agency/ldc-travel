import type { CollectionConfig } from "payload";

import { contentFields, marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";

export const Events: CollectionConfig = {
  slug: "events",
  admin: { useAsTitle: "title", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "location", type: "text", required: true },
    { name: "destination", type: "relationship", relationTo: "destinations" },
    { name: "startDate", type: "date", required: true },
    { name: "endDate", type: "date" },
    ...contentFields({ longDescriptionLabel: "Event details" }),
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
    },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    ...seoFields(),
  ],
};
