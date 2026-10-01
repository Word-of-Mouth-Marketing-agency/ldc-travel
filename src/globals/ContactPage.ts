import type { GlobalConfig } from "payload";

import { seoFields } from "../fields/shared";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
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
      name: "form",
      type: "group",
      label: "Inquiry form introduction",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "submitLabel", type: "text", required: true, defaultValue: "Send inquiry" },
      ],
    },
    {
      name: "details",
      type: "group",
      label: "Contact details introduction",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "noteHeadline", type: "text", required: true },
        { name: "noteDescription", type: "text", required: true },
        { name: "noteCtaLabel", type: "text", required: true, defaultValue: "Chat with us" },
      ],
    },
    {
      name: "social",
      type: "group",
      label: "Social section introduction",
      fields: [
        { name: "eyebrow", type: "text", required: true },
        { name: "headline", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
      ],
    },
    ...seoFields(),
  ],
};
