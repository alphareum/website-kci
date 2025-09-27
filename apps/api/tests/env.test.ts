import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('dotenv', () => ({
  default: { config: vi.fn() },
}));

describe('environment configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = {
      NODE_ENV: 'test',
      API_HOST: '127.0.0.1',
      API_PORT: '4000',
      DATA_BACKEND: 'supabase',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
    } as NodeJS.ProcessEnv;
  });

  it('parses environment variables', async () => {
    const { env } = await import('../src/config/env.js');
    expect(env.server.port).toBe(4000);
    expect(env.server.host).toBe('127.0.0.1');
    expect(env.supabase?.url).toContain('supabase');
    expect(env.dataBackend).toBe('supabase');
  });

  it('allows mysql-only backend when DSN is provided', async () => {
    process.env = {
      NODE_ENV: 'test',
      DATA_BACKEND: 'mysql',
      LEGACY_MYSQL_DSN: 'mysql://user:pass@localhost:3306/app',
    } as NodeJS.ProcessEnv;

    const { env } = await import('../src/config/env.js');
    expect(env.dataBackend).toBe('mysql');
    expect(env.legacy.mysqlDsn).toContain('mysql://');
    expect(env.supabase).toBeNull();
  });
});
