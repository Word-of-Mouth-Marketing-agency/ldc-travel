import type { Field } from "payload";

export const slugField = (): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  admin: {
    description: "Lowercase URL segment. Keep it stable after publication.",
  },
});

export const statusField = (): Field => ({
  name: "status",
  type: "select",
  required: true,
  defaultValue: "draft",
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ],
  admin: { position: "sidebar" },
});

export const marketVisibilityField = (): Field => ({
  name: "markets",
  type: "relationship",
  relationTo: "markets",
  hasMany: true,
  required: true,
  admin: {
    description: "Only markets selected here may show this record publicly.",
  },
});

export const seoFields = (): Field[] => [
  {
    name: "seo",
    type: "group",
    fields: [
      { name: "metaTitle", type: "text", maxLength: 60 },
      { name: "metaDescription", type: "textarea", maxLength: 160 },
      { name: "socialImage", type: "upload", relationTo: "media" },
      { name: "canonicalUrl", type: "text" },
    ],
  },
];

export const contentFields = (options?: {
  longDescriptionLabel?: string;
  includeExcerpt?: boolean;
}): Field[] => [
  { name: "summary", type: "textarea", required: true },
  ...(options?.includeExcerpt
    ? [{ name: "excerpt", type: "textarea", required: true } as Field]
    : []),
  {
    name: "content",
    type: "richText",
    label: options?.longDescriptionLabel ?? "Long-form content",
  },
];
