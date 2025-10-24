import { z } from 'zod';
export declare const LinkRecordSchema: z.ZodObject<{
    id: z.ZodNumber;
    label: z.ZodString;
    url: z.ZodString;
    category: z.ZodEnum<["primary", "secondary", "social"]>;
    order: z.ZodNumber;
    is_active: z.ZodBoolean;
    icon: z.ZodDefault<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
}, "strip", z.ZodTypeAny, {
    id: number;
    url: string;
    order: number;
    label: string;
    category: "primary" | "secondary" | "social";
    is_active: boolean;
    icon: string | null;
}, {
    id: number;
    url: string;
    order: number;
    label: string;
    category: "primary" | "secondary" | "social";
    is_active: boolean;
    icon?: string | null | undefined;
}>;
export declare const UpsertLinkSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
} & {
    label: z.ZodString;
    url: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["primary", "secondary", "social"]>>;
    order: z.ZodDefault<z.ZodNumber>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    order: number;
    label: string;
    category: "primary" | "secondary" | "social";
    is_active: boolean;
    id?: number | undefined;
    icon?: string | null | undefined;
}, {
    url: string;
    label: string;
    id?: number | undefined;
    order?: number | undefined;
    category?: "primary" | "secondary" | "social" | undefined;
    is_active?: boolean | undefined;
    icon?: string | null | undefined;
}>;
export type LinkRecord = z.infer<typeof LinkRecordSchema>;
export type UpsertLinkInput = z.infer<typeof UpsertLinkSchema>;
export declare class LinksService {
    listLinks(): Promise<{
        id: number;
        url: string;
        order: number;
        label: string;
        category: "primary" | "secondary" | "social";
        is_active: boolean;
        icon: string | null;
    }[]>;
    upsertLink(input: UpsertLinkInput): Promise<{
        id: number;
        url: string;
        order: number;
        label: string;
        category: "primary" | "secondary" | "social";
        is_active: boolean;
        icon: string | null;
    }>;
    deleteLink(id: number): Promise<void>;
}
