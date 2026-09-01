import type { CollectionConfig } from "payload";

export const Markets: CollectionConfig = {
  slug: "markets",
  admin: {
    useAsTitle: "name",
    group: "Configuration",
    defaultColumns: ["name", "code", "isActive", "isPublic"],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "code", type: "text", required: true, unique: true, maxLength: 8 },
    { name: "locale", type: "text", required: true, defaultValue: "en-EG" },
    {
      name: "currency",
      type: "group",
      fields: [
        { name: "code", type: "text", required: true, defaultValue: "EGP" },
        { name: "symbol", type: "text", required: true, defaultValue: "EGP" },
      ],
    },
    { name: "isDefault", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "isActive", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    { name: "isPublic", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "office", type: "text" },
        { name: "reservationsEmail", type: "email" },
        { name: "salesEmail", type: "email" },
        { name: "whatsapp", type: "text" },
      ],
    },
  ],
};
