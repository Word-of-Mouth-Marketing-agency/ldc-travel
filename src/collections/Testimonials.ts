import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: { useAsTitle: "displayName", group: "Content" },
  access: { read: () => true },
  fields: [
    { name: "displayName", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "quote", type: "textarea", required: true },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "rating", type: "number", min: 1, max: 5, defaultValue: 5 },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    {
      name: "isDemoContent",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Keep enabled for seed/demo reviews until replaced with supplied customer content.",
      },
    },
  ],
};
