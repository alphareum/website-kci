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
      DATA_DIR: '/tmp/kci-data',
    } as NodeJS.ProcessEnv;
  });

  it('parses environment variables with optional Supabase settings', async () => {
    const { env } = await import('../src/config/env.js');
    expect(env.server.port).toBe(4000);
    expect(env.server.host).toBe('127.0.0.1');
    expect(env.publicBaseUrl).toBe('http://127.0.0.1:4000');
    expect(env.storage.dataDir).toBe('/tmp/kci-data');
    expect(env.supabase).toBeNull();
  });

  it('derives a localhost public base when binding to 0.0.0.0', async () => {
    process.env.API_HOST = '0.0.0.0';
    process.env.API_PORT = '5000';
    const { env } = await import('../src/config/env.js');
    expect(env.publicBaseUrl).toBe('http://localhost:5000');
  });
});
