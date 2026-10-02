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

## Release-preparation closure — 2026-10-01

Scope: reconcile the push-time Dependabot notification, run the final authorized read-only WOM-VPS-01 audit, and record safe findings in local release documentation. No source/dependency changes, deployment, DNS edits, database actions, process/service changes, OLS edits/reloads, or production environment changes were made. The starting revision was `ab856225549b0fb5482761a70b1c4886607df0a4` (`chore: finalize cms production readiness`), with local `HEAD` and `origin/main` aligned.

### Dependency security reconciliation

- The GitHub Dependabot API query for `state=open` returned **0** alerts. The all-states query returned **9 historical alerts, all `fixed`** on current main (`fixed_at` timestamps fell between approximately 10:50 and 11:05 UTC on 2026-10-01). The prior push message (1 high, 6 moderate, 2 low) was a notification snapshot predating the API's fixed state, not evidence of a currently open high advisory.
- The earlier operator-run `pnpm audit` exited 0 with no known vulnerabilities. It was not rerun here and no packages/lockfile entries changed during this release-preparation pass.
- Current lockfile resolutions noted during the alert review include `fast-uri` 3.1.8 (the high alert's fixed threshold was 3.1.7), `undici` 7.29.1, Payload 3.90.2, DOMPurify 3.4.16, and legacy `esbuild` resolutions 0.25.12 / 0.28.2. Those versions meet the fixed thresholds identified in the historical alert review. Classification for the nine closed records: **A — already patched in current HEAD**. No `B`–`E` or unresolved production-relevant high alert remains.
- Per-alert GHSA identifiers and full vulnerable-range text were not retained in this continuation's report context; no unsupported identifiers/ranges are reconstructed here. This limitation does not affect the verified current open-alert count or fixed state. GitHub's documented API state filter is `open`, `fixed`, `dismissed`, or `auto_dismissed` ([Dependabot alerts API](https://docs.github.com/en/rest/dependabot/alerts?apiVersion=2022-11-28)).

### Host identity, operating system, and capacity

- Strict-host-key, key-only SSH to `72.60.47.33:22` identified `mail.wordofmoutheg.com`; the established known-host identity matched. Read-only snapshot time: `2026-10-01T11:18:01+00:00`.
- AlmaLinux 9.8, kernel `5.14.0-687.51.1.el9_8.x86_64`, KVM, 2 vCPU. Uptime was about 3 days 13 hours; load averages `1.18 / 0.83 / 0.82`.
- RAM: 7.5 GiB total, about 4.1 GiB used, 542 MiB free, 3.4 GiB available. Swap: 4.0 GiB total, 3.4 GiB occupied (about 85%). `vmstat`'s three one-second interval samples had no swap-in/out; this short sample does not explain historical swap use or establish a steady-state baseline. CPU steal ranged 3–15% in the short samples.
- Root filesystem: XFS, 99 GiB total, 75 GiB used, 25 GiB free (76% used); inode use 4%. Docker overlay mounts report the same underlying filesystem and are not separate capacity.
- No failed systemd units were listed. Host load/swap/steal and shared workload capacity make a production build on this 2-vCPU host inadvisable; build a Linux deployment artifact elsewhere and smoke it before release.
- A separate `ps` snapshot at `2026-10-01T11:36:26+00:00` showed several `lsphp` workers as the largest instantaneous CPU consumers (roughly 9.5–11% each in that snapshot). MariaDB was the largest individual RSS process (~452 MiB), followed by Java (~288 MiB) and individual `lsphp` workers (~220–235 MiB). This is a point-in-time list, not a sustained CPU or memory attribution study.

### Network, OpenLiteSpeed, ports, and representative sites

- OpenLiteSpeed `1.9.0`, `lsws` active; CyberPanel `lscpd` active. Main config: `/usr/local/lsws/conf/httpd_config.conf`. Per-vhost convention: `/usr/local/lsws/conf/vhosts/<domain>/vhost.conf`; inspected examples use an External App to `127.0.0.1:<port>` and a `/` proxy context. Existing config is CyberPanel-managed and must not be edited out-of-band without an approved LDC-only change.
- No `ldc-tourism.com` vhost entry or LDC vhost directory/certificate mapping was found. No LDC app is deployed. Conceptual target remains `https://ldc-tourism.com` → OLS → `127.0.0.1:3150` (candidate only; 3150 must be checked again immediately before use).
- Existing DNS: `ldc-tourism.com A 72.60.47.33`; `www.ldc-tourism.com CNAME ldc-tourism.com`. TLS-verified HEAD checks to both public names failed with Schannel `SEC_E_WRONG_PRINCIPAL` / status 000 due to certificate hostname mismatch. No insecure TLS bypass was used. Preserve DNS; resolve certificate and vhost mapping only under separate approval.
- TCP and UDP listener tables were checked again around 11:36 UTC. Notable occupied TCP ports include 21, 22, 25, 80, 110, 143, 443, 465, 587, 993, 995, 111, 7080, 8090, 8888, 2222, 3001, 3004, 3010, 3306 (loopback), 4000, 5432 (loopback), 55433 (loopback), 6379 (loopback), 53000 (loopback), and 7881; UDP includes 111, 443, 7080, 7882, plus ephemeral service sockets. Ports 3150, 3151, and 3152 had no TCP listeners in that same point-in-time snapshot. Recommend 3150, with 3151/3152 as alternatives after a fresh conflict/capacity check. Existing Next server was bound to `127.0.0.1:3010`; avoid that port. Firewall reachability was not audited.
- TLS-verified baseline HEAD checks returned 200 for [SleepyWear](https://sleepyweareg.com/), [Arise](https://arise-wellnesshup.com/), and [Tejaru](https://tejaru.com/) on the same host. Resolver lookups for Graquamarine and the CRM API failed in this environment, so their service status is **unknown**, not “down”. Do not modify any of these sites. Repeat the three 200 baselines after any separately approved LDC proxy change.

### Runtime, app supervision, database, and release paths

- `/usr/bin/node` v22.23.0; `/usr/bin/npm` 10.9.8; `/usr/bin/pnpm` 11.7.0; `/usr/bin/pm2` 7.0.1. Repo requires Node `>=20.9.0` and pins pnpm 11.1.1; host Node meets the minimum but pnpm does not match the project pin. Do not mutate shared runtimes in this audit. Pin CI/release tooling and make a separate approved decision for host patching. Next 16.3 documents Node 20.9.0 as its minimum ([Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)).
- `pm2-root.service` is active under root; the root PM2 list included `graquamarine` with online status but missing PID/memory values. A separate Next server listens on 3010. Docker is active. Recommend **one dedicated systemd service**, under a dedicated unprivileged LDC account, running a single loopback-only Next process. Do not add LDC to the shared root PM2 daemon or supervise one process twice. No LDC account/service was created.
- Native PostgreSQL 13.23 is active on `127.0.0.1:5432`; MariaDB and Redis are active on loopback; existing Docker PostgreSQL instances use majors 16, 17, and 18. No LDC DB exists. Never reuse native PG13 or another application's DB/container. Recommend a dedicated isolated PostgreSQL 17 for LDC, matching the locally validated major, subject to separate provisioning approval. No DB content, credentials, or environment files were read.
- Existing app directories are under `/var/www`; `/srv` had no visible app roots. Recommend (not created) `/var/www/ldc-travel/releases/<release-id>`, `/var/www/ldc-travel/current` symlink, `/var/www/ldc-travel/shared/.env`, and persistent `/var/www/ldc-travel/shared/media`. Keep backups separately under `/var/backups/ldc-travel` and encrypted off-host. These directories and account do not currently exist.
- App config uses standard Next `next start`, not standalone output. Build the locked release on a compatible Linux x64/glibc environment with repo-pinned pnpm and a compatible supported Node; never copy Windows `node_modules`. Verify Sharp's Linux native dependency in artifact smoke tests. Do not build on WOM-VPS-01.

### Backups, seed/admin, release sequence, and tests

- `restic` is installed, but no LDC backup schedule/job or verified restore was found. `/var/backups` exists, which is not itself proof of a valid backup. A container named like a Postgres backup service was not treated as proof of LDC coverage. CyberPanel's own scheduled backup plan was not inspected; therefore overall host backup status remains **unknown**. No backup/restore was run.
- Recommended recovery set: dedicated-LDC-DB `pg_dump -Fc`, verify with `pg_restore --list`; capture persistent media; secure off-repo environment backup; encrypted offsite copy; define retention, RPO/RTO, owner, and periodically prove restore. No archive contents or secrets were read.
- No automatic production seed. The existing explicit seed contains demo marketing records; initial production content should be owner-reviewed and entered through approved CMS editorial workflow. Do not seed admin/users/inquiries. After HTTPS deployment, the operator manually creates the first admin and chooses credentials; none are stored in the repository.
- Future approved sequence: (1) confirm existing LDC DB backup if applicable; (2) stage a versioned release; (3) prepare protected production env; (4) prepare persistent media; (5) locked dependency install; (6) build artifact off-host; (7) review and apply only pending Payload migrations to dedicated LDC DB; (8) no automatic seed; (9) start LDC on loopback via dedicated systemd; (10) localhost health and route smoke; (11) separately approved LDC OLS proxy/vhost change; (12) TLS/public smoke plus unaffected-site regression. Switch `/var/www/ldc-travel/current` atomically only after local checks; rollback the LDC symlink/service only, not unrelated services. Database rollback is a separate recovery decision.
- Production smoke matrix: `/`, `/about`, `/contact`, `/destinations`, all six `/destinations/{turkey,russia,bali,georgia,indonesia,thailand}`, `/api/health`, `/admin`, `/robots.txt`, `/sitemap.xml`, `/icon.png`, `/apple-icon.png`; verify destination `Plan This Trip` reaches `#destination-inquiry`. Also test WhatsApp/social links, inquiry validation, CMS/admin access and media upload after TLS, and review logs without exposing PII/secrets. Existing-site before/after regression targets: SleepyWear, Arise, and Tejaru.

### Release decision

**DEPLOYMENT READY: NO.** Application/source readiness is distinct from production infrastructure readiness. Remaining blockers: TLS certificate hostname mismatch and absent LDC OLS vhost; dedicated production PostgreSQL 17 and secure credentials; `PAYLOAD_SECRET`; production admin owner/bootstrap; approved unprivileged LDC account/systemd service and freshly verified port; release/media/backup paths and permissions; backup retention/offsite/restore proof; authenticated production CMS/media QA; deployment window and explicit approval for infrastructure changes; and full HTTPS plus unaffected-site smoke tests. No deploy, host mutation, DNS change, OLS change/reload, DB operation, package installation, service change, or firewall review was performed.

**Next step:** obtain operator approval and ownership decisions for the TLS/vhost change and dedicated DB/secrets/media/backup/service prerequisites; only then schedule a separately authorized deployment plan. Do not deploy as part of this closure. Brain `Current State.md` is dated before this audit and is **STALE CURRENT STATE — verify before relying on mutable facts**; this task intentionally made no Brain changes.

## Production deployment closure — 2026-10-02

This section records the completed production cutover. Non-secret operational facts are also summarized in `docs/production-environment.md`.

- **Host / access:** WOM-VPS-01 `72.60.47.33` via approved `root@` SSH with strict host-key verification.
- **Application:** `ldc-travel.service` active as user `ldc-travel`; loopback listener `127.0.0.1:3150`; release symlink points to commit `1c6344b2f87e8407414a849a43fb3e87a9dceaab-verified-nolf-20261001T142213Z`.
- **Database:** dedicated Docker PostgreSQL 17 container `ldc-travel-postgres` on `127.0.0.1:55434`; database/user `ldc_travel`; healthy; loopback-only.
- **OpenLiteSpeed:** LDC vhost maps apex + www on Default :80, SSL *:443, and SSL IPv6 [ANY]:443. External App `ldc_travel_proxy` proxies `/` to `127.0.0.1:3150`. Dedicated LE cert covers both hostnames. On-disk rewrite rules used correct `\.` escaping; the runtime OLS process was stale until graceful `lswsctrl reload` at 2026-10-02T21:38Z. Validation: 0 ERROR, 0 FATAL, 14 unrelated pre-existing warnings.
- **TLS / public:** apex HTTPS 200 with valid TLS; www HTTPS 301 to apex; HTTP apex/www 301 to HTTPS apex. All 10 public routes, `/api/health`, `/admin` shell, robots, sitemap (10 URLs), and icons returned 200. Canonical/OG/Twitter/JSON-LD present.
- **Forms:** Contact, Destination inquiry, and Design Your Trip submitted successfully with marked QA records; persisted in production DB; marked QA rows deleted; users remained 0.
- **Backups:** final `pg_dump -Fc` at `/var/backups/ldc-travel/final-post-deploy-20261002T214809Z.dump` verified with `pg_restore --list` (rc=0). Media backup archive + manifest retained. Fresh OLS pre-edit backup at `/var/backups/ldc-travel-cutover-20261002T213659Z/`.
- **Protected sites:** SleepyWear, Arise, and Tejaru remained healthy through local OLS/SNI and public checks after reload. No unrelated regressions observed.
- **Graquamarine:** already retired earlier; backup retained; Unix-account cleanup remains optional follow-up and did not block LDC.
- **Not done by design:** first Payload admin not created; authenticated media upload QA pending admin; no source hot-fix; no DB recreate; no seed rerun; no cert reissue.
