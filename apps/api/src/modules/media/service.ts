import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'media_library';

const MediaTypeEnum = z.enum(['gallery', 'testimonial', 'partner']);

const AssetUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => {
      try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch (err) {
        return value.startsWith('/');
      }
    },
    {
      message: 'Asset URL must be an absolute URL or start with /',
    }
  );

export const MediaItemSchema = z.object({
  id: z.number().int().positive(),
  type: MediaTypeEnum,
  title: z.string().nullable(),
  description: z.string().nullable(),
  asset_url: AssetUrlSchema,
  metadata: z.record(z.any()).nullable(),
  created_at: z.string(),
});

export const UpsertMediaSchema = MediaItemSchema.partial({
  id: true,
  created_at: true,
}).extend({
  type: MediaTypeEnum,
  asset_url: AssetUrlSchema,
});

export type MediaItem = z.infer<typeof MediaItemSchema>;
export type UpsertMediaInput = z.infer<typeof UpsertMediaSchema>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeMetadata(
  incoming: Record<string, unknown> | null | undefined,
  existing: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  if (incoming === null) {
    return null;
  }

  if (typeof incoming === 'undefined') {
    return isRecord(existing) ? existing : null;
  }

  const base = isRecord(existing) ? existing : {};
  const merged = { ...base, ...incoming } as Record<string, unknown>;
  return Object.keys(merged).length > 0 ? merged : null;
}

function buildMediaRecord(id: number, input: UpsertMediaInput, existing?: MediaItem): MediaItem {
  return {
    id,
    type: input.type,
    title: input.title ?? existing?.title ?? null,
    description: input.description ?? existing?.description ?? null,
    asset_url: input.asset_url ?? existing?.asset_url ?? '',
    metadata: mergeMetadata(input.metadata, existing?.metadata),
    created_at: existing?.created_at ?? new Date().toISOString(),
  };
}

export class MediaService {
  async listByType(type: z.infer<typeof MediaTypeEnum>) {
    const items = await readTable<MediaItem>(TABLE);
    const filtered = items.filter((item) => item.type === type);
    filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return z.array(MediaItemSchema).parse(filtered);
  }

  async upsertMedia(input: UpsertMediaInput) {
    const payload = UpsertMediaSchema.parse(input);
    const items = await readTable<MediaItem>(TABLE);

    if (payload.id) {
      const existing = items.find((item) => item.id === payload.id);
      if (!existing) {
        throw new Error('Media item not found');
      }
      const updated = buildMediaRecord(existing.id, payload, existing);
      const nextItems = items.map((item) => (item.id === updated.id ? updated : item));
      await writeTable(TABLE, nextItems);
      return MediaItemSchema.parse(updated);
    }

    const newId = nextId(items);
    const record = buildMediaRecord(newId, payload);
    const nextItems = [...items, record];
    await writeTable(TABLE, nextItems);
    return MediaItemSchema.parse(record);
  }

  async deleteMedia(id: number) {
    const items = await readTable<MediaItem>(TABLE);
    const existing = items.find((item) => item.id === id);
    if (!existing) {
      throw new Error('Media item not found');
    }
    const filtered = items.filter((item) => item.id !== id);
    await writeTable(TABLE, filtered);
    return existing;
  }
}
