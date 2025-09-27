import { z } from 'zod';
import { getSupabaseClient } from '../../lib/supabase.js';

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
  private client = getSupabaseClient();

  async listMessages() {
    const { data, error } = await this.client
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return z.array(MessageSchema).parse(data ?? []);
  }

  async createMessage(input: CreateMessageInput) {
    const payload = CreateMessageSchema.parse(input);

    const { data, error } = await this.client
      .from('messages')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    return MessageSchema.parse(data);
  }
}
