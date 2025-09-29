import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('dotenv', () => ({
  default: { config: vi.fn() },
}));

describe('environment configuration', () => {
  beforeEach(() => {
    process.env = {
      NODE_ENV: 'test',
      API_HOST: '127.0.0.1',
      API_PORT: '4000',
      DATA_DIR: '/tmp/kci-data',
    } as NodeJS.ProcessEnv;
  });

  it('parses environment variables with optional Supabase settings', async () => {
    const { env } = await import('../src/config/env.js');
    expect(env.server.port).toBe(4000);
    expect(env.server.host).toBe('127.0.0.1');
    expect(env.storage.dataDir).toBe('/tmp/kci-data');
    expect(env.supabase).toBeNull();
  });
});
