# LDC Travel Launch Checklist

This checklist contains unresolved human inputs and final operator gates. Do not add secret values here.

## Human inputs required before Phase 7

- [x] Final production HTTPS domain supplied and approved: `https://ldc-tourism.com`.
- [ ] DNS records and owner confirmed.
- [ ] Production administrator email approved.
- [ ] Dedicated PostgreSQL strategy selected: native isolated database/user or isolated supported PostgreSQL service.
- [ ] Dedicated production database/user credentials delivered through the approved secret channel.
- [ ] Strong production `PAYLOAD_SECRET` generated and stored securely.
- [ ] Persistent media directory selected, created, owned, permissioned, and backed up by the approved operator.
- [ ] Backup location, retention, offsite policy, and restore owner confirmed.
- [ ] Production application port selected after a fresh listening-port audit.
- [ ] Process-manager method approved.
- [ ] Deployment window selected outside peak traffic.
- [ ] Explicit approval to alter the LDC OpenLiteSpeed vhost and reload OLS after config validation.

## Technical gates

- [ ] Worktree release commit identified and no secrets/tracked dumps present.
- [ ] Node and pnpm versions pinned and compatible with `package.json`.
- [ ] Locked install succeeds without dependency updates.
- [ ] Production build succeeds from the release.
- [ ] Database backup created and `pg_restore --list` succeeds.
- [ ] Payload migration status is known; migration runs only against the dedicated LDC database.
- [ ] `UI_PREVIEW_MODE` is empty or `false`.
- [x] `NEXT_PUBLIC_SITE_URL` is documented as `https://ldc-tourism.com`; applying it remains a deployment operation.
- [ ] Application binds only to `127.0.0.1:<PORT>`.
- [ ] `PAYLOAD_MEDIA_DIR` points outside the release tree.
- [ ] `/api/health` returns liveness without exposing secrets or database details.
- [ ] Localhost smoke test passes before OLS changes.
- [ ] OLS config backup and rollback path are recorded before any approved edit.
- [ ] Public HTTPS smoke test passes after approved proxy change.
- [ ] `/`, `/about`, `/contact`, `/destinations`, all six destination pages, `/admin`, WhatsApp, robots, sitemap, and favicons pass.
- [ ] Representative existing websites remain healthy.
- [ ] CPU, RAM, swap, disk, OLS, database, and application logs are reviewed after launch.

## Explicit non-goals

- No production deployment, DNS change, OLS reload, production database creation, process-manager creation, package installation, firewall change, SSL change, or release upload is authorized by this checklist alone.
