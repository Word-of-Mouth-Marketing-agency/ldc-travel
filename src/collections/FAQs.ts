import type { CollectionConfig } from "payload";
import { authenticatedWriteAccess } from "./access";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  admin: { useAsTitle: "question", group: "Content", defaultColumns: ["question", "order", "enabled"] },
  access: {
    ...authenticatedWriteAccess,
    read: ({ req }) => req.user ? true : { enabled: { equals: true } },
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "richText", required: true },
    { name: "category", type: "text" },
    { name: "order", type: "number", required: true, defaultValue: 0, admin: { position: "sidebar" } },
    { name: "enabled", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
  ],
};
