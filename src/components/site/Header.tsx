import Image from "next/image";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { MobileNav } from "./MobileNav";
import { PlaceholderLink } from "./PlaceholderLink";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Contact", href: "#" },
];

export function Header({ whatsappConfig }: { whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <PlaceholderLink className="brand-link" aria-label="LDC Travel home">
          <Image className="brand-logo" src="/brand/main-logo.webp" alt="LDC Travel" width={92} height={92} priority />
        </PlaceholderLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <PlaceholderLink key={item.label} className={item.label === "Home" ? "active" : ""}>
              {item.label}
            </PlaceholderLink>
          ))}
        </nav>
        <a className="header-cta" href={whatsappHref} target="_blank" rel="noreferrer">
          <Icon name="chat" size={16} />
          <span>Inquire on WhatsApp</span>
        </a>
        <MobileNav items={navItems} whatsappHref={whatsappHref} />
      </div>
    </header>
  );
}
