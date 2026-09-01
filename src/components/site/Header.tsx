import Image from "next/image";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import type { SocialLink } from "../../content/homepage-demo";
import { MobileNav } from "./MobileNav";
import { PlaceholderLink } from "./PlaceholderLink";
import { WhatsAppIcon } from "./WhatsAppIcon";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Contact", href: "#" },
];

export function Header({ socialLinks, whatsappConfig }: { socialLinks: SocialLink[]; whatsappConfig: WhatsAppConfig }) {
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
        <a className="header-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={17} />
          <span>Inquire on WhatsApp</span>
        </a>
        <MobileNav items={navItems} socialLinks={socialLinks} whatsappHref={whatsappHref} />
      </div>
    </header>
  );
}
