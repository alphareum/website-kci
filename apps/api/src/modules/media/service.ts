import { z } from 'zod';
import { getSupabaseClient } from '../../lib/supabase.js';

const MediaTypeEnum = z.enum(['gallery', 'testimonial', 'partner']);

export const MediaItemSchema = z.object({
  id: z.number().int().positive(),
  type: MediaTypeEnum,
  title: z.string().nullable(),
  description: z.string().nullable(),
  asset_url: z.string().url(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string(),
});

export const UpsertMediaSchema = MediaItemSchema.partial({
  id: true,
  created_at: true,
}).extend({
  type: MediaTypeEnum,
  asset_url: z.string().url(),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;
export type UpsertMediaInput = z.infer<typeof UpsertMediaSchema>;

export class MediaService {
  private client = getSupabaseClient();

  async listByType(type: z.infer<typeof MediaTypeEnum>) {
    const { data, error } = await this.client
      .from('media_library')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return z.array(MediaItemSchema).parse(data ?? []);
  }

  async upsertMedia(input: UpsertMediaInput) {
    const payload = UpsertMediaSchema.parse(input);
    const { data, error } = await this.client
      .from('media_library')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    return MediaItemSchema.parse(data);
  }
}
