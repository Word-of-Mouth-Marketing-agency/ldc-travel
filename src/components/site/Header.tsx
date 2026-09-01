import Image from "next/image";
import Link from "next/link";

import { createWhatsAppUrl, type WhatsAppConfig } from "../../lib/whatsapp";
import { Icon } from "../homepage/Icon";
import { MobileNav } from "./MobileNav";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Travel Programs", href: "/programs" },
  { label: "Festivals & Events", href: "/festivals" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header({ whatsappConfig }: { whatsappConfig: WhatsAppConfig }) {
  const whatsappHref = createWhatsAppUrl(whatsappConfig);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link className="brand-link" href="/" aria-label="LDC Travel home">
          <Image className="brand-logo" src="/brand/main-logo.webp" alt="LDC Travel" width={92} height={92} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} className={item.href === "/" ? "active" : ""} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="header-cta" href={whatsappHref} target="_blank" rel="noreferrer">
          <span>Inquire on WhatsApp</span>
          <Icon name="arrow" />
        </a>
        <MobileNav items={navItems} whatsappHref={whatsappHref} />
      </div>
    </header>
  );
}
