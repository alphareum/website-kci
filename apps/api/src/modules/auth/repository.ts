import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import { getLegacyPool } from '../../lib/mysql.js';

export const AdminRecordSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  full_name: z.string(),
  role: z.string(),
  last_login_at: z.string().nullable().optional(),
});

export type AdminRecord = z.infer<typeof AdminRecordSchema>;

export interface AuthRepository {
  listAdmins(): Promise<AdminRecord[]>;
  verifyCredentials(email: string, password: string): Promise<AdminRecord>;
}

class SupabaseAuthRepository implements AuthRepository {
  private client = getSupabaseClient();

  async listAdmins(): Promise<AdminRecord[]> {
    const { data, error } = await this.client
      .from('admins')
      .select('id, email, full_name, role, last_login_at')
      .order('email');

    if (error) {
      throw error;
    }

    return z.array(AdminRecordSchema).parse(data ?? []);
  }

  async verifyCredentials(email: string, password: string): Promise<AdminRecord> {
    const { data, error } = await this.client
      .rpc('verify_admin_credentials', {
        admin_email: email,
        admin_password: password,
      })
      .single();

    if (error) {
      throw error;
    }

    return AdminRecordSchema.parse(data);
  }
}

class LegacyAuthRepository implements AuthRepository {
  private pool = getLegacyPool();

  async listAdmins(): Promise<AdminRecord[]> {
    const [rows] = await this.pool.query(
      `SELECT id, email, full_name, role, last_login FROM users WHERE is_active = 1 ORDER BY email`
    );

    const admins = Array.isArray(rows)
      ? rows.map((row: any) => ({
          id: Number(row.id),
          email: row.email,
          full_name: row.full_name ?? row.username ?? '',
          role: row.role ?? 'editor',
          last_login_at: row.last_login ? new Date(row.last_login).toISOString() : null,
        }))
      : [];

    return z.array(AdminRecordSchema).parse(admins);
  }

  async verifyCredentials(email: string, password: string): Promise<AdminRecord> {
    const [rows] = await this.pool.query(
      `SELECT * FROM users WHERE (email = ? OR username = ?) AND is_active = 1 LIMIT 1`,
      [email, email]
    );

    const user = Array.isArray(rows) ? rows[0] : null;

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const match = bcrypt.compareSync(password, user.password);

    if (!match) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return AdminRecordSchema.parse({
      id: Number(user.id),
      email: user.email,
      full_name: user.full_name ?? user.username ?? '',
      role: user.role ?? 'editor',
      last_login_at: user.last_login ? new Date(user.last_login).toISOString() : null,
    });
  }
}

export function resolveAuthRepositories(): {
  primary: AuthRepository;
  fallback?: AuthRepository;
} {
  if (env.dataBackend === 'mysql') {
    return { primary: new LegacyAuthRepository() };
  }

  if (env.dataBackend === 'hybrid') {
    return {
      primary: new SupabaseAuthRepository(),
      fallback: new LegacyAuthRepository(),
    };
  }

  return { primary: new SupabaseAuthRepository() };
}
