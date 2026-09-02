import Image from "next/image";
import Link from "next/link";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import type { SocialLink } from "../../content/homepage-demo";
import { MobileNav } from "./MobileNav";
import { WhatsAppIcon } from "./WhatsAppIcon";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

export function Header({ activePath = "/", socialLinks, whatsappConfig }: { activePath?: string; socialLinks: SocialLink[]; whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link className="brand-link" href="/" aria-label="LDC Travel home">
          <Image className="brand-logo" src="/brand/main-logo.webp" alt="LDC Travel" width={92} height={92} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.label} className={item.href === activePath ? "active" : ""} href={item.href} aria-current={item.href === activePath ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="header-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon size={17} />
          <span>Inquire on WhatsApp</span>
        </a>
        <MobileNav activePath={activePath} items={navItems} socialLinks={socialLinks} whatsappHref={whatsappHref} />
      </div>
    </header>
  );
}
