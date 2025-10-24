import { z } from 'zod';
export declare const ContactSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    role: z.ZodNullable<z.ZodString>;
    phone: z.ZodNullable<z.ZodString>;
    whatsapp_url: z.ZodNullable<z.ZodString>;
    photo_url: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    role: string | null;
    name: string;
    phone: string | null;
    whatsapp_url: string | null;
    photo_url: string | null;
}, {
    id: number;
    role: string | null;
    name: string;
    phone: string | null;
    whatsapp_url: string | null;
    photo_url: string | null;
}>;
export type ContactRecord = z.infer<typeof ContactSchema>;
export declare const UpsertContactSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    role: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodString>, string | null, unknown>>;
    phone: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodString>, string | null, unknown>>;
    whatsapp_url: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>, string | null, unknown>>;
    photo_url: z.ZodOptional<z.ZodEffects<z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>, string | null, unknown>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id?: number | undefined;
    role?: string | null | undefined;
    phone?: string | null | undefined;
    whatsapp_url?: string | null | undefined;
    photo_url?: string | null | undefined;
}, {
    name: string;
    id?: number | undefined;
    role?: unknown;
    phone?: unknown;
    whatsapp_url?: unknown;
    photo_url?: unknown;
}>;
export type UpsertContactInput = z.infer<typeof UpsertContactSchema>;
export declare class ContactsService {
    listContacts(): Promise<{
        id: number;
        role: string | null;
        name: string;
        phone: string | null;
        whatsapp_url: string | null;
        photo_url: string | null;
    }[]>;
    upsertContact(input: UpsertContactInput): Promise<{
        id: number;
        role: string | null;
        name: string;
        phone: string | null;
        whatsapp_url: string | null;
        photo_url: string | null;
    }>;
    deleteContact(id: number): Promise<{
        readonly success: true;
    }>;
}
