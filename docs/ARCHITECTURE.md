# JS Architecture Overview

The new JS stack is organized as a monorepo with npm workspaces:

- `apps/api` – Fastify service exposing CMS features via REST. Each domain (auth, events, media, messaging) owns its own module folder with validation schemas, services, and route definitions.
- `scripts/migrations` – Utilities that extract data from the legacy MySQL database to seed Supabase during the migration window.
- `supabase/schema.sql` – Postgres schema definitions for the Supabase project.

## Module boundaries
- **Config** – `apps/api/src/config` centralizes environment parsing so every module relies on the same validated settings.
- **Data access** – `apps/api/src/lib/supabase.ts` exposes a singleton Supabase client. Domain modules interact with the database only through this layer.
- **Routes** – `apps/api/src/routes` composes feature modules. Adding a new capability means creating a module and registering it with the router.

## Frontend placeholder
The current PHP frontend remains under the repo root. A future JS frontend can live under `apps/web/` and talk to the API without disturbing the legacy site.

## Observability & Ops
- `/healthz` endpoint for uptime checks.
- Plan to extend with request logging, metrics, and tracing after Supabase integration.
