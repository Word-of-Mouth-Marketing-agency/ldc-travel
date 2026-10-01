import type { CollectionConfig } from "payload";
import { authenticatedWriteAccess } from "./access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Configuration",
    defaultColumns: ["filename", "alt", "caption", "updatedAt"],
  },
  access: {
    ...authenticatedWriteAccess,
    read: () => true,
  },
  upload: {
    staticDir: process.env.PAYLOAD_MEDIA_DIR?.trim() || "media",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    adminThumbnail: "thumbnail",
    imageSizes: [
      { name: "thumbnail", width: 480, height: 320, position: "centre" },
      { name: "card", width: 960, height: 640, position: "centre" },
      { name: "hero", width: 2400, height: 1600, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      maxLength: 180,
      admin: { description: "Describe the meaningful subject of the image." },
    },
    {
      name: "credit",
      type: "text",
      maxLength: 160,
      admin: { description: "Optional photographer/source credit." },
    },
    {
      name: "sourceUrl",
      type: "text",
      maxLength: 500,
      admin: { description: "Optional source or license page used to verify the image." },
    },
    {
      name: "caption",
      type: "text",
      maxLength: 180,
      admin: { description: "Optional short caption for galleries and editorial use." },
    },
  ],
};
