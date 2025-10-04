# KCI API (Fastify)

This service exposes the CMS capabilities over a typed Fastify API. By default it
persists data to JSON files so the CMS can run without any external database.
When you're ready to plug in Supabase, provide the credentials in the `.env` file
and migrate the services to use the hosted tables.

## Getting started
1. Copy `.env.example` to `.env`, adjust the `DATA_DIR` if needed, and point
   `PUBLIC_BASE_URL` at the hostname that users will reach (for local
   development the default `http://localhost:3000` is sufficient). Provide
   `SUPABASE_URL` together with `SUPABASE_SERVICE_ROLE_KEY` (or the legacy
   `SUPABASE_KEY`) once you're ready to store media in Supabase instead of the
   local uploads directory. Supabase variables are optional until you
   provision the project.
2. Install dependencies from the repo root:
   ```bash
   npm install
   ```
3. Run the API in watch mode:
   ```bash
   npm run dev:api
   ```

```


## Tests
```bash
npm --workspace apps-api run test
```

### Verifying local media uploads

When running without Supabase storage the API stores uploaded files beneath
`apps/api/uploads` and serves them from the `/uploads/*` route. Make sure the
`PUBLIC_BASE_URL` environment variable matches the public origin for the API so
the admin console persists absolute URLs. After uploading a gallery,
testimonial, or partner image, the asset should display immediately using the
served `/uploads/` link.
