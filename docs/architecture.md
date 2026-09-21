# LDC Travel Architecture Notes

## Product shape

LDC Travel is a modular-monolith Next.js application with Payload embedded for admin-only editorial management. The public experience is now destination-first lead generation: visitors explore a focused set of international destinations, send an inquiry, and continue with a human conversation. There is no public programs catalog, package pricing, events/festivals surface, booking engine, checkout, payment system, or customer account system.

The public routes implemented are `/`, `/contact`, `/destinations`, and the six approved destination detail routes under `/destinations/[slug]`.

## Current destination direction

The homepage shows exactly six approved destinations:

- Turkey
- Russia
- Bali
- Georgia
- Indonesia
- Thailand

Bali and Indonesia remain separate public destinations. Homepage and listing cards link to the reusable dynamic destination route, limited to the approved slugs `turkey`, `russia`, `bali`, `georgia`, `indonesia`, and `thailand`.

## Brand and shared UI

The authoritative brand colors are `#336DD5` blue and `#FFD200` yellow, with cool neutral surfaces and dark navy text. Montserrat remains the UI/control/navigation font loaded through `next/font/google`. The supplied logo variants are copied into `public/brand/`:

- `ldc-logo-blue.webp` — light header and mobile drawer
- `ldc-logo-yellow.webp` — blue footer and strong blue surfaces
- `ldc-logo-black.webp` — available for future light-background treatments

The existing icon-only favicon remains in place because the new supplied files are full lockups rather than a dedicated icon mark; cropping a wordmark into a favicon would distort the approved asset.

## CMS ownership

Payload owns editorial and global configuration data. Collections for older features (Travel Programs, Events, and Offers) remain registered for safe later migration, but they are no longer read by the homepage or created by the destination-first demo seed.

The Homepage global now owns:

- hero copy, image, and two CTAs
- ordered featured destination relationships
- Why LDC copy and icon-keyed items
- destination inspiration copy and image cards
- destination CTA copy and two CTAs
- ordered FAQ relationships

Testimonials and Guides are not currently shown because the available content is demo-only and does not strengthen the approved destination-first version. They remain separate CMS collections for an explicit future content decision.

## Market model

Editorial records relate to one or more Market records. The launch configuration resolves one active public market (Egypt), and public queries scope content through that market seam. The public homepage does not expose Saudi Arabia as a destination market. The confirmed WhatsApp value is `+9667277981053`, normalized to `9667277981053` for `wa.me` URLs and configured centrally.

## Contact and inquiry seam

`src/app/(frontend)/contact/page.tsx` remains a server-rendered Contact page that reuses Site Settings, shared navigation/footer, and the WhatsApp conversion path. The reusable destination detail template adds a Name, Email, and Phone form bound to the current destination. Persistence remains admin-only through the existing Inquiries collection, which now stores an optional destination relationship; missing credentials never produce a success state.

## WhatsApp seam

`src/lib/whatsapp.ts` is the single interface for contextual CTA URL creation. The destination-first demo uses `+9667277981053` and messages such as “I'm interested in Turkey and would like more information.” UI modules call this helper rather than embedding repeated `wa.me` URLs.

## Homepage implementation

The homepage modules are Header, MobileNav, Hero, Destinations, Why LDC, Destination Inspiration, Destination CTA, FAQ, Footer, and Floating WhatsApp. They receive normalized view models from `src/lib/homepage.ts`; Payload response shapes do not leak into presentation components. The page remains server-rendered, with isolated client islands for mobile navigation and GSAP hero/heading reveals. FAQ uses native `details` disclosure for keyboard and screen-reader behavior.

When `DATABASE_URL` is configured, the homepage reads the Homepage and Site Settings globals with relationship depth and scopes featured destinations through the active Egypt market. If CMS access is unavailable, the isolated demo view model is used in development and only when the explicit server-side `UI_PREVIEW_MODE=true` flag is enabled for a temporary database-free client preview. In normal production, CMS/configuration failures render an explicit unavailable state.

## Image contract

Production editors should prefer Payload Media uploads. Optional demo image URLs accept same-app paths such as `/hero-travel.webp` or HTTPS images from `images.unsplash.com` and `images.pexels.com`; malformed or unapproved values fall back safely. Next Image is restricted to those hosts. The supplied `hero-travel.webp` remains the local homepage hero fallback.

## Destination detail contract

Destination pages are researched from official tourism authorities, government portals, UNESCO where relevant, reputable destination authorities, and established geographic/travel references. Content is original concise paraphrase with source URLs recorded in `docs/destination-sources.md`. Each detail page contains a destination hero, overview, key places, recommended experiences, best time to visit, useful travel information, gallery, inquiry CTA, and a destination-specific inquiry form with Name, Email, and Phone. Changing visa, safety, currency, and entry information is dated or omitted rather than presented as evergreen fact.

The Destinations collection now supports structured overview, highlights, experiences, best-time guidance, useful information, gallery uploads, related destinations, and FAQ relationships. The public template remains server-rendered, while the inquiry form is the only destination-specific client island.

## Production-readiness boundaries

The production start script uses Next's native server with `--hostname 127.0.0.1`; deployment, OpenLiteSpeed, WOM-VPS-01, PostgreSQL credentials, DNS, and SSL remain deferred. `PAYLOAD_MEDIA_DIR` is deployment-managed and no production storage configuration is part of this redesign.

## Phase 3 local CMS runtime status

The application is configured for Payload's PostgreSQL adapter, but live local CMS verification remains blocked until Docker Desktop's `desktop-linux` engine is usable. The Docker client/Compose CLI are installed; the daemon check failed to connect to Docker's named pipe. The native Windows PostgreSQL service was not modified. No `.env`, local password, Compose service, migration, seed, admin user, database dump, or test media was created while the runtime prerequisite was unavailable.

Once Docker is ready, create an isolated LDC-only PostgreSQL service on a free localhost port, generate and review Payload migrations for the empty database, apply them, run the existing idempotent seed twice, and verify `/admin`, CMS-backed public routes, inquiry persistence, access control, media precedence, strict failure behavior, and preview-mode regression. The local backup boundary is a custom-format `pg_dump -Fc` followed by read-only `pg_restore --list`; restore testing must use a separate scratch database and is not production deployment.
