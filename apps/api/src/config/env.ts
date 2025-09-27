import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const mysqlUrl = z
  .string()
  .url({ message: 'LEGACY_MYSQL_DSN must be a valid mysql:// URL' })
  .refine((value) => value.startsWith('mysql://'), {
    message: 'LEGACY_MYSQL_DSN must use the mysql:// scheme',
  });

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().default(3000),
  DATA_BACKEND: z.enum(['supabase', 'mysql', 'hybrid']).default('supabase'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  LEGACY_MYSQL_DSN: mysqlUrl.optional(),
});

type EnvVars = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

const envVars: EnvVars = parsed.data;

const missingEnv: string[] = [];

if (envVars.DATA_BACKEND !== 'mysql') {
  if (!envVars.SUPABASE_URL) missingEnv.push('SUPABASE_URL');
  if (!envVars.SUPABASE_SERVICE_ROLE_KEY) missingEnv.push('SUPABASE_SERVICE_ROLE_KEY');
}

if (envVars.DATA_BACKEND !== 'supabase' && !envVars.LEGACY_MYSQL_DSN) {
  missingEnv.push('LEGACY_MYSQL_DSN');
}

if (missingEnv.length > 0) {
  console.error('Missing required environment variables:', missingEnv.join(', '));
  throw new Error('Invalid environment configuration');
}

export const env = {
  nodeEnv: envVars.NODE_ENV,
  dataBackend: envVars.DATA_BACKEND,
  server: {
    host: envVars.API_HOST,
    port: envVars.API_PORT,
  },
  supabase: envVars.SUPABASE_URL
    ? {
        url: envVars.SUPABASE_URL,
        serviceRoleKey: envVars.SUPABASE_SERVICE_ROLE_KEY!,
      }
    : null,
  legacy: {
    mysqlDsn: envVars.LEGACY_MYSQL_DSN ?? null,
  },
};
