# LDC Travel Production Environment Contract

This is a variable-name-only contract for the future WOM-VPS-01 deployment. Never store real values, passwords, tokens, or connection strings in this document or in Git.

| Variable | Required | Secret | Production meaning | Safe example shape |
|---|---:|---:|---|---|
| `DATABASE_URL` | Yes | Yes | Dedicated LDC PostgreSQL database only; never reuse another workload's database or credentials. | `postgresql://<LDC_DB_USER>:<PASSWORD>@127.0.0.1:<PORT>/ldc_travel_prod` |
| `PAYLOAD_SECRET` | Yes | Yes | Long, random Payload auth/session secret stored in the deployment secret store. | `<GENERATED_RANDOM_SECRET>` |
| `NEXT_PUBLIC_SITE_URL` | Yes | No | Final canonical HTTPS origin. Confirmed production value: `https://ldc-tourism.com`. | `https://ldc-tourism.com` |
| `PAYLOAD_MEDIA_DIR` | Yes | No | Persistent media directory outside release folders. | `/srv/ldc-travel/media` |
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

The repository requires Node `>=20.9.0` and pnpm `11.1.1` through `package.json`. The exact current development runtime was Node `v24.13.1`; production should use a pinned supported Node LTS release, preferably Node 20 or another explicitly approved compatible version, rather than inheriting the workstation version. The app currently pins Payload and `@payloadcms/*` packages to `3.90.2`, Next and `eslint-config-next` to `16.3.7`, and React to `19.2.8`.

The start command is `pnpm start -- -p <PORT>`, and the package script forces `--hostname 127.0.0.1`. The production flow is therefore: locked install → `pnpm build` → process manager starts `pnpm start -- -p <PORT>` with the production environment.

## Media policy

Payload currently uses local storage with `PAYLOAD_MEDIA_DIR` or the development fallback `media`. Payload Media is preferred over remote demo URLs. Production should use a path such as `/srv/ldc-travel/media`, with ownership and permissions limited to the app runtime and deployment operators. Back up the database before media changes, then capture the persistent media tree as part of the same recovery set. Never store uploads inside a release directory.

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

## Sources

The Payload/Postgres adapter and migration model follow the official [Postgres adapter documentation](https://payloadcms.com/docs/database/postgres), [migration documentation](https://payloadcms.com/docs/database/migrations), and [production deployment guidance](https://payloadcms.com/docs/production/deployment). Payload documents Node.js `20.9.0+` as a supported baseline.
