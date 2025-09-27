import { ResultSetHeader } from 'mysql2/promise';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import { getLegacyPool } from '../../lib/mysql.js';
import { EventRecord, EventSchema, UpsertEventInput, UpsertEventSchema } from './schema.js';

export interface EventsRepository {
  listPublished(): Promise<EventRecord[]>;
  upsertEvent(input: UpsertEventInput): Promise<EventRecord>;
}

class SupabaseEventsRepository implements EventsRepository {
  private client = getSupabaseClient();

  async listPublished(): Promise<EventRecord[]> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('starts_at', { ascending: true });

    if (error) {
      throw error;
    }

    return z.array(EventSchema).parse(data ?? []);
  }

  async upsertEvent(input: UpsertEventInput): Promise<EventRecord> {
    const payload = UpsertEventSchema.parse(input);
    const { data, error } = await this.client
      .from('events')
      .upsert(payload)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return EventSchema.parse(data);
  }
}

class LegacyEventsRepository implements EventsRepository {
  private pool = getLegacyPool();

  private mapRow(row: any): EventRecord {
    const startsAt = row.event_date || row.starts_at;
    const endsAt = row.end_date || row.ends_at;
    const rawMax = row.max_participants != null ? Number(row.max_participants) : null;
    const maxParticipants = typeof rawMax === 'number' && Number.isFinite(rawMax) ? rawMax : null;
    const status = row.status ?? (row.is_published ? 'upcoming' : 'draft');

    return EventSchema.parse({
      id: Number(row.id),
      title: row.title,
      slug: row.slug ?? row.title,
      summary: row.description ?? null,
      description: row.content ?? row.description ?? null,
      content: row.content ?? row.description ?? null,
      location: row.location ?? null,
      registration_link: row.registration_link ?? null,
      max_participants: maxParticipants,
      status,
      starts_at: startsAt ? new Date(startsAt).toISOString() : new Date().toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      hero_image_url: row.image ?? row.hero_image_url ?? null,
      is_published: (row.is_published ?? status === 'upcoming') ? true : false,
    });
  }

  async listPublished(): Promise<EventRecord[]> {
    const [rows] = await this.pool.query(
      `SELECT id, title, slug, description, content, event_date, end_date, location, registration_link, max_participants, status, image
       FROM events
       WHERE status = 'upcoming' AND event_date >= NOW()
       ORDER BY event_date ASC`
    );

    const events = Array.isArray(rows) ? rows.map((row: any) => this.mapRow(row)) : [];
    return events;
  }

  async upsertEvent(input: UpsertEventInput): Promise<EventRecord> {
    const payload = UpsertEventSchema.parse(input);
    const startsAt = new Date(payload.starts_at);
    const endsAt = payload.ends_at ? new Date(payload.ends_at) : null;
    const status = payload.status ?? (payload.is_published === false ? 'draft' : 'upcoming');
    const summary = payload.summary ?? payload.description ?? '';
    const content = payload.content ?? payload.description ?? payload.summary ?? '';

    const dateFormatter = (value: Date | null) =>
      value ? value.toISOString().slice(0, 19).replace('T', ' ') : null;

    if (payload.id) {
      await this.pool.query(
        `UPDATE events
         SET title = ?, description = ?, content = ?, event_date = ?, end_date = ?, location = ?,
             registration_link = ?, max_participants = ?, status = ?
         WHERE id = ?`,
        [
          payload.title,
          summary,
          content,
          dateFormatter(startsAt),
          dateFormatter(endsAt),
          payload.location ?? '',
          payload.registration_link ?? null,
          payload.max_participants ?? null,
          status,
          payload.id,
        ]
      );

      const [rows] = await this.pool.query(`SELECT * FROM events WHERE id = ? LIMIT 1`, [payload.id]);
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!row) {
        throw new Error('EVENT_NOT_FOUND');
      }
      return this.mapRow(row);
    }

    const [existingRows] = await this.pool.query(
      `SELECT id FROM events WHERE slug = ? LIMIT 1`,
      [payload.slug]
    );

    const existing = Array.isArray(existingRows) ? existingRows[0] : null;

    if (existing) {
      return this.upsertEvent({ ...payload, id: Number(existing.id) });
    }

    const [result] = await this.pool.query<ResultSetHeader>(
      `INSERT INTO events (title, slug, description, content, event_date, end_date, location, registration_link, max_participants, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      [
        payload.title,
        payload.slug,
        summary,
        content,
        dateFormatter(startsAt),
        dateFormatter(endsAt),
        payload.location ?? '',
        payload.registration_link ?? null,
        payload.max_participants ?? null,
        status,
        1,
      ]
    );

    const insertId = (result as ResultSetHeader).insertId;
    const [rows] = await this.pool.query(`SELECT * FROM events WHERE id = ? LIMIT 1`, [insertId]);
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) {
      throw new Error('EVENT_NOT_FOUND');
    }
    return this.mapRow(row);
  }
}

export function resolveEventsRepositories(): {
  primary: EventsRepository;
  fallback?: EventsRepository;
} {
  if (env.dataBackend === 'mysql') {
    return { primary: new LegacyEventsRepository() };
  }

  if (env.dataBackend === 'hybrid') {
    return {
      primary: new SupabaseEventsRepository(),
      fallback: new LegacyEventsRepository(),
    };
  }

  return { primary: new SupabaseEventsRepository() };
}
