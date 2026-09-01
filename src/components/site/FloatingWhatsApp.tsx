import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp({ whatsappConfig }: { whatsappConfig: WhatsAppConfig }) {
  return (
    <a
      className="floating-whatsapp"
      href={createWhatsAppUrl(whatsappConfig)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with LDC Travel on WhatsApp"
      title="Chat with LDC Travel on WhatsApp"
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
