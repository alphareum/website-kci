import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

dotenv.config();

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDir = path.resolve(moduleDir, '../../data');

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().default(3000),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default('media-library'),
  LEGACY_MYSQL_DSN: z.string().optional(),
  DATA_DIR: z.string().default(defaultDataDir),
  PUBLIC_BASE_URL: z.string().url().optional(),
});

type EnvVars = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

const envVars: EnvVars = parsed.data;
const fallbackHost = envVars.API_HOST === '0.0.0.0' ? 'localhost' : envVars.API_HOST;
const fallbackBaseUrl = `http://${fallbackHost}:${envVars.API_PORT}`;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY ?? envVars.SUPABASE_KEY ?? null;

export const env = {
  nodeEnv: envVars.NODE_ENV,
  server: {
    host: envVars.API_HOST,
    port: envVars.API_PORT,
  },
  publicBaseUrl: envVars.PUBLIC_BASE_URL ?? fallbackBaseUrl,
  supabase: envVars.SUPABASE_URL && supabaseKey
    ? {
        url: envVars.SUPABASE_URL,
        serviceRoleKey: supabaseKey,
        storageBucket: envVars.SUPABASE_STORAGE_BUCKET,
      }
    : null,
  legacy: {
    mysqlDsn: envVars.LEGACY_MYSQL_DSN,
  },
  storage: {
    dataDir: envVars.DATA_DIR,
  },
};
