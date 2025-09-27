import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.number().int().positive(),
  sender_name: z.string(),
  sender_email: z.string().email(),
  subject: z.string().nullable(),
  body: z.string(),
  created_at: z.string(),
  status: z.enum(['new', 'read', 'archived']).default('new'),
});

export type MessageRecord = z.infer<typeof MessageSchema>;

export const CreateMessageSchema = MessageSchema.pick({
  sender_name: true,
  sender_email: true,
  subject: true,
  body: true,
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
