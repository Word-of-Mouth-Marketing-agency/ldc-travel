# LDC Travel Production Environment Contract

This is a variable-name-only contract for the future WOM-VPS-01 deployment. Never store real values, passwords, tokens, or connection strings in this document or in Git.

| Variable | Required | Secret | Production meaning | Safe example shape |
|---|---:|---:|---|---|
| `DATABASE_URL` | Yes | Yes | Dedicated LDC PostgreSQL database only; never reuse another workload's database or credentials. | `postgresql://<LDC_DB_USER>:<PASSWORD>@127.0.0.1:<PORT>/ldc_travel_prod` |
| `PAYLOAD_SECRET` | Yes | Yes | Long, random Payload auth/session secret stored in the deployment secret store. | `<GENERATED_RANDOM_SECRET>` |
| `NEXT_PUBLIC_SITE_URL` | Yes | No | Final canonical HTTPS origin. Confirmed production value: `https://ldc-tourism.com`. | `https://ldc-tourism.com` |
| `PAYLOAD_MEDIA_DIR` | Yes | No | Persistent media directory outside release folders. | `/var/www/ldc-travel/shared/media` |
| `PORT` | Yes | No | Localhost-only application port selected after a fresh VPS port audit. | `31xx` |
| `HOSTNAME` | Optional | No | Keep the app bound to loopback; the current start script explicitly passes `127.0.0.1`. | `127.0.0.1` |
| `NODE_ENV` | Yes | No | Must be `production`. | `production` |
| `UI_PREVIEW_MODE` | Yes | No | Must be empty or `false` in real production. `true` is only for the temporary database-free UI preview. | `false` |
| `NEXT_PUBLIC_LAUNCH_MARKET_CODE` | Optional | No | Leave unset unless the launch market needs an explicit deployment override; the app currently resolves the configured launch market. | `EG` |

## Required production invariants

- `NEXT_PUBLIC_SITE_URL=https://ldc-tourism.com` is the confirmed production canonical origin. This documentation update does not deploy it or change DNS.
- `DATABASE_URL` points to an LDC-owned database/user and does not reuse Graquamarine, MariaDB, Redis, or another application's database.
- `PAYLOAD_MEDIA_DIR` is persistent across releases and rollbacks, owned by the application runtime user, and included in the media backup scope.
- The Node process listens only on `127.0.0.1:<PORT>` and is reachable publicly only through the existing OpenLiteSpeed HTTPS vhost.
- `UI_PREVIEW_MODE=true` is never enabled on the real production site.
- Secrets are injected by the deployment environment and are never committed, echoed, or placed in release directories.

## Current application contract

The repository requires Node `>=20.9.0` and pins pnpm `11.1.1` through `package.json`. The last reported local validation used Node `v24.13.1` and pnpm `11.1.1`. The read-only WOM-VPS-01 audit on 2026-10-01 found Node `v22.23.0` at `/usr/bin/node` and pnpm `11.7.0` at `/usr/bin/pnpm`; Node meets the repository minimum, but pnpm differs from the exact project pin. Pin the CI/release toolchain to the repository contract and decide separately whether to patch the shared server Node runtime; no server software was changed. The app currently pins Payload and `@payloadcms/*` packages to `3.90.2`, Next and `eslint-config-next` to `16.3.7`, and React to `19.2.8`.

The start command is `pnpm start -- -p <PORT>`, and the package script forces `--hostname 127.0.0.1`. The production flow is therefore: locked install → `pnpm build` → process manager starts `pnpm start -- -p <PORT>` with the production environment.

## Media policy

Payload currently uses local storage with `PAYLOAD_MEDIA_DIR` or the development fallback `media`. Payload Media is preferred over remote demo URLs. The fresh host audit found existing app roots under `/var/www` and no LDC media path. Recommended (not created) path: `/var/www/ldc-travel/shared/media`, with ownership and permissions limited to the dedicated LDC runtime user and deployment operators. Back up the database before media changes, then capture the persistent media tree as part of the same recovery set. Never store uploads inside a release directory.

The Media collection accepts JPEG, PNG, WebP, and AVIF only, rejects SVG, caps each upload at 5 MiB, and generates thumbnail/card/hero derivatives at 480/960/2400 pixels while retaining the original. No authenticated upload test was run because admin access and the current local database were unavailable during the final audit. Verify the configured application and reverse-proxy request limits agree with the collection cap before launch.

## Security audit findings

