# LDC Travel Production Deployment Runbook

Status: **PRODUCTION DEPLOYED** on 2026-10-02. Approved commit `1c6344b2f87e8407414a849a43fb3e87a9dceaab` is live at `https://ldc-tourism.com` through OpenLiteSpeed → `127.0.0.1:3150`. See `docs/production-environment.md` for the non-secret production record, backups, public QA, and operator follow-ups. This runbook remains the operational procedure; historical pre-deploy audit notes below are retained for context and are superseded by live production evidence where they conflict.

## Pre-deploy gate

Stop unless every item is confirmed:

- final HTTPS domain supplied and approved: `https://ldc-tourism.com`;
- DNS owner and records identified, with the observed apex A and `www` CNAME preserved;
- valid TLS certificate covering both production hostnames, and the LDC vhost/proxy, separately approved and verified;
- dedicated LDC PostgreSQL architecture and credentials available through the approved secret channel;
- `PAYLOAD_SECRET` generated and stored securely;
- persistent media path and owner confirmed;
- localhost-only app port selected from a fresh `ss -ltnp` audit;
- process-manager owner confirmed;
- database and media backup destinations confirmed;
- free disk, RAM, swap, and current load reviewed during a low-traffic window;
- approval to alter the LDC OpenLiteSpeed vhost only, with no unrelated vhost changes.

## Read-only preparation

1. Record the current VPS hostname, OS, kernel, CPU, RAM, swap, disk, listeners, OLS version/status, Node versions, process-manager landscape, PostgreSQL/MariaDB/Redis ownership, and representative existing-site health.
2. Confirm the target application port is unused and bind the application only to `127.0.0.1`.
3. Confirm the LDC release commit, lockfile, Node version, pnpm version, migration list, and environment variable names.
4. Confirm `https://ldc-tourism.com` is covered by the intended certificate plan. Do not request or replace certificates in this phase.

## Fresh read-only audit and architecture decisions — 2026-10-01

Host identity: `mail.wordofmoutheg.com`, AlmaLinux 9.8, kernel `5.14.0-687.51.1.el9_8.x86_64`, 2 vCPU. Point-in-time load was `1.18 / 0.83 / 0.82`; RAM 7.5 GiB with 3.4 GiB available; swap 4.0 GiB with 3.4 GiB occupied; root XFS 99 GiB with 25 GiB free (76% used), inodes 4% used. Short interval samples had zero swap I/O but CPU steal ranged 3–15%, so capacity is not proven stable. **Build off-server** in a compatible Linux environment, not on the shared 2-vCPU host.

- **Runtime:** `/usr/bin/node` is v22.23.0, `/usr/bin/pnpm` is 11.7.0. The repository requires Node `>=20.9.0` and pins pnpm `11.1.1`; Node meets the minimum, but release tooling must honor the exact project pin. No software was changed. Next 16's documented Node minimum is 20.9.0; use a pinned supported Node LTS in the release artifact and schedule any shared-host patch separately.
- **Database:** native PostgreSQL 13.23 is active on loopback; separate existing containers use PostgreSQL 16, 17, and 18. No LDC database exists. Use a dedicated isolated PostgreSQL 17 instance (the version used in local validation), never another app's database or the shared native instance. Provision only under a later approved change.
- **Process manager:** recommend exactly one dedicated systemd unit under a dedicated unprivileged LDC account, running one Next/Payload process bound only to loopback. `pm2-root` is active for the root account, and a separate Next server uses 127.0.0.1:3010; do not add LDC to the shared root PM2 daemon or run duplicate supervisors. No LDC service/account was created.
- **Port:** 3150, 3151, and 3152 were free TCP listening ports at the audit snapshot. Prefer 3150; recheck immediately before use. Do not assume these remain free.
- **Build/runtime packaging:** Next config uses standard `next start` output, not standalone output. Build a Linux x64/glibc-compatible artifact off-host using the reviewed lockfile, exact pinned pnpm, and compatible pinned Node; do not copy Windows `node_modules`. Sharp's Linux native package compatibility should be confirmed by the artifact smoke test.
- **OpenLiteSpeed:** LiteSpeed 1.9.0 and CyberPanel are active. Main config is `/usr/local/lsws/conf/httpd_config.conf`; per-vhost convention is `/usr/local/lsws/conf/vhosts/<domain>/vhost.conf`. Existing examples use External App → loopback upstream and a `/` proxy context. No LDC vhost or cert mapping exists. Make any future vhost edit through the approved CyberPanel/OLS ownership path, after explicit approval and config backup; do not reload as part of this audit.
- **DNS/TLS:** apex A currently resolves to `72.60.47.33`; `www` CNAME resolves to the apex. TLS-verified requests to both `https://ldc-tourism.com/` and `https://www.ldc-tourism.com/` failed due to certificate hostname mismatch. Do not bypass TLS verification or change DNS. The certificate and LDC vhost mapping must be resolved before public smoke can pass.
- **Logs:** keep app stdout/stderr with the dedicated service and approved rotation; exclude inquiry bodies, credentials, cookies, tokens, and database URLs.

