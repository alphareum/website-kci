# KCI CMS Frontend

This package contains the Phase 1 static admin console for the Komunitas Chinese Indonesia (KCI) site. It is a Next.js App Router project that consumes the existing Fastify API to manage events, media, links, and messages.

## Getting started

```bash
# from the repository root
cp apps/web/.env.local.example apps/web/.env.local # optional helper
npm install
npm run dev --workspace web
```

The CMS expects `NEXT_PUBLIC_API_BASE` to point to the deployed API, e.g. `http://localhost:3000/api` during local development.

## Available scripts

- `npm run dev` – start the Next.js dev server.
- `npm run build` – run the production build.
- `npm run build:cms` – build and export the static site to `apps/web/out` for deployment under `/cms` on the main domain.

## Static export configuration

`next.config.js` sets `output: 'export'` together with `basePath`/`assetPrefix` so the generated site can be uploaded to `/cms` on the production server. See the project brief for the accompanying Apache rewrite rules.
