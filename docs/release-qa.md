# Phase 5 Release Candidate QA

Date: 2026-09-21

## Scope

Final browser, responsive, accessibility, SEO, regression, and runtime checks for the destination-first public site. No deployment, VPS, production database, or schema migration work was performed.

## Browser evidence

The available browser surface was the isolated Codex in-app Chromium browser. Chrome, Edge, and Firefox connectors were not available. The responsive matrix covered 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440, and 1920px widths. The document had no horizontal overflow, interactive labels were not clipped, and representative desktop/mobile screenshots were reviewed.

The mobile drawer passed focus trapping, Escape close, backdrop/link close, body scroll lock, and focus return. The homepage, Contact page, destination listing, and all six destination details rendered in preview mode. Invalid routes now use a branded not-found experience.

## Runtime evidence

- `UI_PREVIEW_MODE=true`: all public routes rendered without database credentials and showed the designed demo content.
- Strict mode with empty `DATABASE_URL` and `PAYLOAD_SECRET`: homepage, Contact, listing, and detail routes showed branded CMS-unavailable states without demo leakage.
- Strict mode with the configured local PostgreSQL environment: homepage, listing, Turkey detail, and Contact rendered from CMS-backed content.
- Public route image audit completed after normal scrolling with no broken images. The two obsolete broken demo image IDs were replaced, and the seed refreshes only those exact legacy URLs when encountered.

## Accessibility and regression evidence

The drawer keyboard path, native links/buttons, form labels, validation messages, `aria-invalid`, live regions, image alt text, reduced-motion paths, and heading/main landmark structure were audited. Each public route had one H1. Runtime link audit found no stale `#` or JavaScript links. Retired public concepts such as programs, prices, events, booking, checkout, payments, and newsletter were absent from the public route matrix.

The in-app browser could not reliably populate `email` and `tel` controls through its automation API; text-field preservation and all server-side validation paths were verified. No new persistent inquiry records were created during this QA pass.

## Release checks

- Payload type generation: passed.
- Payload import-map generation: passed; no new imports required.
- Typecheck: passed.
- Lint: passed with four pre-existing warnings in the initial migration file.
- Production build: passed.
- `git diff --check`: passed; only normal CRLF conversion warnings were reported by Git.

Remaining operational follow-ups are authenticated Media/admin CRUD, database restart/recovery, and backup validation. Those are separate from this public-site release-candidate QA pass.

## Phase 6.5 destination/contact UX follow-up

Date: 2026-09-22

The current release candidate is `8187c61` (`fix: simplify social and destination page ux`). This follow-up preserved the release candidate's latest destination and Contact UX while closing the application-side smoke-test prerequisites:

- Preview-mode production build passed with empty `DATABASE_URL` and `PAYLOAD_SECRET` overrides.
- `/`, `/about`, `/contact`, `/destinations`, all six destination detail routes, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/icon.png`, and `/apple-icon.png` returned successfully in the local production server.
- All six destination routes use the shared reduced template, place the inquiry section immediately after the overview, keep Name/Email/Phone only, and expose the semantic `Plan This Trip` anchor to `#destination-inquiry`.
- Contact keeps the simplified regional social presentation with exactly Instagram and Facebook for Egypt and Saudi Arabia; no TikTok, LinkedIn, placeholder, or legacy regional link was present. The corrected Instagram SVG rendered with explicit dimensions and stroke attributes.
- Strict mode with empty CMS credentials continued to render branded CMS-unavailable states for the homepage, Contact, and destination detail route; demo content did not leak into normal production behavior.
- Typecheck, lint, production build, and `git diff --check` passed. Lint retains eight pre-existing unused-parameter warnings in the two migration files and no errors.

The public production origin could not be smoke-tested from this environment because requests to `https://ldc-tourism.com` were refused by the local network/proxy path. No production deployment or infrastructure mutation was performed.

## Final full application audit and CMS completion

Date: 2026-09-30
Source baseline: `09923710369fb921517b42565a8274a8356b5eb1` (`fix: correct destination imagery and hero quality`). This was a source/application audit only; no deployment, production host, DNS, OpenLiteSpeed, production database, or system service was changed.

### Implementation and review

