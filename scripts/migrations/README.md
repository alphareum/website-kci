# Migration utilities

This workspace contains helper scripts that read from the legacy MySQL database and prepare payloads for Supabase imports.

## Extracting legacy content
```bash
LEGACY_MYSQL_DSN="mysql://user:pass@host:3306/db" npm --workspace migration-tools run extract > legacy-export.json
```

The command prints JSON arrays for the tables used by the CMS (both the older `event/testimoni/mitra` naming and the newer `events/testimonials/partners` tables). Feed this file into Supabase import routines or transform it with additional scripts.