- Payload Users and Inquiries are not publicly readable; anonymous inquiry creation returns `403`, and Inquiries create access is explicitly disabled because public submissions use server actions with `overrideAccess`.
- Homepage and Site Settings are intentionally public-read because the server-rendered site consumes them. Their update operations require an authenticated Payload user.
- The `/admin` and Payload `/api` surfaces remain application routes. Production must provide the real HTTPS origin so Payload CORS/CSRF configuration is constrained, and the OLS vhost/process policy must not expose the Node listener directly.
- The current local database exposes only the seeded public destination/market read surfaces; legacy collections were empty during the audit. If legacy records are ever repopulated, their public API read policy should be reviewed before launch because those collections are no longer part of the public product model.
- Media uploads allow raster web images only (`jpeg`, `png`, `webp`, `avif`), cap files at 5 MiB, and reject SVG. The configured application cap is implemented; test it through authenticated admin upload and verify the proxy request limit before launch.

## Final audit notes — 2026-09-30

The CMS now includes Site Settings, Homepage, About Page, Contact Page, and Destinations Page globals, with explicit public-read/authenticated-write boundaries and a protected Inquiries collection. Payload is pinned to 3.90.2 and Next to 16.3.7; `pnpm-workspace.yaml` records patched transitive resolutions for fast-uri, undici, DOMPurify, and the legacy esbuild dependency. Consult `docs/release-qa.md` for the completed audit result and remaining infrastructure gates. The 2026-09-30 audit did not apply the CMS completion and auth compatibility migrations because local PostgreSQL was unavailable at that time. The subsequent 2026-10-01 operator-provided local-runtime evidence reports that all six migrations were applied, the seed passed twice, and CMS-backed routes/forms/access controls passed; see the dated evidence in `docs/release-qa.md`. This is not production database or admin-bootstrap verification.

Required environment names are listed in `.env.example`; values remain deployment-owned. `UI_PREVIEW_MODE=true` is only for a temporary database-free preview and must be false/absent for the real site. `LDC_ALLOW_PRODUCTION_SEED` is an optional one-command safety gate for an explicitly approved content seed, not a persistent required production variable.

## Read-only production prerequisite snapshot — 2026-10-01

The host was positively identified over strict-host-key, key-only SSH as `mail.wordofmoutheg.com` (`72.60.47.33`), AlmaLinux 9.8, kernel `5.14.0-687.51.1.el9_8.x86_64`, 2 vCPU. Point-in-time observations: load `1.18 / 0.83 / 0.82`; 7.5 GiB RAM with 3.4 GiB available; 4.0 GiB swap with 3.4 GiB used; root XFS 99 GiB with 25 GiB free (76% used), inodes 4% used. Three short `vmstat` interval samples showed no swap-in/out, but CPU steal varied 3–15%; these brief samples are not a long-term capacity baseline. Do not plan a production build on this host.

OpenLiteSpeed 1.9.0 and CyberPanel are active. The main configuration uses CyberPanel-managed vhost files under `/usr/local/lsws/conf/vhosts/<domain>/vhost.conf`; existing examples use an External App and `/` proxy context. No LDC vhost or certificate mapping was found. DNS currently resolves `ldc-tourism.com` to `72.60.47.33` and `www` as a CNAME to the apex, but TLS-verified requests to both names failed with a certificate hostname mismatch. Preserve DNS; certificate/vhost setup and external smoke tests remain blockers requiring a separately approved change.

No LDC production application, database, media path, or release tree exists. Native PostgreSQL 13.23 is active on loopback; separate application containers use PostgreSQL 16, 17, and 18. Do not reuse any of them. Recommend an isolated, dedicated PostgreSQL 17 service for LDC after approval. Root PM2 is active but is not an appropriate shared app owner; recommend one dedicated systemd unit under an unprivileged LDC user, running a single loopback-bound Next process. Ports 3150, 3151, and 3152 were free only at audit time; 3150 is the preferred candidate, to be rechecked immediately before an approved release.

Restic is installed, but no LDC backup job or successful restore was verified. CyberPanel-managed backup schedules were not inspected, so host-wide backup status is unknown. `/var/backups` exists but that alone is not evidence of a usable recovery set. Recommend database `pg_dump -Fc` plus `pg_restore --list`, persistent-media backup, and an encrypted off-host copy with retention and a tested restore owner. See `docs/release-qa.md` for the detailed evidence, limitations, and unaffected-site baselines.

## Production deployment record — 2026-10-02

Status: **PRODUCTION LIVE.** Public HTTPS smoke, forms QA, final database backup, and protected-site regression passed on WOM-VPS-01 (`72.60.47.33`).

