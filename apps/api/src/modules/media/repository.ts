import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import { getLegacyPool } from '../../lib/mysql.js';
import { MediaItem, MediaItemSchema, MediaTypeEnum, MediaType, UpsertMediaInput, UpsertMediaSchema } from './schema.js';

export interface MediaRepository {
  listByType(type: MediaType): Promise<MediaItem[]>;
  upsertMedia(input: UpsertMediaInput): Promise<MediaItem>;
}

class SupabaseMediaRepository implements MediaRepository {
  private client = getSupabaseClient();

  async listByType(type: MediaType): Promise<MediaItem[]> {
    const { data, error } = await this.client
      .from('media_library')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data ? data.map((row: any) => MediaItemSchema.parse(row)) : [];
  }

  async upsertMedia(input: UpsertMediaInput): Promise<MediaItem> {
    const payload = UpsertMediaSchema.parse(input);
    const { data, error } = await this.client
      .from('media_library')
      .upsert(payload)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return MediaItemSchema.parse(data);
  }
}

class LegacyMediaRepository implements MediaRepository {
  private pool = getLegacyPool();

  async listByType(type: MediaType): Promise<MediaItem[]> {
    switch (type) {
      case 'gallery':
        return this.listGallery();
      case 'testimonial':
        return this.listTestimonials();
      case 'partner':
        return this.listPartners();
      default:
        return [];
    }
  }

  async upsertMedia(): Promise<MediaItem> {
    throw new Error('LEGACY_MEDIA_WRITE_UNSUPPORTED');
  }

  private async listGallery(): Promise<MediaItem[]> {
    const [rows] = await this.pool.query(
      `SELECT id, title, image_path, thumbnail_path, description, created_at
       FROM gallery
       WHERE is_active = 1
       ORDER BY display_order ASC, created_at DESC`
    );

    return Array.isArray(rows)
      ? rows.map((row: any) =>
          MediaItemSchema.parse({
            id: Number(row.id),
            type: 'gallery' as const,
            title: row.title ?? null,
            description: row.description ?? null,
            asset_url: row.image_path ?? null,
            metadata: {
              thumbnail_url: row.thumbnail_path ?? null,
            },
            created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          })
        )
      : [];
  }

  private async listTestimonials(): Promise<MediaItem[]> {
    const [rows] = await this.pool.query(
      `SELECT id, name, position, company, content, rating, is_featured, created_at
       FROM testimonials
       WHERE is_active = 1
       ORDER BY created_at DESC`
    );

    return Array.isArray(rows)
      ? rows.map((row: any) =>
          MediaItemSchema.parse({
            id: Number(row.id),
            type: 'testimonial' as const,
            title: row.name ?? null,
            description: row.content ?? null,
            asset_url: null,
            metadata: {
              position: row.position ?? null,
              company: row.company ?? null,
              rating: row.rating ?? null,
              is_featured: !!row.is_featured,
            },
            created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          })
        )
      : [];
  }

  private async listPartners(): Promise<MediaItem[]> {
    const [rows] = await this.pool.query(
      `SELECT id, name, type, logo, website, instagram, description, display_order, created_at, is_active
       FROM partners
       WHERE is_active = 1
       ORDER BY display_order ASC, created_at DESC`
    );

    return Array.isArray(rows)
      ? rows.map((row: any) =>
          MediaItemSchema.parse({
            id: Number(row.id),
            type: 'partner' as const,
            title: row.name ?? null,
            description: row.description ?? null,
            asset_url: row.logo ?? null,
            metadata: {
              category: row.type ?? null,
              website: row.website ?? null,
              instagram: row.instagram ?? null,
              display_order: row.display_order ?? null,
            },
            created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          })
        )
      : [];
  }
}

export function resolveMediaRepositories(): {
  primary: MediaRepository;
  fallback?: MediaRepository;
} {
  if (env.dataBackend === 'mysql') {
    return { primary: new LegacyMediaRepository() };
  }

  if (env.dataBackend === 'hybrid') {
    return {
      primary: new SupabaseMediaRepository(),
      fallback: new LegacyMediaRepository(),
    };
  }

  return { primary: new SupabaseMediaRepository() };
}