## Backup before release or migration

1. Take a logical custom-format dump of the dedicated LDC database: `pg_dump -Fc <LDC_DATABASE_URL> -f <backup>.dump`.
2. Verify the archive with `pg_restore --list <backup>.dump`.
3. Preserve the migration state and record the dump timestamp, source database, PostgreSQL major, and archive location.
4. Back up the relevant OpenLiteSpeed vhost configuration before any approved edit; do not back up or expose private keys.
5. Capture the current release identifier and preserve the persistent media path as part of the coordinated recovery set.

## Release structure

The live audit found existing application roots under `/var/www`; `/srv` had no visible app roots. Use this recommended, **not yet created** release-independent LDC layout:

```text
/var/www/ldc-travel/
  releases/<release-id>/
  current -> releases/<release-id>/
  shared/media/
  shared/.env
  # backups stored separately under /var/backups/ldc-travel/
```

The path and owner require approval and creation by the operator. `shared/.env` and `shared/media/` must not be copied into release folders. The application should read `PAYLOAD_MEDIA_DIR=/var/www/ldc-travel/shared/media`. Keep backups outside the release root, and arrange an encrypted off-host copy. None of these LDC directories currently exists.

## Deploy application

1. Create the next release directory without touching `current`.
2. Copy only the clean, reviewed, approved release commit. Do not include unrelated working-tree edits.
3. Link the reviewed environment file and persistent media path.
4. Run a locked dependency install using `pnpm-lock.yaml`; do not update dependencies.
5. Run `pnpm build` before exposing the release.
6. Confirm the reviewed pending migration list, take and verify a fresh backup, then run all pending Payload migrations against the dedicated LDC database only: `pnpm payload migrate`. Never apply generated migrations to a shared or production database outside the approved release/change gate.
7. Start only the LDC application through its dedicated systemd unit with `pnpm start -- -p <PORT>` and `UI_PREVIEW_MODE=false`; bind only to loopback.
8. Verify `http://127.0.0.1:<PORT>/api/health` and local public routes before proxy work.

## OpenLiteSpeed change gate

Only after the backend is healthy, a valid certificate/domain mapping is ready, and explicit change approval exists:

1. Back up the relevant generated/per-vhost configuration.
2. Add or update one External App proxy targeting `http://127.0.0.1:<PORT>` and one `/` proxy context, following the existing OpenLiteSpeed/CyberPanel ownership pattern.
3. Validate configuration with the installed OLS syntax-check command.
4. Obtain explicit approval before graceful reload; never hard-stop OLS.
5. Verify the LDC HTTPS domain and a representative sample of unrelated websites on the shared listener.

## Public verification

Check `/`, `/contact`, `/destinations`, all six destination pages, `/api/health`, `/robots.txt`, `/sitemap.xml`, `/icon.png`, `/apple-icon.png`, canonical/HTTPS behavior, WhatsApp links, social links, and the inquiry validation path. Check `/admin` separately and do not create a user without the approved production administrator email and password process.

Also verify application logs contain no secrets, passwords, inquiry message bodies, or unnecessary personal data. Check CPU, RAM, swap, disk, OLS status, database status, and representative existing websites after the release.

## Migration and seed policy

Never run the demo seed automatically on startup or every deploy. The seed is merge-missing and creates demo content, not verified client records. For any initial production content load, first review its exact behavior, obtain explicit content-owner approval, verify the target database and backup, then use the one-command production opt-in. Review output and confirm manually edited CMS fields are preserved. Do not use the seed to overwrite editorial content or create admin users/inquiries.

## Rollback decision

If the application is unhealthy but the database schema remains compatible:

1. Stop or drain only the LDC process.
2. Point `current` to the previous known-good release.
3. Restart only the LDC process with the same persistent env/media paths.
4. Verify localhost health and public routes.

Do not restore the whole database for an application-only rollback. If a migration is incompatible, stop, inspect the migration's supported down/recovery path, preserve evidence, and restore a verified backup only after an explicit recovery decision. Persistent media remains outside the release tree and must survive either rollback path.

## Abort conditions

Abort before proxy or migration work if the domain is unknown, credentials are missing, the target database is not dedicated, the app binds publicly, media storage is ephemeral, the backup cannot be verified, the port conflicts, OLS ownership is unclear, or any unrelated service would need to be restarted.
