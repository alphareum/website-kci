# Repository Guidelines

## General
- This monorepo contains the Fastify JSON API under `apps/api` and the Next.js admin console under `apps/web`. Use workspace-aware commands (e.g., `npm --workspace apps-api run build`) when referring to package scripts.
- Use two spaces for indentation in JavaScript/TypeScript, CSS, and JSON files. Keep trailing commas where the surrounding code already uses them, and terminate statements with semicolons.
- Prefer named exports. Only use default exports when the surrounding module already uses one or when React components are consumed via Next.js conventions.
- Keep environment-specific values in `.env*` files or Supabase config; do not hardcode secrets into the source tree.
- When adding new dependencies, update the relevant `package.json` inside the affected workspace instead of the root manifest.

## Testing & Verification
- Backend changes in `apps/api` must be covered by unit tests where practical. Run `npm --workspace apps-api run test` before opening a PR.
- For API build validation, run `npm --workspace apps-api run build`.
- Frontend changes in `apps/web` should at minimum compile with `npm --workspace web run build`. If you modify static export logic, also run `npm --workspace web run build:cms`.
- Update README files when altering developer setup steps or CLI workflows.
