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
    { name: "overview", type: "textarea", admin: { description: "Concise destination overview shown near the top of the detail page." } },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "highlights",
      type: "array",
      admin: { description: "Structured places or areas to discover. Use approved Media uploads for production imagery." },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageUrl", type: "text" },
        { name: "alt", type: "text" },
      ],
    },
    {
      name: "experiences",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "icon", type: "text", admin: { description: "Shared icon key such as city, mountain, waves, or sparkles." } },
      ],
    },
    { name: "bestTimeToVisit", type: "textarea" },
    {
      name: "usefulInformation",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "textarea", required: true },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    statusField(),
    marketVisibilityField(),
    { name: "relatedDestinations", type: "relationship", relationTo: "destinations", hasMany: true },
    { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true },
    {
      name: "relatedPrograms",
      type: "relationship",
      relationTo: "travel-programs",
      hasMany: true,
    },
    ...seoFields(),
  ],
};
