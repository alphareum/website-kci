# KCI API (Fastify + Supabase)

This service exposes the CMS capabilities over a typed Fastify API.

## Getting started
1. Copy `.env.example` to `.env` and choose a data backend:
   - `DATA_BACKEND=supabase` (default) uses Supabase exclusively.
   - `DATA_BACKEND=mysql` queries the existing MySQL database directly.
   - `DATA_BACKEND=hybrid` prefers Supabase but falls back to MySQL reads and mirrors writes back to the legacy tables when possible.
   Provide the matching Supabase credentials or `LEGACY_MYSQL_DSN` depending on the mode.
2. Install dependencies from the repo root:
   ```bash
   npm install
   ```
3. Run the API in watch mode:
   ```bash
   npm run dev:api
   ```

The server exposes routes under `/api/*` plus `/healthz` for monitoring.

## Tests
```bash
npm --workspace apps-api run test
```
