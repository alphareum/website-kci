import { CreateMessageInput, CreateMessageSchema, MessageRecord } from './schema.js';
import { resolveMessagingRepositories, MessagingRepository } from './repository.js';

export class MessagingService {
  private primary: MessagingRepository;
  private fallback?: MessagingRepository;

  constructor() {
    const repositories = resolveMessagingRepositories();
    this.primary = repositories.primary;
    this.fallback = repositories.fallback;
  }

  async listMessages(): Promise<MessageRecord[]> {
    try {
      return await this.primary.listMessages();
    } catch (error) {
      if (this.fallback) {
        return this.fallback.listMessages();
      }
      throw error;
    }
  }

  async createMessage(input: CreateMessageInput): Promise<MessageRecord> {
    const payload = CreateMessageSchema.parse(input);
    const message = await this.primary.createMessage(payload);

    if (this.fallback) {
      try {
        await this.fallback.createMessage(payload);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Legacy message write skipped:', error);
      }
    }

    return message;
  }
}
