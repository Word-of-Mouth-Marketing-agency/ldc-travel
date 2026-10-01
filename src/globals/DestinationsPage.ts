import type { GlobalConfig } from "payload";

import { seoFields } from "../fields/shared";

export const DestinationsPage: GlobalConfig = {
  slug: "destinations-page",
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
        { name: "markLabel", type: "text", required: true, defaultValue: "destinations to begin with" },
      ],
    },
    {
      name: "listing",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    {
      name: "support",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "ctaLabel", type: "text", required: true, defaultValue: "Talk to LDC Travel" },
      ],
    },
    ...seoFields(),
  ],
};
