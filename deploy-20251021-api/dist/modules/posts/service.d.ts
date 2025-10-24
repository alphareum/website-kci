import { z } from 'zod';
export declare const PostSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    slug: z.ZodString;
    summary: z.ZodNullable<z.ZodString>;
    body: z.ZodString;
    cover_image_url: z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>;
    published_at: z.ZodNullable<z.ZodString>;
    is_published: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: number;
    body: string;
    title: string;
    slug: string;
    summary: string | null;
    is_published: boolean;
    cover_image_url: string | null;
    published_at: string | null;
}, {
    id: number;
    body: string;
    title: string;
    slug: string;
    summary: string | null;
    is_published: boolean;
    cover_image_url: string | null;
    published_at: string | null;
}>;
export type PostRecord = z.infer<typeof PostSchema>;
export declare const UpsertPostSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    summary: z.ZodNullable<z.ZodString>;
    is_published: z.ZodOptional<z.ZodBoolean>;
    cover_image_url: z.ZodNullable<z.ZodEffects<z.ZodString, string, string>>;
    published_at: z.ZodNullable<z.ZodString>;
} & {
    title: z.ZodString;
    slug: z.ZodString;
    body: z.ZodString;
}, "strip", z.ZodTypeAny, {
    body: string;
    title: string;
    slug: string;
    summary: string | null;
    cover_image_url: string | null;
    published_at: string | null;
    id?: number | undefined;
    is_published?: boolean | undefined;
}, {
    body: string;
    title: string;
    slug: string;
    summary: string | null;
    cover_image_url: string | null;
    published_at: string | null;
    id?: number | undefined;
    is_published?: boolean | undefined;
}>;
export type UpsertPostInput = z.infer<typeof UpsertPostSchema>;
interface ListPostsOptions {
    includeDrafts?: boolean;
}
interface GetPostOptions {
    includeDrafts?: boolean;
}
export declare class PostsService {
    listPosts(options?: ListPostsOptions): Promise<{
        id: number;
        body: string;
        title: string;
        slug: string;
        summary: string | null;
        is_published: boolean;
        cover_image_url: string | null;
        published_at: string | null;
    }[]>;
    getPostBySlug(slug: string, options?: GetPostOptions): Promise<{
        id: number;
        body: string;
        title: string;
        slug: string;
        summary: string | null;
        is_published: boolean;
        cover_image_url: string | null;
        published_at: string | null;
    } | null>;
    upsertPost(input: UpsertPostInput): Promise<{
        id: number;
        body: string;
        title: string;
        slug: string;
        summary: string | null;
        is_published: boolean;
        cover_image_url: string | null;
        published_at: string | null;
    }>;
    deletePost(id: number): Promise<void>;
}
export {};
