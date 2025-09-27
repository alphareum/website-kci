import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'events';

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

function buildEventRecord(id: number, input: UpsertEventInput, existing?: EventRecord): EventRecord {
  return {
    id,
    title: input.title ?? existing?.title ?? '',
    slug: input.slug ?? existing?.slug ?? '',
    summary: input.summary ?? existing?.summary ?? null,
    description: input.description ?? existing?.description ?? null,
    location: input.location ?? existing?.location ?? null,
    starts_at: input.starts_at ?? existing?.starts_at ?? new Date().toISOString(),
    ends_at: input.ends_at ?? existing?.ends_at ?? null,
    hero_image_url: input.hero_image_url ?? existing?.hero_image_url ?? null,
    is_published: input.is_published ?? existing?.is_published ?? false,
  };
}

export class EventsService {
  async listPublished() {
    const events = await readTable<EventRecord>(TABLE);
    const published = events.filter((event) => event.is_published);
    published.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return z.array(EventSchema).parse(published);
  }

  async upsertEvent(input: UpsertEventInput) {
    const payload = UpsertEventSchema.parse(input);
    const events = await readTable<EventRecord>(TABLE);

    if (payload.id) {
      const existing = events.find((event) => event.id === payload.id);
      if (!existing) {
        throw new Error('Event not found');
      }
      const updated = buildEventRecord(existing.id, payload, existing);
      const nextEvents = events.map((event) => (event.id === updated.id ? updated : event));
      await writeTable(TABLE, nextEvents);
      return EventSchema.parse(updated);
    }

    const newId = nextId(events);
    const record: EventRecord = buildEventRecord(newId, payload);
    const nextEvents = [...events, record];
    await writeTable(TABLE, nextEvents);
    return EventSchema.parse(record);
  }
}
