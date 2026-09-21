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
- [ ] Create isolated LDC-only PostgreSQL service on a verified free localhost port.
- [ ] Create ignored local `.env` with generated development-only credentials.
- [ ] Generate/review/apply Payload migrations against the empty project database.
- [ ] Run seed twice and prove no duplicate destinations/globals/supporting records.
- [ ] Verify `/admin` first-admin flow without inventing credentials.
- [ ] Verify CMS-backed homepage, Contact, listing, and six detail routes.
- [ ] Persist and inspect one fake destination inquiry and one fake Contact inquiry.
- [ ] Verify inquiry read/update/delete protection for unprivileged requests.
- [ ] Verify local media upload and Media-over-`imageUrl` resolution.
- [ ] Exercise strict failure, preview regression, database restart/recovery, and backup validation.

### Phase 3 blocked evidence — 2026-09-21

Docker client `29.8.0` and Compose `v5.5.1` are installed, but the `desktop-linux` daemon is unavailable. The native `postgresql-x64-17` Windows service was observed stopped and was not changed. Database creation and all live CMS/lead validation steps remain intentionally unstarted.

## Verification

- [x] Run dependency install successfully.
- [x] Run typecheck.
- [x] Run lint.
- [x] Run production build.
- [x] Inspect Git status.
- [ ] Create baseline commit if checks are coherent.
- [ ] Create separate Phase 1 commit after the foundation baseline exists and Git author identity is configured.
