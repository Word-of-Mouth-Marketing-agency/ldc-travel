import type { WhatsAppConfig } from "./whatsapp";

export const publicContact = {
  email: "info@ldc-tourism.com",
  office: "15 Mahmoud Essmat Hamdy, Sheraton",
  whatsapp: {
    egypt: { display: "+20 12 11118118", number: "201211118118" },
    saudi: { display: "+966 7277981053", number: "9667277981053" },
  },
} as const;

export const publicWhatsAppCopy = {
  defaultMessage: "Hi LDC Travel, I'd like to explore one of your destinations.",
  contextTemplate: "Hi LDC Travel, I'm interested in {{title}} and would like more information.",
} as const;

export function createPublicWhatsAppConfig(number: string): WhatsAppConfig {
  return {
    phoneNumber: number,
    ...publicWhatsAppCopy,
  };
}
