import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Configuration",
  },
  upload: {
    staticDir: process.env.PAYLOAD_MEDIA_DIR?.trim() || "media",
    mimeTypes: ["image/*", "image/svg+xml"],
    adminThumbnail: "thumbnail",
    imageSizes: [
      { name: "thumbnail", width: 480, height: 320, position: "centre" },
      { name: "card", width: 960, height: 640, position: "centre" },
      { name: "hero", width: 1800, height: 1200, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the meaningful subject of the image." },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Optional photographer/source credit." },
    },
  ],
};
