# LDC Travel Architecture Notes

## Product shape

LDC Travel is a modular-monolith Next.js application with Payload embedded for admin-only editorial management. The public experience is now destination-first lead generation: visitors explore a focused set of international destinations, send an inquiry, and continue with a human conversation. There is no public programs catalog, package pricing, events/festivals surface, booking engine, checkout, payment system, or customer account system.

The public routes implemented are `/`, `/about`, `/contact`, `/destinations`, and the six approved destination detail routes under `/destinations/[slug]`.

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

The authoritative brand colors are `#123665` navy and `#FF6400` orange, with cool neutral surfaces and dark navy text. Montserrat remains the UI/control/navigation font loaded through `next/font/google`. The current supplied logo variants are copied into `public/brand/`:

- `ldc-logo-navy.webp` — light header, mobile drawer, and structured-data logo
- `ldc-logo-orange.webp` — navy footer and dark branded surfaces

The favicon and Apple icon use a transparent, square crop of the recognizable emblem from `ldc-logo-navy.webp`; the original full-lockup source remains untouched.

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

## Editorial SEO behavior

Public page titles and descriptions are route-specific and written in the destination-first editorial voice. Canonicals and absolute sitemap URLs are driven by `NEXT_PUBLIC_SITE_URL`, with the confirmed production value documented as `https://ldc-tourism.com` but still supplied through the environment rather than hardcoded in components. When the explicit server-side `UI_PREVIEW_MODE=true` flag is enabled, public metadata is `noindex,nofollow` and `robots.txt` disallows crawling the preview. Normal production mode emits indexable metadata, allows public routes, and disallows only `/admin` and `/api`.

The frontend emits one truthful Organization/WebSite graph, plus BreadcrumbList and TouristDestination data on destination detail pages. No Product, Offer, Trip, Hotel, AggregateRating, or FAQPage schema is emitted because the public site has no prices, booking flow, ratings, or eligible structured FAQ presentation.

## Contact and inquiry seam

`src/app/(frontend)/contact/page.tsx` remains a server-rendered Contact page that reuses Site Settings, shared navigation/footer, and the WhatsApp conversion path. The reusable destination detail template adds a Name, Email, and Phone form bound to the current destination. Persistence remains admin-only through the existing Inquiries collection, which now stores an optional destination relationship; missing credentials never produce a success state.

## WhatsApp seam

`src/lib/whatsapp.ts` is the single interface for contextual CTA URL creation. The destination-first demo uses `+9667277981053` and messages such as “I'm interested in Turkey and would like more information.” UI modules call this helper rather than embedding repeated `wa.me` URLs.

## Homepage implementation

The homepage modules are Header, MobileNav, Hero, Destinations, Why LDC, Destination Inspiration, Destination CTA, FAQ, Footer, and Floating WhatsApp. They receive normalized view models from `src/lib/homepage.ts`; Payload response shapes do not leak into presentation components. The page remains server-rendered, with isolated client islands for mobile navigation and GSAP hero/heading reveals. FAQ uses native `details` disclosure for keyboard and screen-reader behavior.

When `DATABASE_URL` is configured, the homepage reads the Homepage and Site Settings globals with relationship depth and scopes featured destinations through the active Egypt market. If CMS access is unavailable, the isolated demo view model is used in development and only when the explicit server-side `UI_PREVIEW_MODE=true` flag is enabled for a temporary database-free client preview. In normal production, CMS/configuration failures render an explicit unavailable state.

## Image contract

Production editors should prefer Payload Media uploads. Optional demo image URLs accept same-app paths such as `/hero-travel.webp` or HTTPS images from `images.unsplash.com` and `images.pexels.com`; malformed or unapproved values fall back safely. Next Image is restricted to those hosts. The homepage demo/seed hero now uses the verified [Maya Bay, Phi Phi Islands photo](https://unsplash.com/photos/boats-on-turquoise-maya-bay-water-TejFa7VW5e4), represented by Unsplash image `photo-1534008897995-27a23e859048`; the supplied `hero-travel.webp` remains available as a legacy local asset. The destination CTA reuses the current normalized hero image as a lightweight supporting visual, so no additional CMS field is required.

## Destination detail contract

Destination pages are researched from official tourism authorities, government portals, UNESCO where relevant, reputable destination authorities, and established geographic/travel references. Content is original concise paraphrase with source URLs recorded in `docs/destination-sources.md`. Each detail page contains a destination hero, overview, key places, recommended experiences, best time to visit, useful travel information, gallery, inquiry CTA, and a destination-specific inquiry form with Name, Email, and Phone. Changing visa, safety, currency, and entry information is dated or omitted rather than presented as evergreen fact.

The Destinations collection now supports structured overview, highlights, experiences, best-time guidance, useful information, gallery uploads, related destinations, and FAQ relationships. The public template remains server-rendered, while the inquiry form is the only destination-specific client island.

## Production-readiness boundaries

The production start script uses Next's native server with `--hostname 127.0.0.1`; deployment, OpenLiteSpeed, WOM-VPS-01, PostgreSQL credentials, DNS, and SSL remain deferred. `PAYLOAD_MEDIA_DIR` is deployment-managed and no production storage configuration is part of this redesign. Phase 6 preparation documents are maintained in `docs/production-environment.md`, `docs/deployment-runbook.md`, and `docs/launch-checklist.md`.

The application exposes a lightweight liveness endpoint at `/api/health`. It returns only the service name and an `ok` status, does not connect to PostgreSQL, and sends `Cache-Control: no-store`; database readiness remains an operator smoke check rather than a public health response.

## Phase 3 local CMS runtime status

The local CMS runtime was verified on 2026-09-21 against the user-provided isolated PostgreSQL target `127.0.0.1:55432/ldc_travel_dev` using the project Payload adapter. The ignored `.env` was not printed, tracked, or changed. An explicit initial migration was generated and applied; `migrate:status` reports batch 1 as applied. The seed ran twice and produced exactly six approved destinations, six homepage destination relationships, and five homepage FAQs without duplicate creation. Site Settings returned the configured `+966 7277981053` display value and `9667277981053` URL value.

Production-style local HTTP checks passed for the homepage, Contact, destination listing, all six CMS-backed detail routes, `/admin`, favicon assets, WhatsApp links, and configured social links. The server actions persisted and then removed marked local contact/destination test inquiries; anonymous collection creation returned `403`. Preview mode rendered all public routes with empty database credentials and returned explicit non-success form notices. Preview-disabled empty-credential checks rendered the strict unavailable state. Numeric Payload relationship IDs are normalized before market visibility checks so valid CMS records do not fall back silently.

Phase 6 verified a local `pg_dump -Fc` archive with `pg_restore --list`, restored it into a disposable database, checked the six destinations, homepage/inquiries schema, and migration records, and removed only the disposable database and temporary archive. Authenticated admin CRUD/media upload remains pending because the local Payload instance still requires first-user creation. The read-only WOM-VPS-01 audit could not connect from this environment, so prior Brain server notes are treated as stale planning context rather than current production evidence. No native PostgreSQL or production system was changed, and production deployment remains deferred.
