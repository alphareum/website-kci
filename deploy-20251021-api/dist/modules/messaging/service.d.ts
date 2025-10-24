import { z } from 'zod';
export declare const MessageSchema: z.ZodObject<{
    id: z.ZodNumber;
    sender_name: z.ZodString;
    sender_email: z.ZodString;
    subject: z.ZodNullable<z.ZodString>;
    body: z.ZodString;
    created_at: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["new", "read", "archived"]>>;
}, "strip", z.ZodTypeAny, {
    status: "new" | "read" | "archived";
    id: number;
    body: string;
    created_at: string;
    sender_name: string;
    sender_email: string;
    subject: string | null;
}, {
    id: number;
    body: string;
    created_at: string;
    sender_name: string;
    sender_email: string;
    subject: string | null;
    status?: "new" | "read" | "archived" | undefined;
}>;
export declare const CreateMessageSchema: z.ZodObject<Pick<{
    id: z.ZodNumber;
    sender_name: z.ZodString;
    sender_email: z.ZodString;
    subject: z.ZodNullable<z.ZodString>;
    body: z.ZodString;
    created_at: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["new", "read", "archived"]>>;
}, "body" | "sender_name" | "sender_email" | "subject">, "strip", z.ZodTypeAny, {
    body: string;
    sender_name: string;
    sender_email: string;
    subject: string | null;
}, {
    body: string;
    sender_name: string;
    sender_email: string;
    subject: string | null;
}>;
export type MessageRecord = z.infer<typeof MessageSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export declare class MessagingService {
    listMessages(): Promise<{
        status: "new" | "read" | "archived";
        id: number;
        body: string;
        created_at: string;
        sender_name: string;
        sender_email: string;
        subject: string | null;
    }[]>;
    createMessage(input: CreateMessageInput): Promise<{
        status: "new" | "read" | "archived";
        id: number;
        body: string;
        created_at: string;
        sender_name: string;
        sender_email: string;
        subject: string | null;
    }>;
}
