import type { GlobalConfig } from "payload";

const ctaFields = [
  { name: "label", type: "text" as const, required: true },
  {
    name: "kind",
    type: "select" as const,
    required: true,
    defaultValue: "whatsapp",
    options: [
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Internal route", value: "internal" },
      { label: "External URL", value: "external" },
    ],
  },
  { name: "url", type: "text" as const },
];

const imageFields = [
  { name: "image", type: "upload" as const, relationTo: "media" as const },
  {
    name: "imageUrl",
    type: "text" as const,
    admin: { description: "Optional approved demo image URL. Prefer a Media upload for production content." },
  },
];

export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: { group: "Configuration" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "supportingCopy", type: "textarea", required: true },
        ...imageFields,
        { name: "primaryCta", type: "group", fields: ctaFields },
        { name: "secondaryCta", type: "group", fields: ctaFields },
      ],
    },
    { name: "featuredDestinations", type: "relationship", relationTo: "destinations", hasMany: true },
    {
      name: "whyLdc",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "description", type: "textarea" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
            { name: "icon", type: "text", required: true, admin: { description: "Use a shared icon key such as globe, compass, or message." } },
          ],
        },
      ],
    },
    {
      name: "inspiration",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "description", type: "textarea" },
        {
          name: "items",
          type: "array",
          fields: [
            { name: "title", type: "text", required: true },
            { name: "label", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
            ...imageFields,
          ],
        },
      ],
    },
    {
      name: "destinationCta",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "headline", type: "text" },
        { name: "description", type: "textarea" },
        { name: "primaryCta", type: "group", fields: ctaFields },
        { name: "secondaryCta", type: "group", fields: ctaFields },
      ],
    },
    { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true },
  ],
};
