import type { CollectionConfig } from "payload";

import { contentFields, marketVisibilityField, seoFields, slugField, statusField } from "../fields/shared";

export const TravelPrograms: CollectionConfig = {
  slug: "travel-programs",
  admin: { useAsTitle: "title", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    ...contentFields({ longDescriptionLabel: "Program details" }),
    { name: "destinations", type: "relationship", relationTo: "destinations", hasMany: true, required: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "durationDays",
      type: "number",
      min: 1,
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "startingPrice",
      type: "group",
      fields: [
        { name: "amount", type: "number", min: 0, required: true },
        { name: "currency", type: "text", required: true, defaultValue: "EGP" },
        { name: "unit", type: "select", defaultValue: "person", options: ["person", "group", "night"] },
      ],
    },
    {
      name: "itinerary",
      type: "array",
      fields: [
        { name: "day", type: "number", min: 1, required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    { name: "highlights", type: "array", fields: [{ name: "item", type: "text", required: true }] },
    { name: "included", type: "array", fields: [{ name: "item", type: "text", required: true }] },
    { name: "notIncluded", type: "array", fields: [{ name: "item", type: "text", required: true }] },
    { name: "accommodation", type: "textarea" },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    { name: "offer", type: "relationship", relationTo: "offers" },
    { name: "whatsappMessageOverride", type: "textarea" },
    ...seoFields(),
  ],
};
