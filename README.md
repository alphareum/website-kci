# Website KCI

This repository now hosts both the legacy PHP site and the staged JavaScript rewrite.

## Structure
- `index.php`, `admin/`, etc. – Existing PHP CMS that remains online during the migration.
- `apps/api` – Fastify + TypeScript backend that exposes CMS capabilities over REST while persisting to Supabase or the legacy MySQL database during the transition.
- `scripts/migrations` – Tooling to extract data from the MySQL database.
- `supabase` – Schema definition for the new Postgres storage layer.
- `docs` – Architecture notes and the staged migration plan.

## Getting started with the JS stack
1. Install dependencies from the repo root: `npm install`
2. Copy `apps/api/.env.example` to `apps/api/.env`.
   - Set `DATA_BACKEND` to `supabase`, `mysql`, or `hybrid` depending on which datastore you want the API to use.
   - Provide Supabase credentials when the backend is `supabase`/`hybrid` and a `LEGACY_MYSQL_DSN` when the backend is `mysql`/`hybrid`.
3. Start the API: `npm run dev:api`

Refer to `docs/MIGRATION_PLAN.md` for the rollout strategy.
