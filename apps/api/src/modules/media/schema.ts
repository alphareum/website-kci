import { z } from 'zod';

export const MediaTypeEnum = z.enum(['gallery', 'testimonial', 'partner']);

export type MediaType = z.infer<typeof MediaTypeEnum>;

export const MediaItemSchema = z.object({
  id: z.number().int().positive(),
  type: MediaTypeEnum,
  title: z.string().nullable(),
  description: z.string().nullable(),
  asset_url: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  created_at: z.string(),
});

export type MediaItem = z.infer<typeof MediaItemSchema>;

export const UpsertMediaSchema = MediaItemSchema.partial({
  id: true,
  metadata: true,
  created_at: true,
}).extend({
  type: MediaTypeEnum,
  asset_url: z.string().nullable(),
});

export type UpsertMediaInput = z.infer<typeof UpsertMediaSchema>;