| Fact | Production value |
|---|---|
| Deployment date | 2026-10-02 (UTC cutover ~21:38) |
| Deployed commit | `1c6344b2f87e8407414a849a43fb3e87a9dceaab` |
| Release root | `/var/www/ldc-travel/releases/1c6344b2f87e8407414a849a43fb3e87a9dceaab-verified-nolf-20261001T142213Z` |
| Active symlink | `/var/www/ldc-travel/current` |
| Application port | `127.0.0.1:3150` (loopback-only) |
| Process manager | systemd `ldc-travel.service` as user `ldc-travel` (not PM2) |
| Database | Dedicated Docker PostgreSQL 17 container `ldc-travel-postgres` |
| DB endpoint | `127.0.0.1:55434` (loopback-only) |
| Database name / user | `ldc_travel` / `ldc_travel` |
| Persistent media | `/var/www/ldc-travel/shared/media` |
| Protected env | `/var/www/ldc-travel/shared/.env` (never printed) |
| Backups | `/var/backups/ldc-travel/` |
| OLS vhost | `/usr/local/lsws/conf/vhosts/ldc-tourism.com/vhost.conf` |
| OLS External App | `ldc_travel_proxy` → `127.0.0.1:3150` |
| TLS | Let's Encrypt cert `/etc/letsencrypt/live/ldc-tourism.com/` covers apex + www |
| Canonical origin | `https://ldc-tourism.com` |
| WWW behavior | `https://www.ldc-tourism.com` → 301 to apex |
| HTTP behavior | apex/www HTTP → 301 to HTTPS apex |
| Launch market | EG only |

### Public verification (2026-10-02)

- All 10 public routes returned HTTPS 200 with valid TLS: `/`, `/about`, `/contact`, `/destinations`, and `/destinations/{turkey,russia,bali,georgia,indonesia,thailand}`.
- `/api/health` returned `{"status":"ok","service":"ldc-travel"}`.
- `/admin` returned the Payload admin shell (HTTP 200); **no production admin user exists yet**.
- `/robots.txt` allows public pages and disallows `/admin` and `/api`.
- `/sitemap.xml` contains exactly the 10 intended public URLs.
- `/icon.png` and `/apple-icon.png` returned HTTP 200.
- Canonical, OpenGraph, Twitter, Organization, WebSite, BreadcrumbList, and TouristDestination markup were present on checked pages.
- Form QA with clearly marked records succeeded for Contact, Destination inquiry, and Design Your Trip; records persisted in production DB and marked QA rows were removed afterward. Users remained 0.
- Protected sites SleepyWear, Arise, and Tejaru remained HTTP 200 with valid TLS via local OLS/SNI and public checks after the LDC OLS reload.

### OLS cutover notes

- On-disk rewrite rules used correct single-escaped regex dots (`\.`), not over-escaped `\\.`.
- Runtime OLS workers were stale until a graceful `lswsctrl reload` on 2026-10-02T21:38Z loaded the final LDC vhost (proxy + TLS + redirects + ACME context).
- Fresh OLS pre-edit backup: `/var/backups/ldc-travel-cutover-20261002T213659Z/`.
- Prior cutover evidence retained at `/var/backups/ldc-travel-cutover-20261002T155241Z/`.
- Graquamarine retirement backup retained at `/var/backups/graquamarine-retired-20261002T140652Z/`.

### Backups after launch

| Backup | Path / note |
|---|---|
| Pre-migration DB | `/var/backups/ldc-travel/20261001T1307Z-pre-migration-empty-host-verified.dump` |
| Post-seed DB | `/var/backups/ldc-travel/post-seed-20261001T151205Z.dump` |
| Post-seed media | `/var/backups/ldc-travel/media-20261001T151205Z.tar.gz` + `.sha256` (90 files, tar verified) |
| Final post-deploy DB | `/var/backups/ldc-travel/final-post-deploy-20261002T214809Z.dump` (`pg_dump -Fc`, `pg_restore --list` rc=0, 529 TOC entries) |

### Operator follow-ups

1. **First Payload admin:** owner must manually create the first admin at `https://ldc-tourism.com/admin`. Do not invent or automate credentials.
2. **Authenticated media QA** after admin creation: JPEG/WebP upload, alt text, derivatives, shared persistent media, SVG rejection, >5 MiB rejection.
3. **Graquamarine Unix-account cleanup** may remain as a separate maintenance task; it does not block LDC.
4. **Off-host encrypted backup** of DB + media remains an operator/DevOps follow-up.

## Sources

The Payload/Postgres adapter and migration model follow the official [Postgres adapter documentation](https://payloadcms.com/docs/database/postgres), [migration documentation](https://payloadcms.com/docs/database/migrations), and [production deployment guidance](https://payloadcms.com/docs/production/deployment). Runtime compatibility was checked against the official [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [Node.js release schedule](https://nodejs.org/en/about/previous-releases), and [Sharp install requirements](https://sharp.pixelplumbing.com/install/). These sources do not authorize changing shared server software.
