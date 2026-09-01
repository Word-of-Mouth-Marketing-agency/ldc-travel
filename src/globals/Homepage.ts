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
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "imageUrl",
          type: "text",
          admin: { description: "Optional remote demo image URL. Prefer a Media upload for production content." },
        },
        { name: "primaryCta", type: "group", fields: ctaFields },
        { name: "secondaryCta", type: "group", fields: ctaFields },
      ],
    },
    {
      name: "trustBenefits",
      type: "array",
      minRows: 3,
      maxRows: 4,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "iconKey", type: "text", required: true },
      ],
    },
    { name: "featuredDestinations", type: "relationship", relationTo: "destinations", hasMany: true },
    { name: "popularPrograms", type: "relationship", relationTo: "travel-programs", hasMany: true },
    { name: "activeOffer", type: "relationship", relationTo: "offers" },
    { name: "upcomingEvents", type: "relationship", relationTo: "events", hasMany: true },
    { name: "featuredTestimonials", type: "relationship", relationTo: "testimonials", hasMany: true },
    { name: "latestGuides", type: "relationship", relationTo: "guides", hasMany: true },
    { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true },
  ],
};
