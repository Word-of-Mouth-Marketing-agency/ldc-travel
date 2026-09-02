# LDC Travel

Production foundation for LDC Travel’s Egypt-first tourism marketing website.

This repository contains the application foundation, Payload CMS schema, official brand assets, the Phase 1 homepage implementation for `/`, and the Contact page/inquiry flow at `/contact`.

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

The Payload config uses development schema push by default and disables it in production. Migrations and deployment decisions are intentionally deferred until the VPS stack is specified.

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

- `src/app/(frontend)` — public application route group, homepage route, and Contact page/server action.
- `src/components` — server-first homepage sections plus isolated mobile navigation and GSAP text-reveal islands.
- `src/content/homepage-demo.ts` — isolated development-only fallback/demo view model used when a local CMS database is not configured.
- `src/app/(payload)` — Payload admin/API integration.
- `src/collections` — admin users, media, markets, and editorial collections.
- `src/globals` — Site Settings and Homepage globals.
- `src/fields` — shared Payload field factories.
- `src/lib` — deep modules for WhatsApp, market context, and metadata.
- `public/brand` — copied official LDC logo variants.
- `specs/001-foundation/spec.md` — product, architecture, CMS, and Phase 1 acceptance criteria.
- `tasks/plan.md` and `tasks/todo.md` — dependency-ordered implementation plan.
- `scripts/seed.mjs` — repeatable, non-destructive demo seed for a configured local Payload database.

The Contact page uses Site Settings for verified LDC contact/social details. Its inquiry form validates on the server and writes to the admin-only Inquiries collection through a server action when local Payload credentials are available. Without `DATABASE_URL` and `PAYLOAD_SECRET`, development shows the form but submission fails clearly with a WhatsApp fallback; inquiries are never stored in temporary files or treated as successfully submitted.

## Product boundaries

The site is lead-generation only: no booking engine, checkout, payments, customer accounts, or public CMS registration. WhatsApp is the primary CTA. The launch market is Egypt; Saudi Arabia is a future market and is not exposed in current public content. The current language is English only, with logical layout choices preserved for later RTL support.

The approved homepage screenshot at `A:/Projects/Travel-content/homepage-design.png` is the visual direction for the shipped Phase 1 homepage. Its newsletter section is excluded, and no booking/search widget is included.

## Homepage development

With `DATABASE_URL` and `PAYLOAD_SECRET` configured for a local database, run `pnpm seed` to create missing Egypt-only demo records and homepage relationships. Existing records are preserved on repeated runs. During development without a database, `/` renders the isolated demo view model so the frontend can be developed and reviewed safely.

The demo view model is development-only by default. For a temporary database-free Vercel client UI preview, set the server-side `UI_PREVIEW_MODE=true`; this explicit flag allows the public homepage and Contact page to use the safe demo view model without PostgreSQL. Never enable it on the real production VPS site. In production without that flag, a missing database configuration, unavailable Payload connection, or missing public Egypt market causes the homepage to render an explicit unavailable state; it never silently serves demo content.

The homepage prefers uploaded Payload Media for editorial imagery. Optional `imageUrl` fields are for approved demo imagery only and accept HTTPS images from `images.unsplash.com` or `images.pexels.com`; malformed or unapproved URLs are ignored safely.

## Verified LDC contact channels

- Egypt office: `15 Mahmoud Essmat Hamdy, Sheraton`
- WhatsApp: `+20 12 11118118`
- Email: `reservations@ldc-tourism.com`, `sales@ldc-tourism.com`
- Instagram: <https://www.instagram.com/ldctravels.eg/>
- Facebook: <https://www.facebook.com/profile.php?id=61591627376189>
- TikTok: <https://www.tiktok.com/@ldc.travel.agency>
- LinkedIn: <https://www.linkedin.com/company/ldctravel/>

## Source assets

The source directory `A:/Projects/Travel-content` is reference-only and must not be modified. Selected official logos are copied into `public/brand/`; see `docs/asset-inventory.md` for the inspected files, variants, dimensions, and intended usage.
