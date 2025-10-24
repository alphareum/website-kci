import { z } from 'zod';
declare const AdminSchema: z.ZodObject<{
    id: z.ZodNumber;
    email: z.ZodString;
    full_name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["owner", "editor", "contributor"]>>;
    password_hash: z.ZodString;
    last_login_at: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    email: string;
    full_name: string;
    role: "owner" | "editor" | "contributor";
    password_hash: string;
    last_login_at: string | null;
}, {
    id: number;
    email: string;
    full_name: string;
    password_hash: string;
    last_login_at: string | null;
    role?: "owner" | "editor" | "contributor" | undefined;
}>;
declare const PublicAdminSchema: z.ZodObject<Omit<{
    id: z.ZodNumber;
    email: z.ZodString;
    full_name: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["owner", "editor", "contributor"]>>;
    password_hash: z.ZodString;
    last_login_at: z.ZodNullable<z.ZodString>;
}, "password_hash">, "strip", z.ZodTypeAny, {
    id: number;
    email: string;
    full_name: string;
    role: "owner" | "editor" | "contributor";
    last_login_at: string | null;
}, {
    id: number;
    email: string;
    full_name: string;
    last_login_at: string | null;
    role?: "owner" | "editor" | "contributor" | undefined;
}>;
export declare const CredentialsSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type CredentialsInput = z.infer<typeof CredentialsSchema>;
export type AdminRecord = z.infer<typeof AdminSchema>;
export type PublicAdmin = z.infer<typeof PublicAdminSchema>;
export declare class InvalidCredentialsError extends Error {
    constructor();
}
export declare function hashPassword(password: string, salt?: string): string;
export declare function verifyPassword(password: string, storedHash: string): boolean;
export declare class AuthService {
    listAdmins(): Promise<PublicAdmin[]>;
    createAdmin(payload: Omit<AdminRecord, 'id' | 'last_login_at'> & {
        password: string;
    }): Promise<PublicAdmin>;
    verifyCredentials(input: CredentialsInput): Promise<PublicAdmin>;
}
export {};