- Added CMS-managed Site Settings, Homepage, About Page, Contact Page, and Destinations Page globals; destination hero/primary/gallery/highlight imagery now relates to Media. Public fallbacks remain explicit preview/development behavior; strict production failures do not substitute demo content, including metadata.
- Added explicit collection/global access boundaries. Public reads are limited to approved public content; authenticated editors own writes; anonymous Users and Inquiries CRUD remains denied. Inquiry forms use server actions, server-side validation, honeypot checks, and PII-safe error logging.
- Updated the explicit merge-missing seed for the new globals/content and reusable media. It does not run at startup and does not create users or inquiries. The seed was not run in this pass.
- Added and registered forward-only CMS completion migration `20260930_122812_cms_completion` and Payload auth compatibility migration `20260930_130319_cms_completion_auth_patch`. The up SQL is additive; rollback SQL was reviewed. Neither migration was applied, and migration status was not queried because `127.0.0.1:55432` refused a connection.
- Media accepts JPEG, PNG, WebP, and AVIF, rejects SVG, caps uploads at 5 MiB, and generates 480/960/2400-pixel derivatives. Production uploads must use persistent `PAYLOAD_MEDIA_DIR` outside release folders; dashboard upload behavior and proxy limits still need a live authenticated check.
- Corrected the Georgia fallback to a verified Tbilisi, Georgia image source; moved the previous Saint Petersburg image to Russia without altering its bytes. The Georgia image/source correction is reflected in destination data and the source register.
- Hardened seed enrichment to avoid positional data mismatches when editors change row titles/order. Fixed strict-mode route metadata so CMS failures return noindex unavailable metadata instead of demo metadata.
- Dependency audit completed after compatible lockfile overrides for patched transitive packages. Full `pnpm audit` reported no known vulnerabilities. No major package upgrades were forced.

### Validation evidence

- Payload types and import map generated; TypeScript typecheck passed.
- Lint passed with eight unused-parameter warnings confined to the two historical migrations. The new migrations add no lint warnings.
- Full dependency audit passed with no known advisories.
- The first default build attempts encountered a stale, locked `.next/dependency-recovery` cache (`EPERM`) and restricted font-fetch/internal Turbopack resolution errors. A production Webpack build then passed in explicit preview mode with blank `DATABASE_URL`/`PAYLOAD_SECRET` and canonical `NEXT_PUBLIC_SITE_URL=https://ldc-tourism.com`, using a temporary isolated output directory. The temporary config/TypeScript edits were reverted and that isolated output was removed. A subsequent standard-output `pnpm build` Webpack retry remained stalled for over three minutes and was interrupted; therefore the requested default-output `pnpm build` is not confirmed green. The original ignored recovery cache was preserved under `.next/dependency-recovery-preserved-20260930`; the failed retry left only ignored/incomplete `.next` output. No temporary build-config or TypeScript edits remain.
- With the preview server and no database credentials, `/`, `/about`, `/contact`, `/destinations`, all six destination details, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/icon.png`, and `/apple-icon.png` returned HTTP 200. The homepage contained Turkey, Russia, Bali, Georgia, Indonesia, and Thailand, with no program/pricing/event concepts or CMS-unavailable state.
- In strict production mode with preview disabled and database variables empty, `/`, `/about`, `/contact`, `/destinations`, and `/destinations/turkey` returned the controlled unavailable state; demo markers were absent. No database connection, admin, seed, form submission, or collection CRUD was exercised.
- Preview metadata resolved its canonical URL to `https://ldc-tourism.com`, retained `noindex, nofollow`, `robots.txt` disallowed crawling, and the preview sitemap contained zero URLs. The optimized hero image endpoint returned HTTP 200 as `image/jpeg` (86,629 bytes).
- `git diff --check` passed. A filename/category-only tracked-file secret scan identified only `.env.example`; no value was printed, and no tracked secret/dump/private-key match was found.

### Blocked or not exercised

The documented local PostgreSQL endpoint was unavailable. Current-schema migration application/status, seed idempotence, CMS-backed runtime, dashboard/global CRUD, admin bootstrap, Media upload/MIME enforcement, inquiry persistence, anonymous Payload API methods, database recovery/backup, and authenticated form paths therefore remain blocked/unverified for this schema revision. The prior 2026-09-21 PostgreSQL evidence is historical only.

The in-app browser exposed the rendered accessibility tree but not device emulation/viewport controls or DevTools console/network panels. The requested full 320–1920px responsive matrix, visual screenshot comparison, and browser-console audit were not completed in this pass. Actual production-origin smoke checks and infrastructure readiness were not attempted. These are open gates, not inferred successes.

## Local application-gate continuation

Date: 2026-10-01

This continuation updates only evidence gathered locally after the 2026-09-30 audit. It does not change the committed baseline and does not include production/VPS work.

### Newly verified

