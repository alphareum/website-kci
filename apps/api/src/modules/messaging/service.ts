import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'messages';

export const MessageSchema = z.object({
  id: z.number().int().positive(),
  sender_name: z.string(),
  sender_email: z.string().email(),
  subject: z.string().nullable(),
  body: z.string(),
  created_at: z.string(),
  status: z.enum(['new', 'read', 'archived']).default('new'),
});

export const CreateMessageSchema = MessageSchema.pick({
  sender_name: true,
  sender_email: true,
  subject: true,
  body: true,
});

export type MessageRecord = z.infer<typeof MessageSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

export class MessagingService {
  async listMessages() {
    const rows = await readTable<MessageRecord>(TABLE);
    rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return z.array(MessageSchema).parse(rows);
  }

  async createMessage(input: CreateMessageInput) {
    const payload = CreateMessageSchema.parse(input);
    const rows = await readTable<MessageRecord>(TABLE);
    const record: MessageRecord = {
      id: nextId(rows),
      sender_name: payload.sender_name,
      sender_email: payload.sender_email,
      subject: payload.subject ?? null,
      body: payload.body,
      created_at: new Date().toISOString(),
      status: 'new',
    };

    rows.push(record);
    await writeTable(TABLE, rows);
    return MessageSchema.parse(record);
  }
}
