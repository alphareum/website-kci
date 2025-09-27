import { z } from 'zod';
import { resolveAuthRepositories, AdminRecord, AuthRepository } from './repository.js';

export const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type CredentialsInput = z.infer<typeof CredentialsSchema>;

export class AuthService {
  private primary: AuthRepository;
  private fallback?: AuthRepository;

  constructor() {
    const repositories = resolveAuthRepositories();
    this.primary = repositories.primary;
    this.fallback = repositories.fallback;
  }

  async listAdmins() {
    try {
      const admins = await this.primary.listAdmins();
      if (admins.length > 0 || !this.fallback) {
        return admins;
      }
    } catch (error) {
      if (!this.fallback) {
        throw error;
      }
    }

    if (this.fallback) {
      return this.fallback.listAdmins();
    }

    return [];
  }

  async verifyCredentials(input: CredentialsInput): Promise<AdminRecord> {
    const payload = CredentialsSchema.parse(input);
    try {
      return await this.primary.verifyCredentials(payload.email, payload.password);
    } catch (error) {
      if (this.fallback) {
        return this.fallback.verifyCredentials(payload.email, payload.password);
      }
      throw error;
    }
  }
}
