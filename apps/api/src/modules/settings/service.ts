import { z } from 'zod';
import { readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'settings';

const OptionalTextSchema = z
  .preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().trim().min(1).nullable());

const OptionalUrlSchema = z
  .preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().url().nullable());

export const SiteSettingsSchema = z.object({
  contact_email: z.string().email().nullable(),
  contact_address: OptionalTextSchema,
  whatsapp_admin_label: OptionalTextSchema,
  whatsapp_admin_number: OptionalTextSchema,
  whatsapp_admin_link: OptionalUrlSchema,
  whatsapp_founder_label: OptionalTextSchema,
  whatsapp_founder_number: OptionalTextSchema,
  whatsapp_founder_link: OptionalUrlSchema,
  whatsapp_cofounder_label: OptionalTextSchema,
  whatsapp_cofounder_number: OptionalTextSchema,
  whatsapp_cofounder_link: OptionalUrlSchema,
  social_facebook: OptionalUrlSchema,
  social_instagram: OptionalUrlSchema,
  social_tiktok: OptionalUrlSchema,
  social_threads: OptionalUrlSchema,
  social_youtube: OptionalUrlSchema,
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

export const UpdateSettingsSchema = SiteSettingsSchema.partial();

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;

const DEFAULT_SETTINGS: SiteSettings = {
  contact_email: 'info@kci-indonesia.org',
  contact_address: 'Jakarta, Indonesia',
  whatsapp_admin_label: 'WhatsApp Admin',
  whatsapp_admin_number: '+62 812-3456-7890',
  whatsapp_admin_link: 'https://wa.me/628123456789',
  whatsapp_founder_label: 'WhatsApp Founder',
  whatsapp_founder_number: '+62 812-3456-7891',
  whatsapp_founder_link: 'https://wa.me/628123456791',
  whatsapp_cofounder_label: 'WhatsApp Co-Founder',
  whatsapp_cofounder_number: '+62 812-3456-7892',
  whatsapp_cofounder_link: 'https://wa.me/628123456792',
  social_facebook: null,
  social_instagram: null,
  social_tiktok: null,
  social_threads: null,
  social_youtube: null,
};

export class SettingsService {
  async getSettings(): Promise<SiteSettings> {
    const data = await readTable<SiteSettings>(TABLE, [DEFAULT_SETTINGS]);
    // Settings is stored as a single-item array, return first item or default
    const settings = data[0] ?? DEFAULT_SETTINGS;
    return SiteSettingsSchema.parse(settings);
  }

  async updateSettings(input: UpdateSettingsInput): Promise<SiteSettings> {
    const payload = UpdateSettingsSchema.parse(input);
    const current = await this.getSettings();

    const updated: SiteSettings = {
      ...current,
      ...payload,
    };

    // Store as single-item array
    await writeTable(TABLE, [updated]);
    return SiteSettingsSchema.parse(updated);
  }
}
