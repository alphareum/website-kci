import { z } from 'zod';
import { getSupabaseClient } from '../../lib/supabase.js';

export const EventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable(),
  description: z.string().nullable(),
  location: z.string().nullable(),
  starts_at: z.string(),
  ends_at: z.string().nullable(),
  hero_image_url: z.string().url().nullable(),
  is_published: z.boolean(),
});

export type EventRecord = z.infer<typeof EventSchema>;

export const UpsertEventSchema = EventSchema.partial({
  id: true,
  is_published: true,
}).extend({
  title: z.string().min(1),
  slug: z.string().min(1),
});

export type UpsertEventInput = z.infer<typeof UpsertEventSchema>;

export class EventsService {
  private client = getSupabaseClient();

  async listPublished() {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('starts_at', { ascending: true });

    if (error) throw error;

    return z.array(EventSchema).parse(data ?? []);
  }

  async upsertEvent(input: UpsertEventInput) {
    const payload = UpsertEventSchema.parse(input);

    const { data, error } = await this.client
      .from('events')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;

    return EventSchema.parse(data);
  }
}
