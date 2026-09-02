import type { CollectionConfig } from "payload";

import { inquiryTypeOptions } from "../lib/inquiry-validation";

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  admin: {
    defaultColumns: ["fullName", "inquiryType", "status", "createdAt"],
    group: "Leads",
    useAsTitle: "fullName",
  },
  access: {
    create: () => false,
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "fullName", type: "text", required: true, maxLength: 80 },
    { name: "email", type: "email" },
    { name: "phone", type: "text", maxLength: 30 },
    {
      name: "inquiryType",
      type: "select",
      options: inquiryTypeOptions.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    { name: "subject", type: "text", maxLength: 120 },
    { name: "message", type: "textarea", required: true, maxLength: 2000 },
    {
      name: "source",
      type: "text",
      defaultValue: "contact-page",
      required: true,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
      ],
      required: true,
      admin: { position: "sidebar" },
    },
  ],
};
