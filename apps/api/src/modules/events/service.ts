import { resolveEventsRepositories, EventsRepository } from './repository.js';
import { EventRecord, UpsertEventInput, UpsertEventSchema } from './schema.js';

export class EventsService {
  private primary: EventsRepository;
  private fallback?: EventsRepository;

  constructor() {
    const repositories = resolveEventsRepositories();
    this.primary = repositories.primary;
    this.fallback = repositories.fallback;
  }

  async listPublished(): Promise<EventRecord[]> {
    try {
      const events = await this.primary.listPublished();
      if (events.length > 0 || !this.fallback) {
        return events;
      }
    } catch (error) {
      if (!this.fallback) {
        throw error;
      }
    }

    if (this.fallback) {
      return this.fallback.listPublished();
    }

    return [];
  }

  async upsertEvent(input: UpsertEventInput): Promise<EventRecord> {
    const payload = UpsertEventSchema.parse(input);
    const event = await this.primary.upsertEvent(payload);

    if (this.fallback && event) {
      try {
        await this.fallback.upsertEvent({ ...payload, id: event.id });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to mirror event to legacy database', error);
      }
    }

    return event;
  }
}
