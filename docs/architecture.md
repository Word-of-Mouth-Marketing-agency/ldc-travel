# LDC Travel Architecture Notes

## Product shape

LDC Travel is a modular-monolith Next.js application with Payload embedded for admin-only editorial management. The public experience reads CMS content server-side; there is no booking or commerce subsystem.

## Market model

Editorial records relate to one or more Market records. The launch configuration resolves one active public market (Egypt) and public queries must scope content through that market seam. Pricing, currency, offers, availability, contact details, WhatsApp, and SEO can vary by market without duplicating the entire collection model. Saudi Arabia is not seeded or displayed in this phase.

## CMS ownership

Payload owns editorial and global configuration data. The collections and globals are wired in `payload.config.ts`; shared field factories keep slugs, statuses, market visibility, and SEO metadata consistent. Admin authentication is provided by the Users collection, with no public registration.

## Homepage content contract

The Homepage global owns hero copy/image/CTAs, trust benefits, and ordered relationships for featured destinations, popular programs, active offer, upcoming events, testimonials, guides, and FAQs. This keeps an editor-friendly homepage composition without turning every visual fragment into an independent collection.

## WhatsApp seam

`src/lib/whatsapp.ts` is the single interface for contextual CTA URL creation. It normalizes the stored number and encodes either the default message, an editor-provided context template, or an explicit message. Future UI modules should call this helper rather than storing repeated `wa.me` URLs.

## SEO seam

`src/lib/seo.ts` provides a framework-native metadata builder for title, description, canonical URLs, Open Graph, and Twitter metadata. Public route work will add `sitemap.ts`, `robots.ts`, and truthful JSON-LD where a schema matches visible content.

## Homepage implementation

The Phase 1 homepage modules are Header, MobileNav, Hero, SectionHeader, TrustBenefit, DestinationCard, TravelProgramCard, PromoBanner, EventCard, TestimonialCard, GuideCard, FAQAccordion, WhatsAppCTA, and Footer. They receive normalized view models from `src/lib/homepage.ts`; Payload response shapes do not leak into presentation components. The page is server-rendered and the mobile menu is the only client interaction island. FAQ uses native `details` disclosure for keyboard and screen-reader behavior.

When `DATABASE_URL` is configured, the homepage reads the Homepage and Site Settings globals with relationship depth and uses their selected editorial records. If CMS access is unavailable, the isolated `src/content/homepage-demo.ts` view model is used only in development. Production throws a non-sensitive `HomepageDataError`, which the page-level unavailable state turns into an explicit retry view; the route error boundary remains for unexpected failures. Demo content is never silently served in production.

## Demo image contract

Destination, program, event, guide, offer, and homepage hero records support an optional `imageUrl` for approved remote demo imagery. Production editors should prefer the existing Payload Media upload relation; the normalized image reader uses a Media URL first and falls back to the remote field or isolated demo content. External URLs are accepted only over HTTPS from `images.unsplash.com` or `images.pexels.com`; malformed or unapproved values fall back safely. Next Image is restricted to these hosts in `next.config.mjs`.

The repeatable `pnpm seed` script creates missing Egypt market content, relationships, global configuration, and clearly marked demo testimonials. It never updates an existing record, so it cannot replace real editorial content on repeated runs.

## Local CMS runtime status

The local PostgreSQL Windows service is running and accepting connections, but no safe local database credential is currently available in the repository environment. Therefore Payload admin access, the seed against PostgreSQL, and a CMS-backed homepage response remain unverified. The seed exits before importing Payload when `DATABASE_URL` or `PAYLOAD_SECRET` is absent.

## Deferred choices

Motion, shadcn/ui, analytics, inquiry persistence, final deployment architecture, and a favicon/icon-only asset are deliberately deferred until their concrete requirements are known.
