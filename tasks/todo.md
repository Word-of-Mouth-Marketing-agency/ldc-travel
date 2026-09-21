# LDC Travel Foundation and Phase 1 Checklist

## Specification and scope

- [x] Review the approved homepage reference image.
- [x] Record the no-homepage-UI and no-newsletter constraints.
- [x] Record the Egypt-first / Saudi-ready market strategy.
- [x] Record the WhatsApp-first conversion model.
- [x] Record the Contact inquiry persistence decision and admin-only access model.

## Foundation

- [x] Initialize Next.js with pnpm, TypeScript, App Router, Tailwind, and linting.
- [x] Add Payload, Lexical, PostgreSQL adapter, and image processing support.
- [x] Add Payload route wrappers and config path aliases.
- [x] Define admin users, media, market, editorial collections, and globals.
- [x] Add temporary frontend route only.

## Assets and documentation

- [x] Copy selected official logo variants into `public/brand/`.
- [x] Document every source asset inspected and intended usage.
- [x] Add `.env.example` with names only.
- [x] Add README with local setup and scope boundaries.
- [x] Add architecture and Phase 1 handoff notes.
- [x] Create/update the LDC Travel Brain project note.

## Phase 1 homepage

- [x] Replace the foundation placeholder with the approved homepage composition at `/`.
- [x] Implement responsive Header, Hero, Destinations, Programs, Offer, Events, Testimonials, Guides, FAQ, and Footer sections.
- [x] Use the shared WhatsApp helper for generic and contextual inquiry CTAs.
- [x] Add a CMS-backed homepage adapter with an isolated demo fallback.
- [x] Add optional remote demo image fields while preserving Payload Media relations.
- [x] Add a repeatable, non-destructive Egypt-only demo seed script.
- [x] Exclude newsletter, booking/search, Saudi public content, and all other public pages beyond the focused Contact route.
- [x] Validate responsive CSS, semantic landmarks, keyboard states, alt text, reduced motion, and scope exclusions.

## Stabilization pass

- [x] Keep demo homepage data development-only and render an explicit production unavailable state when CMS access is missing.
- [x] Align the supplied LDC contact details and social URLs across CMS defaults, demo data, seed data, footer, and docs.
- [x] Prefer uploaded Payload Media and safely reject malformed or unapproved remote image URLs.
- [x] Document the local PostgreSQL/Payload verification boundary without inventing credentials.

## Homepage refinement

- [x] Remove the Trust/Benefits module and its now-dead Homepage global field.
- [x] Replace improvised UI glyphs and rating stars with the shared Lucide icon system and recognizable social marks.
- [x] Add restrained CSS hover/entrance interactions and preserve prefers-reduced-motion behavior.
- [x] Add selective GSAP hero and section-heading text reveals with cleanup and reduced-motion fallback.

## Contact page and inquiry flow

- [x] Add `/contact` with compact hero, quick contact actions, form/details composition, WhatsApp fallback, socials, and reused site chrome.
- [x] Update shared Header, mobile drawer, and Footer Contact links to `/contact`; keep future unbuilt routes as `#`.
- [x] Add admin-only Inquiries collection with constrained status/type fields and Payload timestamps.
- [x] Add server-side inquiry validation, honeypot handling, server action persistence, and clear database-unavailable behavior.
- [x] Generate Payload types and verify the import-map generator after schema registration.
- [ ] Verify live Contact persistence and Payload admin workflow after safe local credentials are configured.

## Destination-first Phase 1 redesign

- [x] Review the current homepage and mobile experience through the UI/UX design route.
- [x] Replace the old public homepage sections with destination-first structure.
- [x] Include exactly Turkey, Russia, Bali, Georgia, Indonesia, and Thailand in preview/demo data.
- [x] Remove public homepage usage and seed creation for programs, offers, events, testimonials, and guides.
- [x] Add Why LDC, inspiration, and destination CTA CMS fields.
- [x] Apply #336DD5 / #FFD200 tokens, scrollbar, shared chrome, SEO copy, and supplied logos.
- [x] Keep legacy collections intact for a later explicit schema migration.
- [x] Preserve UI_PREVIEW_MODE and strict production CMS-unavailable behavior.
- [x] Keep destination detail/listing pages, research, forms, deployment, and production PostgreSQL out of scope.

