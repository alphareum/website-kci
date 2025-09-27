import { MediaType, MediaItem, UpsertMediaInput, UpsertMediaSchema } from './schema.js';
import { resolveMediaRepositories, MediaRepository } from './repository.js';

export class MediaService {
  private primary: MediaRepository;
  private fallback?: MediaRepository;

  constructor() {
    const repositories = resolveMediaRepositories();
    this.primary = repositories.primary;
    this.fallback = repositories.fallback;
  }

  async listByType(type: MediaType): Promise<MediaItem[]> {
    try {
      const items = await this.primary.listByType(type);
      if (items.length > 0 || !this.fallback) {
        return items;
      }
    } catch (error) {
      if (!this.fallback) {
        throw error;
      }
    }

    if (this.fallback) {
      return this.fallback.listByType(type);
    }

    return [];
  }

  async upsertMedia(input: UpsertMediaInput): Promise<MediaItem> {
    const payload = UpsertMediaSchema.parse(input);
    const item = await this.primary.upsertMedia(payload);

    if (this.fallback) {
      try {
        await this.fallback.upsertMedia({ ...payload, id: item.id });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Legacy media write skipped:', error);
      }
    }

    return item;
  }
}
