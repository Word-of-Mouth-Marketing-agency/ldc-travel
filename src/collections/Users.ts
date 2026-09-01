import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Configuration",
  },
  fields: [
    {
      name: "role",
      type: "select",
      defaultValue: "admin",
      options: [{ label: "Admin", value: "admin" }],
      admin: { position: "sidebar" },
    },
  ],
};
