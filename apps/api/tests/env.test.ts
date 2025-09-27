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
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
    } as NodeJS.ProcessEnv;
  });

  it('parses environment variables', async () => {
    const { env } = await import('../src/config/env.js');
    expect(env.server.port).toBe(4000);
    expect(env.server.host).toBe('127.0.0.1');
    expect(env.supabase.url).toContain('supabase');
  });
});