## Phase 2 destination system

- [x] Research all six approved destinations from official tourism, government, and UNESCO sources.
- [x] Add readable source notes in `docs/destination-sources.md`.
- [x] Add `/destinations` with exactly six destination cards and real detail links.
- [x] Add reusable `/destinations/[slug]` detail architecture for all six slugs.
- [x] Add structured CMS fields for overview, highlights, experiences, best time, useful information, related destinations, and FAQs.
- [x] Reuse admin-only Inquiries with a destination relationship and `destination-page` source.
- [x] Add destination Name, Email, and Phone form with server validation, honeypot, preview-safe failure, and production persistence boundary.
- [x] Update WhatsApp to `+9667277981053` through the centralized helper.
- [x] Update homepage, header, mobile drawer, footer, and SEO links for functional destination routes.
- [x] Preserve preview fallback and strict production CMS-unavailable behavior.
- [x] Generate Payload types/import map and run typecheck/lint/build/diff validation.

## Phase 3 local CMS runtime validation

- [ ] Docker Desktop Linux engine is usable for this project.
- [x] Verify the user-provided isolated LDC PostgreSQL target at `127.0.0.1:55432` without touching native PostgreSQL.
- [x] Verify the ignored local `.env` is present without printing or tracking credentials.
- [x] Generate/review/apply Payload migrations against the empty project database.
- [x] Run seed twice and prove no duplicate destinations/globals/supporting records.
- [x] Verify `/admin` first-admin flow without inventing credentials.
- [x] Verify CMS-backed homepage, Contact, listing, and six detail routes.
- [x] Persist and inspect one fake destination inquiry and one fake Contact inquiry, then remove only those test records.
- [x] Verify anonymous inquiry collection creation is denied with `403`.
- [ ] Verify local media upload and Media-over-`imageUrl` resolution.
- [x] Exercise strict failure and preview regression.
- [ ] Exercise database restart/recovery and backup validation.

### Phase 3 verified evidence — 2026-09-21

Payload `3.88.0` applied `20260921_112401_initial_schema`, the seed created exactly six approved destinations and was idempotent on the second run, and strict production-style HTTP checks passed for the public route matrix. The first-user admin screen was reachable but no credentials were created. The two inquiry server actions persisted the expected source/type/relationship records and removed the marked test records afterward. Media/authenticated CRUD, restart/recovery, and backup checks remain intentionally unstarted; Docker commands were not run in this continuation.

## Verification

- [x] Run dependency install successfully.
- [x] Run typecheck.
- [x] Run lint.
- [x] Run production build.
- [x] Inspect Git status.
- [ ] Create baseline commit if checks are coherent.
- [ ] Create separate Phase 1 commit after the foundation baseline exists and Git author identity is configured.

## Phase 4 editorial and SEO QA

- [x] Re-research all six approved destinations from official tourism and heritage sources and refresh the source map.
- [x] Refine destination summaries, overviews, seasonal guidance, stable useful information, CTAs, and image alt text without introducing unstable travel claims.
- [x] Audit homepage/listing/contact copy for destination-first language and remove no public retired-model claims.
- [x] Add environment-driven canonical metadata, Open Graph descriptions/images, preview noindex, sitemap, and robots rules.
- [x] Add truthful Organization, WebSite, BreadcrumbList, and TouristDestination structured data without product, price, booking, or rating schemas.
- [x] Clarify Destination CMS editorial help text and preserve non-destructive seed behavior.
- [ ] Run final browser/responsive QA as the separate Phase 5 scope.
