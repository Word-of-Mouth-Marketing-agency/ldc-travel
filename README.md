# LDC Travel

Destination-first production foundation for LDC Travel’s Egypt-first tourism marketing website.

This repository contains the application foundation, Payload CMS schema, official brand assets, the destination-first Phase 1 homepage implementation for `/`, the Phase 2 destination listing/detail system, and the Contact page/inquiry flow at `/contact`.

## Stack

- Next.js 16.3.3 (App Router)
- React 19.2.8
- TypeScript 5.9.3
- Tailwind CSS 4.3.3
- Payload CMS 3.88.0
- PostgreSQL through `@payloadcms/db-postgres` 3.88.0
- Lexical rich text through `@payloadcms/richtext-lexical` 3.88.0
- GSAP 3.15.0 for coordinated homepage text reveals
- Sharp 0.35.4 for media processing
- pnpm 11.1.1

The exact versions are pinned in `package.json` and `pnpm-lock.yaml`. Motion, shadcn/ui, Supabase, Firebase, Prisma, and third-party CMS services are not installed.

## Local setup

Requirements:

- Node.js 20.9+; Node 24 is supported by the current local toolchain.
- pnpm 11.x.
- A local PostgreSQL database and a connection string in `DATABASE_URL`.

1. Copy `.env.example` to `.env` and provide local values. Never commit `.env`.
2. Install dependencies with `pnpm install`.
3. Run `pnpm dev`.
4. Open `http://localhost:3000/admin` and create the first admin user.
5. Use `pnpm generate:types` and `pnpm generate:importmap` after CMS schema changes.

For a production-style local run, use `pnpm build` followed by `PORT=<runtime port> pnpm start`; the start script binds Next to `127.0.0.1` for a future same-host reverse proxy. Do not use `pnpm dev` in production. Set `PAYLOAD_MEDIA_DIR` to a deployment-managed persistent upload directory when deploying; the local `media` default must not be treated as release storage.

The Payload config uses development schema push by default and disables it in production. Phase 3 live CMS verification is a separate local-only workflow: it must use an isolated project-owned PostgreSQL service and explicit Payload migrations before any seed or admin verification is treated as real. Do not point this project at the native Windows PostgreSQL service or at a production database.

Production preparation is documented in [docs/production-environment.md](docs/production-environment.md), [docs/deployment-runbook.md](docs/deployment-runbook.md), and [docs/launch-checklist.md](docs/launch-checklist.md). These are planning documents only; no production deployment, database, process, DNS, SSL, or OpenLiteSpeed change has been performed.

## Phase 3 local CMS runtime status

The local CMS runtime was verified on 2026-09-21 against the user-provided isolated PostgreSQL database at `127.0.0.1:55432` (`ldc_travel_dev`, user `ldc_travel_dev`). The ignored `.env` was present and never printed, tracked, or modified. Payload migration `20260921_112401_initial_schema` was generated, reviewed, applied, and reported as applied by `migrate:status`; no reset, fresh, down, or drop shortcut was used.

The idempotent seed was run twice. The database contains exactly the six approved destinations (`bali`, `georgia`, `indonesia`, `russia`, `thailand`, `turkey`), six homepage destination relationships, five homepage FAQs, and the configured Saudi WhatsApp values `+966 7277981053` / `9667277981053`. Public contact output also exposes Egypt WhatsApp `+20 12 11118118` and the unified email `info@ldc-tourism.com`. A numeric Payload relationship-ID normalization fix was required so CMS market visibility did not incorrectly fall back to demo cards.

Strict production-style local routes rendered successfully for `/`, `/contact`, `/destinations`, and all six destination detail routes. `/admin` returned the first-user creation/login flow; no admin credentials were invented or created. The two server-action inquiry paths persisted marked local test records with the correct source/type/destination relationship, then those records were deleted. Anonymous direct `POST /api/inquiries` returned `403`. With `UI_PREVIEW_MODE=true` and empty database credentials, public routes rendered the demo UI and valid form submissions returned explicit non-success preview notices. With preview disabled and empty credentials, public routes rendered the explicit unavailable state instead of demo content.

The Phase 6 local backup/restore drill is complete: a temporary `pg_dump -Fc` archive passed `pg_restore --list`, restored into a disposable database, and validated the six destinations, homepage schema, inquiries schema, and migration records before the disposable database and archive were removed. Authenticated admin/media CRUD remains pending because Payload still shows the first-user setup screen; no credentials were invented. The allowed read-only WOM-VPS-01 SSH audit was attempted but was unavailable from this environment. Production PostgreSQL, deployment, and WOM-VPS-01 remain untouched. Never commit `.env`, dumps, or secrets.

## Commands

```text
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
pnpm generate:types
pnpm generate:importmap
```

## Project map

