import type { CollectionConfig } from "payload";

import { marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";

export const Offers: CollectionConfig = {
  slug: "offers",
  admin: { useAsTitle: "title", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    { name: "badge", type: "text" },
    { name: "headline", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "discountLabel", type: "text" },
    { name: "startsAt", type: "date" },
    { name: "endsAt", type: "date" },
    { name: "image", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
    },
    { name: "ctaLabel", type: "text", defaultValue: "Explore offer" },
    { name: "program", type: "relationship", relationTo: "travel-programs" },
    statusField(),
    marketVisibilityField(),
    ...seoFields(),
  ],
};
