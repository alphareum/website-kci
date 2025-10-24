import { z } from 'zod';
declare const MediaTypeEnum: z.ZodEnum<["gallery", "testimonial", "partner"]>;
export declare const MediaItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    type: z.ZodEnum<["gallery", "testimonial", "partner"]>;
    title: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    asset_url: z.ZodEffects<z.ZodString, string, string>;
    metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    order: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "gallery" | "testimonial" | "partner";
    id: number;
    title: string | null;
    description: string | null;
    asset_url: string;
    metadata: Record<string, any> | null;
    order: number | null;
    created_at: string;
}, {
    type: "gallery" | "testimonial" | "partner";
    id: number;
    title: string | null;
    description: string | null;
    asset_url: string;
    metadata: Record<string, any> | null;
    order: number | null;
    created_at: string;
}>;
export declare const UpsertMediaSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    title: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    order: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodEnum<["gallery", "testimonial", "partner"]>;
    asset_url: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    type: "gallery" | "testimonial" | "partner";
    title: string | null;
    description: string | null;
    asset_url: string;
    metadata: Record<string, any> | null;
    order: number | null;
    id?: number | undefined;
    created_at?: string | undefined;
}, {
    type: "gallery" | "testimonial" | "partner";
    title: string | null;
    description: string | null;
    asset_url: string;
    metadata: Record<string, any> | null;
    order: number | null;
    id?: number | undefined;
    created_at?: string | undefined;
}>;
export type MediaItem = z.infer<typeof MediaItemSchema>;
export type UpsertMediaInput = z.infer<typeof UpsertMediaSchema>;
export declare class MediaService {
    listByType(type: z.infer<typeof MediaTypeEnum>): Promise<{
        type: "gallery" | "testimonial" | "partner";
        id: number;
        title: string | null;
        description: string | null;
        asset_url: string;
        metadata: Record<string, any> | null;
        order: number | null;
        created_at: string;
    }[]>;
    upsertMedia(input: UpsertMediaInput): Promise<{
        type: "gallery" | "testimonial" | "partner";
        id: number;
        title: string | null;
        description: string | null;
        asset_url: string;
        metadata: Record<string, any> | null;
        order: number | null;
        created_at: string;
    }>;
    deleteMedia(id: number): Promise<{
        type: "gallery" | "testimonial" | "partner";
        id: number;
        title: string | null;
        description: string | null;
        asset_url: string;
        metadata: Record<string, any> | null;
        order: number | null;
        created_at: string;
    }>;
    reorderMedia(id: number, direction: 'up' | 'down'): Promise<void>;
}
export {};
