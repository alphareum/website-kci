# KCI API (Fastify + Supabase)

This service exposes the CMS capabilities over a typed Fastify API.

## Getting started
1. Copy `.env.example` to `.env` and fill in Supabase credentials.
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
