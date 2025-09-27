# KCI API (Fastify)

This service exposes the CMS capabilities over a typed Fastify API. By default it
persists data to JSON files so the CMS can run without any external database.
When you're ready to plug in Supabase, provide the credentials in the `.env` file
and migrate the services to use the hosted tables.

## Getting started
1. Copy `.env.example` to `.env` and adjust the `DATA_DIR` if needed. Supabase
   variables are optional until you provision the project.
2. Install dependencies from the repo root:
   ```bash
   npm install
   ```
3. Run the API in watch mode:
   ```bash
   npm run dev:api
   ```

Visiting `http://localhost:3000/` returns a quick status document with the
available entry points. All CMS functionality lives under the `/api/*` prefix,
and `http://localhost:3000/healthz` is available for monitoring checks. Default
admin credentials are `admin@example.com` with password `changeMe123`.

## Tests
```bash
npm --workspace apps-api run test
```
