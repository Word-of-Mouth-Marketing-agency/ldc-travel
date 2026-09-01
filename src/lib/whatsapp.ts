export type WhatsAppConfig = {
  phoneNumber: string;
  defaultMessage: string;
  contextTemplate?: string | null;
};

export type WhatsAppContext = {
  title?: string | null;
  message?: string | null;
};

function normalizePhoneNumber(phoneNumber: string) {
  const normalized = phoneNumber.replace(/\D/g, "");

  if (!normalized) {
    throw new Error("A WhatsApp phone number is required to create a CTA URL.");
  }

  return normalized;
}

function buildMessage(config: WhatsAppConfig, context?: WhatsAppContext) {
  if (context?.message) {
    return context.message;
  }

  if (context?.title && config.contextTemplate) {
    return config.contextTemplate.replaceAll("{{title}}", context.title);
  }

  return config.defaultMessage;
}

export function createWhatsAppUrl(config: WhatsAppConfig, context?: WhatsAppContext) {
  const phoneNumber = normalizePhoneNumber(config.phoneNumber);
  const message = buildMessage(config, context);

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
