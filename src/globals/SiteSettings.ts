import type { GlobalConfig } from "payload";

import { seoFields } from "../fields/shared";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Configuration" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "siteName", type: "text", required: true, defaultValue: "LDC Travel" },
    { name: "tagline", type: "text", required: true, defaultValue: "Tourism Marketing" },
    { name: "defaultMarket", type: "relationship", relationTo: "markets", required: true },
    { name: "canonicalUrl", type: "text" },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "whatsappDisplay", type: "text", required: true, defaultValue: "+966 7277981053" },
        { name: "whatsappNumber", type: "text", required: true, defaultValue: "9667277981053" },
        { name: "office", type: "text", required: true, defaultValue: "15 Mahmoud Essmat Hamdy, Sheraton" },
        { name: "reservationsEmail", type: "email", required: true, defaultValue: "reservations@ldc-tourism.com" },
        { name: "salesEmail", type: "email", required: true, defaultValue: "sales@ldc-tourism.com" },
      ],
    },
    {
      name: "whatsapp",
      type: "group",
      fields: [
        { name: "defaultMessage", type: "textarea", defaultValue: "Hi LDC Travel, I'd like to explore one of your destinations." },
        { name: "contextTemplate", type: "textarea", defaultValue: "Hi LDC Travel, I'm interested in {{title}} and would like more information." },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      defaultValue: [
        { label: "Instagram", url: "https://www.instagram.com/ldctravels.eg/" },
        { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591627376189" },
        { label: "TikTok", url: "https://www.tiktok.com/@ldc.travel.agency" },
        { label: "LinkedIn", url: "https://www.linkedin.com/company/ldctravel/" },
      ],
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    { name: "footerCopy", type: "textarea" },
    ...seoFields(),
  ],
};
