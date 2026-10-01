import type { CollectionConfig, Where } from "payload";
import { authenticatedWriteAccess } from "./access";

export const Markets: CollectionConfig = {
  slug: "markets",
  admin: {
    useAsTitle: "name",
    group: "Configuration",
    defaultColumns: ["name", "code", "isActive", "isPublic"],
  },
  access: {
    ...authenticatedWriteAccess,
    read: ({ req }) => {
      if (req.user) return true;
      const publicMarketWhere: Where = {
        and: [
        { code: { equals: process.env.NEXT_PUBLIC_LAUNCH_MARKET_CODE?.trim() || "EG" } },
        { isActive: { equals: true } },
        { isPublic: { equals: true } },
        ],
      };
      return publicMarketWhere;
    },
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
