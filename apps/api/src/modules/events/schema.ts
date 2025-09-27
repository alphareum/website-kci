import { z } from 'zod';

export const EventSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable(),
  description: z.string().nullable(),
  content: z.string().nullable(),
  location: z.string().nullable(),
  registration_link: z.string().nullable(),
  max_participants: z.number().int().nullable(),
  status: z.string().nullable(),
  starts_at: z.string(),
  ends_at: z.string().nullable(),
  hero_image_url: z.string().nullable(),
  is_published: z.boolean(),
});

export type EventRecord = z.infer<typeof EventSchema>;

export const UpsertEventSchema = EventSchema.partial({
  id: true,
  status: true,
  max_participants: true,
  registration_link: true,
  summary: true,
  description: true,
  content: true,
  location: true,
  ends_at: true,
  hero_image_url: true,
  is_published: true,
}).extend({
  title: z.string().min(1),
  slug: z.string().min(1),
  starts_at: z.string().min(1),
});

export type UpsertEventInput = z.infer<typeof UpsertEventSchema>;