- `src/app/(frontend)` — public application route group, homepage, destination routes, and Contact page/server actions.
- `src/components` — server-first homepage/destination sections plus isolated mobile navigation, inquiry forms, and GSAP text-reveal islands.
- `src/content/homepage-demo.ts` — isolated destination-first development-only fallback/demo view model used when a local CMS database is not configured.
- `src/content/destinations-data.json` — researched, original demo destination content shared by preview fallback and the repeatable seed.
- `src/app/(payload)` — Payload admin/API integration.
- `src/collections` — admin users, media, markets, and editorial collections.
- `src/globals` — Site Settings and Homepage globals.
- `src/fields` — shared Payload field factories.
- `src/lib` — deep modules for WhatsApp, market context, metadata, homepage normalization, and destination normalization.
- `public/brand` — copied official LDC logo variants.
- `specs/001-foundation/spec.md` — product, architecture, CMS, and Phase 1 acceptance criteria.
- `tasks/plan.md` and `tasks/todo.md` — dependency-ordered implementation plan.
- `scripts/seed.mjs` — repeatable, non-destructive demo seed for a configured local Payload database.

The Contact page uses Site Settings for verified LDC contact/social details. Its inquiry form validates on the server and writes to the admin-only Inquiries collection through a server action when local Payload credentials are available. Without `DATABASE_URL` and `PAYLOAD_SECRET`, development shows the form but submission fails clearly with a WhatsApp fallback; inquiries are never stored in temporary files or treated as successfully submitted.

## Public routes and product boundaries

The public routes are `/`, `/about`, `/contact`, `/destinations`, and `/destinations/turkey`, `/destinations/russia`, `/destinations/bali`, `/destinations/georgia`, `/destinations/indonesia`, and `/destinations/thailand`. Detail pages use one reusable dynamic route and offer a destination-scoped Name, Email, and Phone inquiry form; there is no direct booking or payment flow.

The site is destination-led lead generation only: no travel programs, package pricing, events, booking engine, checkout, payments, customer accounts, or public CMS registration are exposed on the public website. WhatsApp is the primary CTA. The launch market is Egypt; the current configured primary WhatsApp conversion number is `+9667277981053` in normalized `wa.me` form, with Egypt WhatsApp `+201211118118` also exposed in contact details. The only public email is `info@ldc-tourism.com`. The current language is English only, with logical layout choices preserved for later RTL support.

The new authoritative Phase 1 direction is a destination-first homepage using `#336DD5` blue and `#FFD200` yellow. It includes a split hero, exactly six approved destinations (Turkey, Russia, Bali, Georgia, Indonesia, Thailand), Why LDC positioning, destination inspiration, a destination CTA, FAQ, and footer. The prior screenshot and its newsletter/program/event composition are historical reference only; no newsletter or booking/search widget is included.

## Homepage and destination development

With `DATABASE_URL` and `PAYLOAD_SECRET` configured for a local database, run `pnpm seed` to create missing Egypt-only market/destination/FAQ records, enrich missing destination-detail fields, and maintain destination-first homepage relationships. Existing editorial fields are preserved on repeated runs; the seed does not create new programs, offers, events, testimonials, or guides. During development or explicit preview mode without a database, `/`, `/destinations`, and all six detail routes render the isolated researched demo view model so the frontend can be reviewed safely.

The demo view model is development-only by default. For a temporary database-free Vercel client UI preview, set the server-side `UI_PREVIEW_MODE=true`; this explicit flag allows the public homepage and Contact page to use the safe demo view model without PostgreSQL. Never enable it on the real production VPS site. In production without that flag, a missing database configuration, unavailable Payload connection, or missing public Egypt market causes the homepage to render an explicit unavailable state; it never silently serves demo content.

The homepage prefers uploaded Payload Media for editorial imagery. Optional `imageUrl` fields are for approved demo imagery only and accept same-app paths such as `/hero-travel.webp` or HTTPS images from `images.unsplash.com` and `images.pexels.com`; malformed or unapproved values are ignored safely. The current demo/seed hero uses verified Cappadocia imagery, and `/hero-travel.webp` is retained only as a legacy local asset.

## Verified LDC contact channels

- Egypt office: `15 Mahmoud Essmat Hamdy, Sheraton`
- WhatsApp: `+9667277981053`
- WhatsApp: Egypt `+20 12 11118118`; Saudi Arabia `+966 7277981053`
- Email: `info@ldc-tourism.com`
- Instagram: <https://www.instagram.com/ldctravels.eg/>
- Facebook: <https://www.facebook.com/profile.php?id=61591627376189>
- TikTok: <https://www.tiktok.com/@ldc.travel.agency>
- LinkedIn: <https://www.linkedin.com/company/ldctravel/>

## Research and content safety

Phase 2 destination copy is concise original paraphrase based on official tourism authorities and UNESCO where relevant. The source list is maintained in [docs/destination-sources.md](docs/destination-sources.md). Unstable visa, entry, safety, and border guidance is intentionally omitted from the public destination pages.

Phase 4 editorial SEO QA keeps the six destination pages differentiated, uses source-backed stable context, and maintains meaningful image alt text. The confirmed production canonical origin is `https://ldc-tourism.com`; set `NEXT_PUBLIC_SITE_URL` to that value during the approved deployment so canonical links and `sitemap.xml` resolve to the real host. Explicit `UI_PREVIEW_MODE=true` previews are noindex/nofollow and disallowed in `robots.txt`; normal production mode remains crawlable for public routes.

## Source assets

The source directory `A:/Projects/Travel-content` is reference-only and must not be modified. Selected official logos are copied into `public/brand/`; see `docs/asset-inventory.md` for the inspected files, variants, dimensions, and intended usage.
