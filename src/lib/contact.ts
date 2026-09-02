import { demoHomepage, type SiteViewModel } from "../content/homepage-demo";
import { buildSite, buildWhatsappConfig } from "./homepage";
import { isUiPreviewMode } from "./preview";
import type { WhatsAppConfig } from "./whatsapp";

export class ContactDataError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "ContactDataError";
  }
}

export type ContactData = {
  site: SiteViewModel;
  whatsappConfig: WhatsAppConfig;
};

function developmentFallback(): ContactData {
  if (process.env.NODE_ENV !== "development" && !isUiPreviewMode()) {
    throw new ContactDataError("Contact settings are unavailable.");
  }

  return {
    site: demoHomepage.site,
    whatsappConfig: demoHomepage.whatsappConfig,
  };
}

export async function getContactData(): Promise<ContactData> {
  if (isUiPreviewMode()) return developmentFallback();
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return developmentFallback();

  try {
    const { getPayload } = await import("payload");
    const { default: config } = await import("../../payload.config");
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({ slug: "site-settings", depth: 1 });
    const site = buildSite(settings);

    return {
      site,
      whatsappConfig: buildWhatsappConfig(site),
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "development") {
      throw new ContactDataError("Contact settings are unavailable.", error);
    }

    return developmentFallback();
  }
}
