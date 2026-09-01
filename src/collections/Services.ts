import type { CollectionConfig } from "payload";

import { contentFields, marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";

export const Services: CollectionConfig = {
  slug: "services",
  admin: { useAsTitle: "title", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    ...contentFields({ longDescriptionLabel: "Service details" }),
    { name: "iconKey", type: "text", admin: { description: "Stable presentation key, not raw SVG markup." } },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    ...seoFields(),
  ],
};
