import type { WhatsAppConfig } from "./whatsapp";

export const saudiOfficeAddress = [
  "18th Floor, Al Faisaliah Tower",
  "King Fahd Road, Al Olaya District",
  "P.O. Box 54995",
  "Riyadh 11524, Kingdom of Saudi Arabia",
].join("\n");

const legacySaudiOfficeAddress = "الطابق 18برج الفصيلة،طريق الملك فهد حي العليا ص.ب54995،الرياض11524،المملكه العربيه السعودية";

export const publicContact = {
  email: "info@ldc-tourism.com",
  office: "15 Mahmoud Essmat Hamdy, Sheraton",
  saudiOffice: saudiOfficeAddress,
  whatsapp: {
    egypt: { display: "+20 12 11118118", number: "201211118118" },
    saudi: { display: "+966 7277981053", number: "9667277981053" },
  },
} as const;

export function normalizeSaudiOfficeAddress(value: unknown) {
  if (typeof value !== "string" || !value.trim() || /[\u0600-\u06ff]/u.test(value)) {
    return saudiOfficeAddress;
  }

  return value.trim() === legacySaudiOfficeAddress ? saudiOfficeAddress : value.trim();
}

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
