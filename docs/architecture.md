# LDC Travel Architecture Notes

## Product shape

LDC Travel is a modular-monolith Next.js application with Payload embedded for admin-only editorial management. The public experience reads CMS content server-side; there is no booking or commerce subsystem. The homepage and the focused Contact page are the currently implemented public routes.

## Market model

Editorial records relate to one or more Market records. The launch configuration resolves one active public market (Egypt) and public queries must scope content through that market seam. Pricing, currency, offers, availability, contact details, WhatsApp, and SEO can vary by market without duplicating the entire collection model. Saudi Arabia is not seeded or displayed in this phase.

## CMS ownership

Payload owns editorial and global configuration data. The collections and globals are wired in `payload.config.ts`; shared field factories keep slugs, statuses, market visibility, and SEO metadata consistent. Admin authentication is provided by the Users collection, with no public registration.

## Homepage content contract

The Homepage global owns hero copy/image/CTAs and ordered relationships for featured destinations, popular programs, active offer, upcoming events, testimonials, guides, and FAQs. This keeps an editor-friendly homepage composition without turning every visual fragment into an independent collection.

## Contact and inquiry seam

`src/app/(frontend)/contact/page.tsx` is a server-rendered Contact page that reuses Site Settings, the shared Header/Footer/Floating WhatsApp components, and the existing GSAP hero reveal. `src/app/(frontend)/contact/actions.ts` is the server-only form mutation boundary. It validates the submitted fields, ignores client-controlled `source`/`status`, and creates a new record with `source: "contact-page"` and `status: "new"` through Payload's Local API with explicit access override.

The `Inquiries` collection is admin-only for read, update, and delete operations and denies normal public create access. The server action is the only public application path that can create records. It uses bounded manual validation because Zod is not installed in the foundation, rejects a filled honeypot, does not log submitted PII, and returns a generic WhatsApp fallback when Payload/PostgreSQL credentials or persistence are unavailable. Payload timestamps provide `createdAt`/`updatedAt`; no duplicate timestamp fields are defined.

## WhatsApp seam

`src/lib/whatsapp.ts` is the single interface for contextual CTA URL creation. It normalizes the stored number and encodes either the default message, an editor-provided context template, or an explicit message. Future UI modules should call this helper rather than storing repeated `wa.me` URLs.

## SEO seam

`src/lib/seo.ts` provides a framework-native metadata builder for title, description, canonical URLs, Open Graph, and Twitter metadata. Public route work will add `sitemap.ts`, `robots.ts`, and truthful JSON-LD where a schema matches visible content.

## Homepage implementation

The Phase 1 homepage modules are Header, MobileNav, Hero, SectionHeader, DestinationCard, TravelProgramCard, PromoBanner, EventCard, TestimonialCard, GuideCard, FAQAccordion, WhatsAppCTA, and Footer. They receive normalized view models from `src/lib/homepage.ts`; Payload response shapes do not leak into presentation components. General interface icons use the shared Lucide wrapper, while the four configured social networks use small recognizable brand marks. The page remains server-rendered, with isolated client islands for mobile navigation, the hero GSAP timeline, and section-heading reveals. FAQ uses native `details` disclosure for keyboard and screen-reader behavior.

When `DATABASE_URL` is configured, the homepage reads the Homepage and Site Settings globals with relationship depth and uses their selected editorial records. If CMS access is unavailable, the isolated `src/content/homepage-demo.ts` view model is used in development and only when the explicit server-side `UI_PREVIEW_MODE=true` flag is enabled for a temporary database-free client UI preview. In normal production, a non-sensitive `HomepageDataError` reaches the page-level unavailable state as an explicit retry view; the route error boundary remains for unexpected failures. Demo content is never silently served in production without the preview flag.

## Demo image contract

Destination, program, event, guide, offer, and homepage hero records support an optional `imageUrl` for approved demo imagery. Production editors should prefer the existing Payload Media upload relation; the normalized image reader uses a Media URL first and falls back to the same-app path or approved remote field. External URLs are accepted only over HTTPS from `images.unsplash.com` or `images.pexels.com`; malformed or unapproved values fall back safely. Next Image is restricted to these hosts in `next.config.mjs`.

The repeatable `pnpm seed` script creates missing Egypt market content, relationships, global configuration, and clearly marked demo testimonials. It preserves existing editorial records on repeated runs, while allowing narrowly scoped migrations of recognized legacy demo homepage references.

## Production-readiness boundaries

The production start script uses Next's native server with `--hostname 127.0.0.1`; the port remains runtime-supplied through `PORT` for a future same-host OpenLiteSpeed reverse proxy. `pnpm dev` is for local development only.

Payload Media uses a configurable `PAYLOAD_MEDIA_DIR` and defaults to the local `media` directory for development. A production deployment must provide a persistent upload path outside the replaceable application release directory. The final filesystem path and any object-storage adapter remain deployment decisions.

The project intentionally does not enable Next standalone output, a process manager, Docker production files, or reverse-proxy configuration yet. Those choices should be revisited together with the final Payload upload-storage strategy and deployment method. `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `PAYLOAD_SECRET`, `PORT`, and the optional media path are named in `.env.example`; no production values are tracked.

## Local CMS runtime status

The local PostgreSQL Windows service is running and accepting connections, but no safe local database credential is currently available in the repository environment. Therefore Payload admin access, the seed against PostgreSQL, and a CMS-backed homepage response remain unverified. The seed exits before importing Payload when `DATABASE_URL` or `PAYLOAD_SECRET` is absent.

## Deferred choices

Motion beyond the selective GSAP text reveals, shadcn/ui, analytics, final deployment architecture, and a favicon/icon-only asset are deliberately deferred until their concrete requirements are known. Multi-instance rate limiting and external anti-spam services remain deferred; the Contact page currently uses server validation, size bounds, and a honeypot.
