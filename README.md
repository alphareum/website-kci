# KCI CMS – Fastify JSON API (JavaScript)

Lightweight CMS API with session auth and JSON-backed storage for local testing and migration.

## Requirements
- Node.js 18+ (LTS recommended)
- npm

## Quick Start

```bash
# from repo root
npm install
cp apps/api/.env.example apps/api/.env
# (Windows PowerShell: Copy-Item apps/api/.env.example apps/api/.env)
```

## Deployment

Before starting the Passenger app, install dependencies and compile the API build:

```bash
npm install
npm --workspace apps-api run build
```

Configure Passenger to launch the compiled server by running `node apps/api/server.mjs` as the application entrypoint.