- Replaced the build-time Google Fonts fetch with a self-hosted Montserrat variable font loaded through `next/font/local`; added its OFL license. The normal `pnpm build` command (the unmodified package script) passed twice, including a repeat after clearing only generated build output while preserving the named recovery folder. Both builds used preview mode off and blank process overrides for database credentials. The restricted shell first returned `EPERM` when Next spawned its type worker; the same build completed successfully when the child-process permission was granted. Node `v24.13.1`, pnpm `11.1.1`, and Next `16.3.7` were used.
- Payload type generation and import-map generation passed. `pnpm typecheck` passed. `pnpm lint` exited 0 with eight existing unused-parameter warnings limited to the two migration files. `git diff --check` passed.
- Preview-mode production UI was checked in the local browser across 10 public routes (home, About, Contact, destination listing, and all six details) at 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px: 90 route/width combinations. No horizontal overflow or already-loaded broken image was found. Tested browser-console error/warning logs were empty. The hero and destination imagery were visually reviewed; Georgia renders Georgian/Tbilisi imagery and Saint Isaac’s Cathedral is assigned to Russia.
- Preview rendered all six approved destinations with no old programs, event, price, newsletter, or booking UI. Preview canonical/noindex behavior remained correct; robots disallowed crawling and the preview sitemap had zero URLs. `/api/health`, robots, sitemap, and the optimized hero image returned HTTP 200 locally.
- Strict production mode, with preview off and blank database credential overrides, continued to show controlled branded unavailable states on `/`, `/about`, `/contact`, `/destinations`, and `/destinations/turkey`, without demo-content leakage.
- Mobile navigation opened with its expected links. The Design Your Trip dialog opened and closed with Escape. Invalid Contact input showed validation errors. Contact, destination inquiry, and Design Your Trip preview submissions each displayed an explicit non-success notice; no inquiry was represented as persisted. No database was available to receive writes.
- The temporary preview server started for this verification was stopped; port 3187 was no longer listening afterward.

### Still blocked or unverified

- Port `127.0.0.1:55432` is owned by native `postgres.exe` at `A:\Programs\code\postgresql\bin\postgres.exe` (PID 10672), not a verified dedicated LDC container. Docker Engine inspection was denied by its named-pipe permission boundary. Since database identity is uncertain, no connection, startup, migration, seed, or other database action was attempted. PostgreSQL version/database identity, migration state/application, seed first/second run, CMS-backed routes, admin/dashboard CRUD, media upload limits, inquiry persistence/cleanup, anonymous Inquiry API GET/POST/PATCH/DELETE, and Users registration denial remain unverified.
- The restricted-shell `pnpm audit` first could not reach the npm registry advisory endpoint (`ECONNREFUSED`). A read-only retry with network permission completed successfully and reported no known vulnerabilities; no packages were installed or changed by the audit.
- An earlier read-only port snapshot had shown PID 10672 (`postgres.exe`, from `A:\Programs\code\postgresql\bin\postgres.exe`) listening on 55432. The latest snapshot found no listener on that port. The executable reports PostgreSQL 17.9, but no live server/database version or identity was queried. Docker Engine inspection remains permission-blocked, so database identity and availability are still unconfirmed.
- Responsive browser automation and console review were performed in the available isolated in-app browser, not real-device testing. Lazy below-the-fold assets not requested by the browser were not individually forced to load. Production-origin and infrastructure checks were not attempted.
- No commit or push was made. Mandatory database/migration/seed/CMS/form/API gates and the current dependency advisory query remain open, so the implementation is not marked application-ready.

## Final production-readiness closure — 2026-10-01

This dated continuation supersedes the point-in-time local database/application blockers above. Runtime evidence in this section was provided by the operator from the normal Windows environment; it was not re-exercised by the restricted Codex runtime. No production host or production database was contacted.

- PostgreSQL 17 was verified as the dedicated local LDC database and all six migrations were applied.
- The explicit seed completed twice and remained idempotent; exactly six destinations and the required CMS globals persisted.
- All ten CMS-backed public routes passed. Contact and destination inquiry forms persisted correctly; validation and honeypot checks passed, QA inquiries were removed, and anonymous Inquiry CRUD and Users access were denied.
- Preview mode and strict CMS-unavailable mode passed. Responsive/browser QA passed with no JavaScript console errors.
- The operator ran `pnpm audit` outside the restricted runtime; it exited 0 with no known vulnerabilities. This is accepted for the dependency-audit gate. No registry request or proxy change was made by Codex.
- Typecheck, lint (exit 0), production build (twice), and `git diff --check` were reported as passing before the final source-review adjustment. Final local static checks are rerun as part of the source-control closure below.

The remaining launch work is infrastructure-only: read-only WOM-VPS-01 audit, production PostgreSQL and secrets, persistent media, backup/recovery, production admin bootstrap, OLS/process/port configuration, and production smoke testing. The missing email adapter is an optional future enhancement; the approved inquiry flow persists to Payload and does not promise email notifications. Source-control review, commit, and push status are reported in the task completion report.
