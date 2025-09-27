import { z } from 'zod';
import { getSupabaseClient } from '../../lib/supabase.js';

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CredentialsInput = z.infer<typeof CredentialsSchema>;

export class AuthService {
  private client = getSupabaseClient();

  async listAdmins() {
    const { data, error } = await this.client
      .from('admins')
      .select('id, email, full_name, role, last_login_at')
      .order('email');

    if (error) {
      throw error;
    }

    return data;
  }

  async verifyCredentials(input: CredentialsInput) {
    const payload = CredentialsSchema.parse(input);

    const { data, error } = await this.client
      .rpc('verify_admin_credentials', {
        admin_email: payload.email,
        admin_password: payload.password,
      })
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}
