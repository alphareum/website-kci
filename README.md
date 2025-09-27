# Website KCI

This repository now hosts both the legacy PHP site and the staged JavaScript rewrite.

## Structure
- `legacy/php` – Archived PHP CMS and static site that remain available for reference.
- `apps/api` – Fastify + TypeScript backend that exposes CMS capabilities over REST
  while persisting to JSON files by default. Supabase integration can be enabled
  later by providing credentials.
- `scripts/migrations` – Tooling to extract data from the MySQL database.
- `supabase` – Schema definition for the future Postgres storage layer.
- `docs` – Architecture notes and the staged migration plan.

## Getting started with the JS stack
1. Install dependencies from the repo root: `npm install`
2. Copy `apps/api/.env.example` to `apps/api/.env` and adjust settings if needed.
3. Start the API: `npm run dev:api`

Default admin credentials are `admin@example.com` / `changeMe123`. Data persists to
`apps/api/data` so you can get the CMS running without provisioning Supabase.

Refer to `docs/MIGRATION_PLAN.md` for the rollout strategy.
