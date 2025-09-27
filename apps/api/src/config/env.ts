import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().default(3000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  LEGACY_MYSQL_DSN: z.string().optional(),
});

type EnvVars = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

const envVars: EnvVars = parsed.data;

export const env = {
  nodeEnv: envVars.NODE_ENV,
  server: {
    host: envVars.API_HOST,
    port: envVars.API_PORT,
  },
  supabase: {
    url: envVars.SUPABASE_URL,
    serviceRoleKey: envVars.SUPABASE_SERVICE_ROLE_KEY,
  },
  legacy: {
    mysqlDsn: envVars.LEGACY_MYSQL_DSN,
  },
};
