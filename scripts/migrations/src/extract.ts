import { createConnection } from 'mysql2/promise';
import { z } from 'zod';

const RequiredEnv = z.object({
  LEGACY_MYSQL_DSN: z.string().url({ message: 'LEGACY_MYSQL_DSN must be a mysql:// URL' }),
});

const env = RequiredEnv.parse(process.env);

async function main() {
  const url = new URL(env.LEGACY_MYSQL_DSN);

  const connection = await createConnection({
    host: url.hostname,
    port: Number(url.port || '3306'),
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
  });

  const legacyTables = ['admin', 'event', 'gallery', 'testimoni', 'mitra', 'setting', 'kontak'];
  const modernTables = ['users', 'events', 'gallery', 'testimonials', 'partners', 'site_settings', 'messages'];
  const tables = Array.from(new Set([...legacyTables, ...modernTables]));
  const exportPayload: Record<string, unknown[]> = {};

  for (const table of tables) {
    const [rows] = await connection.query(`SELECT * FROM ${table}`);
    exportPayload[table] = Array.isArray(rows) ? rows : [];
  }

  await connection.end();

  process.stdout.write(JSON.stringify(exportPayload, null, 2));
}

main().catch((error) => {
  console.error('Failed to extract MySQL data', error);
  process.exit(1);
});
