# JS Architecture Overview

The new JS stack is organized as a monorepo with npm workspaces:

- `apps/api` – Fastify service exposing CMS features via REST. Each domain (auth, events, media, messaging) owns its own module folder with validation schemas, repositories, services, and route definitions.
- `scripts/migrations` – Utilities that extract data from the legacy MySQL database to seed Supabase during the migration window.
- `supabase/schema.sql` – Postgres schema definitions for the Supabase project.

## Module boundaries
- **Config** – `apps/api/src/config` centralizes environment parsing so every module relies on the same validated settings.
- **Data access** – Repository factories decide whether to hit Supabase, the legacy MySQL database, or both (hybrid mode) based on the validated environment configuration. Shared helpers under `apps/api/src/lib` expose singletons for Supabase and MySQL connections.
- **Migration safety** – Services optimistically read/write against Supabase and fall back to MySQL when necessary so the legacy PHP site keeps functioning while the JS stack is rolled out.
- **Routes** – `apps/api/src/routes` composes feature modules. Adding a new capability means creating a module and registering it with the router.

## Frontend placeholder
The current PHP frontend remains under the repo root. A future JS frontend can live under `apps/web/` and talk to the API without disturbing the legacy site.

## Observability & Ops
- `/healthz` endpoint for uptime checks.
- Plan to extend with request logging, metrics, and tracing after Supabase integration.
