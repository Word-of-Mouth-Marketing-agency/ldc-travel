import Image from "next/image";
import Link from "next/link";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import type { SocialLink } from "../../content/homepage-demo";
import { DesignYourTripProvider, DesignYourTripTrigger } from "./DesignYourTripModal";
import { MobileNav } from "./MobileNav";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Contact", href: "/contact" },
];

export function Header({ activePath = "/", socialLinks, whatsappConfig }: { activePath?: string; socialLinks: SocialLink[]; whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig);

  return (
    <DesignYourTripProvider whatsappHref={whatsappHref}>
      <header className="site-header">
        <div className="site-container header-inner">
          <Link className="brand-link" href="/" aria-label="LDC Travel home">
            <Image className="brand-logo" src="/brand/ldc-logo-blue.webp" alt="LDC Travel" width={176} height={112} priority />
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.label} className={item.href === activePath ? "active" : ""} href={item.href} aria-current={item.href === activePath ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>
          <DesignYourTripTrigger className="header-cta" />
          <MobileNav activePath={activePath} items={navItems} socialLinks={socialLinks} />
        </div>
      </header>
    </DesignYourTripProvider>
  );
}
