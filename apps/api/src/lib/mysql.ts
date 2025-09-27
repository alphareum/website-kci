import { createPool, Pool } from 'mysql2/promise';
import { env } from '../config/env.js';

let pool: Pool | null = null;

function parseDsn(dsn: string) {
  const url = new URL(dsn);
  return {
    host: url.hostname,
    port: Number(url.port || '3306'),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace('/', ''),
  };
}

export function getLegacyPool() {
  if (!env.legacy.mysqlDsn) {
    throw new Error('LEGACY_MYSQL_DSN is not configured');
  }

  if (!pool) {
    const config = parseDsn(env.legacy.mysqlDsn);
    pool = createPool({
      ...config,
      namedPlaceholders: true,
      waitForConnections: true,
      connectionLimit: 5,
    });
  }

  return pool;
}

export async function closeLegacyPool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
