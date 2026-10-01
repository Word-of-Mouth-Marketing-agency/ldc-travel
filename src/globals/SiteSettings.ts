import type { GlobalConfig } from "payload";

import { seoFields } from "../fields/shared";
import { saudiOfficeAddress } from "../lib/public-contact";

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
    { name: "canonicalUrl", type: "text", admin: { hidden: true, description: "Legacy value retained for compatibility. Canonical origin comes from NEXT_PUBLIC_SITE_URL." } },
    { name: "publicEmail", type: "email", required: true, defaultValue: "info@ldc-tourism.com" },
    {
      name: "contact",
      type: "group",
      fields: [
        {
          name: "egyptOffice",
          type: "group",
          label: "Egypt office",
          fields: [
            { name: "label", type: "text", required: true, defaultValue: "Egypt" },
            { name: "address", type: "textarea", required: true, defaultValue: "15 Mahmoud Essmat Hamdy, Sheraton" },
            { name: "whatsappDisplay", type: "text", required: true, defaultValue: "+20 12 11118118" },
            { name: "whatsappNumber", type: "text", required: true, defaultValue: "201211118118", admin: { description: "Digits only, including the country code. Used to build WhatsApp links." } },
          ],
        },
        {
          name: "saudiOfficeDetails",
          type: "group",
          label: "Saudi Arabia office",
          fields: [
            { name: "label", type: "text", required: true, defaultValue: "Saudi Arabia" },
            { name: "address", type: "textarea", required: true, defaultValue: saudiOfficeAddress },
            { name: "whatsappDisplay", type: "text", required: true, defaultValue: "+966 7277981053" },
            { name: "whatsappNumber", type: "text", required: true, defaultValue: "9667277981053", admin: { description: "Digits only, including the country code. Used to build WhatsApp links." } },
          ],
        },
        {
          name: "whatsappDisplay",
          type: "text",
          required: true,
          defaultValue: "+966 7277981053",
          admin: { hidden: true, description: "Legacy primary WhatsApp value retained for compatibility. Edit the regional office fields above." },
        },
        {
          name: "whatsappNumber",
          type: "text",
          required: true,
          defaultValue: "9667277981053",
          admin: { hidden: true, description: "Legacy primary WhatsApp value retained for compatibility. Edit the regional office fields above." },
        },
        { name: "office", type: "text", required: true, defaultValue: "15 Mahmoud Essmat Hamdy, Sheraton", admin: { hidden: true, description: "Legacy field retained for compatibility. Edit the Egypt office fields above." } },
        { name: "saudiOffice", type: "text", defaultValue: saudiOfficeAddress, admin: { hidden: true, description: "Legacy field retained for compatibility. Edit the Saudi Arabia office fields above." } },
        { name: "reservationsEmail", type: "email", required: true, defaultValue: "info@ldc-tourism.com", admin: { hidden: true, description: "Legacy email field retained for compatibility. Edit Public Email above." } },
        { name: "salesEmail", type: "email", required: true, defaultValue: "info@ldc-tourism.com", admin: { hidden: true, description: "Legacy email field retained for compatibility. Edit Public Email above." } },
      ],
    },
    {
      name: "socials",
      type: "group",
      label: "Regional social accounts",
      fields: [
        {
          name: "egypt",
          type: "group",
          label: "Egypt",
          fields: [
            { name: "instagram", type: "text", defaultValue: "https://www.instagram.com/ldctravels.eg/" },
            { name: "facebook", type: "text", defaultValue: "https://www.facebook.com/profile.php?id=61591627376189" },
          ],
        },
        {
          name: "saudi",
          type: "group",
          label: "Saudi Arabia",
          fields: [
            { name: "instagram", type: "text", defaultValue: "https://www.instagram.com/elwajha_elraeda_travels/" },
            { name: "facebook", type: "text", defaultValue: "https://www.facebook.com/profile.php?id=61575912646557#" },
          ],
        },
      ],
    },
    {
      name: "branding",
      type: "group",
      label: "Brand assets",
      admin: { description: "Optional approved logo uploads. The site uses the bundled LDC logo when a field is empty." },
      fields: [
        { name: "primaryLogo", type: "upload", relationTo: "media", admin: { description: "Light-surface logo for the header and mobile drawer." } },
        { name: "footerLogo", type: "upload", relationTo: "media", admin: { description: "Light logo for the navy footer." } },
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
      ],
      admin: { hidden: true, description: "Legacy social array retained for compatibility. Use Regional social accounts above." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    { name: "footerCopy", type: "textarea" },
    ...seoFields(),
  ],
};
