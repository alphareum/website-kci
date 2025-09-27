# JS Migration Plan

This document describes how to migrate the legacy PHP/MySQL CMS to the new TypeScript/Fastify/Supabase stack without downtime.

## 1. Inventory the existing data
- Export the current MySQL schema (`database.sql`) and capture production data snapshots for the tables used by the CMS (admins, events, gallery, testimonials, partners, settings, messages).
- Document field semantics, enumerations, and relationships. Use the export as the input for the conversion utilities in `scripts/migrations/`.

## 2. Provision Supabase
- Create a Supabase project and load the schema found in `supabase/schema.sql`.
- Configure the service role key and API URL in environment variables (`apps/api/.env`).
- Set up storage buckets for hero images, gallery assets, and partner logos if you plan to migrate binary content out of the filesystem.

## 3. Dual-write module by module
1. **Auth** – Build Supabase functions/triggers for `verify_admin_credentials` to mirror the legacy password hashing. Roll out the `/api/auth` endpoints and keep PHP login in place until integration tests pass.
2. **Events** – Populate the `events` table, update the JS API consumers (or Next.js frontend when ready), and expose feature flags so the PHP homepage can opt-in per environment. Use `DATA_BACKEND=hybrid` while dual-running so the Fastify service writes to Supabase and mirrors changes back to MySQL.
3. **Media** – Migrate gallery, testimonial, and partner records to the consolidated `media_library` table. Update file storage references. Hybrid mode will continue serving media from MySQL until the Supabase library is populated.
4. **Messaging** – Redirect the public contact form to the new `/api/messaging` endpoint while leaving the PHP UI intact until the admin console is rewritten. Hybrid mode inserts into both stores.

For each module:
- Set the API’s `DATA_BACKEND` to `hybrid` during each module’s rollout so Supabase becomes the source of truth while the PHP application keeps reading from MySQL.
- Synchronize Supabase and MySQL data nightly during the transition.
- Add contract tests in `apps/api/tests` that cover the module’s API.
- Switch the production PHP frontend to consume the JS API only after verifying parity.

## 4. Frontend strategy
- Keep the current PHP templates online while the new frontend is designed. The API is versioned (`/api/*`) so it can serve both the legacy pages and the future JS frontend.
- When ready, scaffold a Next.js or Remix app under `apps/web/` and gradually reroute traffic using feature toggles.

## 5. Cutover
- Freeze PHP writes, run a final sync, and point DNS/env vars to the JS stack.
- Retire the PHP codebase after a read-only validation window.

## 6. Post-migration
- Set up monitoring (HTTP healthz, Supabase logs) and incident response runbooks.
- Schedule recurring backups from Supabase storage and Postgres.
