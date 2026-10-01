import type { GlobalConfig } from "payload";
import { seoFields } from "../fields/shared";

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
    admin: { hidden: true, description: "Legacy demo URL retained for migration compatibility. Use a Media upload instead." },
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
    {
      name: "destinationsSection",
      type: "group",
      label: "Featured destinations section",
      fields: [
        { name: "eyebrow", type: "text", required: true, defaultValue: "The world, in focus" },
        { name: "headline", type: "text", required: true, defaultValue: "Choose a place that feels like you." },
        { name: "description", type: "textarea", required: true, defaultValue: "Six destinations to start with, each offering a different way to see more of the world." },
      ],
    },
    { name: "featuredDestinations", type: "relationship", relationTo: "destinations", hasMany: true, admin: { description: "Select and order up to the six approved destinations shown on the homepage." } },
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
            { name: "icon", type: "text", required: true, admin: { description: "Shared interface icon key: globe, compass, or message." } },
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
            { name: "destination", type: "relationship", relationTo: "destinations", admin: { description: "Optional destination link and image source. When selected, this destination supplies the image unless you choose an override." } },
            { name: "href", type: "text", admin: { description: "Optional approved internal destination path. Leave blank to link to the selected destination." } },
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
        {
          name: "form",
          type: "group",
          label: "Homepage inquiry form introduction",
          fields: [
            { name: "eyebrow", type: "text", required: true, defaultValue: "Start a conversation" },
            { name: "headline", type: "text", required: true, defaultValue: "Tell us what you’re planning." },
            { name: "description", type: "textarea", required: true, defaultValue: "Share a few details and we’ll help shape the right next step." },
            { name: "submitLabel", type: "text", required: true, defaultValue: "Send inquiry" },
          ],
        },
      ],
    },
    {
      name: "faqSection",
      type: "group",
      label: "Homepage FAQ section",
      fields: [
        { name: "eyebrow", type: "text", required: true, defaultValue: "Good to know" },
        { name: "headline", type: "text", required: true, defaultValue: "Questions, answered simply." },
        { name: "description", type: "textarea", required: true, defaultValue: "Still choosing? Start a conversation with the LDC Travel team." },
      ],
    },
    { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true, admin: { description: "Select and order the enabled questions shown on the homepage." } },
    ...seoFields(),
  ],
};
