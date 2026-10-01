import type { GlobalConfig } from "payload";

import { seoFields } from "../fields/shared";

const iconOptions = ["compass", "globe", "message", "sparkles"];

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: { group: "Content" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "masthead",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "whoWeAre",
      type: "group",
      label: "Who we are",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "paragraphs", type: "array", minRows: 1, maxRows: 5, fields: [{ name: "text", type: "textarea", required: true }] },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "imageCaption", type: "text" },
        { name: "imageTitle", type: "text" },
      ],
    },
    {
      name: "approach",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "principles", type: "array", minRows: 1, maxRows: 5, fields: [{ name: "label", type: "text", required: true }] },
      ],
    },
    {
      name: "support",
      type: "group",
      label: "What we help with",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 4,
          fields: [
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
            { name: "icon", type: "select", required: true, options: iconOptions.map((value) => ({ label: value, value })) },
          ],
        },
      ],
    },
    {
      name: "destinationStories",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        {
          name: "items",
          type: "array",
          minRows: 1,
          maxRows: 3,
          fields: [
            { name: "destination", type: "relationship", relationTo: "destinations", required: true },
            { name: "label", type: "text", required: true },
            { name: "image", type: "upload", relationTo: "media", admin: { description: "Optional editorial crop; otherwise the destination's primary image is used." } },
          ],
        },
      ],
    },
    {
      name: "process",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "steps", type: "array", minRows: 1, maxRows: 5, fields: [{ name: "title", type: "text", required: true }, { name: "description", type: "textarea", required: true }] },
      ],
    },
    {
      name: "cta",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "primaryLabel", type: "text", required: true, defaultValue: "Design Your Trip" },
        { name: "secondaryLabel", type: "text", required: true, defaultValue: "Explore destinations" },
      ],
    },
    ...seoFields(),
  ],
};
