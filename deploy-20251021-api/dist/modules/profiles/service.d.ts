import { z } from 'zod';
export declare const ProfileSchema: z.ZodObject<{
    id: z.ZodNumber;
    slug: z.ZodString;
    name: z.ZodString;
    title: z.ZodString;
    location: z.ZodString;
    email: z.ZodString;
    photo_url: z.ZodNullable<z.ZodString>;
    bio: z.ZodString;
    experience: z.ZodArray<z.ZodObject<{
        period: z.ZodString;
        title: z.ZodString;
        organization: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        period: string;
        organization: string;
    }, {
        title: string;
        description: string;
        period: string;
        organization: string;
    }>, "many">;
    education: z.ZodArray<z.ZodObject<{
        period: z.ZodString;
        degree: z.ZodString;
        institution: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }, {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }>, "many">;
    achievements: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        year: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        year: string;
    }, {
        title: string;
        description: string;
        year: string;
    }>, "many">;
    skills: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: number;
    email: string;
    location: string;
    title: string;
    slug: string;
    name: string;
    photo_url: string | null;
    bio: string;
    experience: {
        title: string;
        description: string;
        period: string;
        organization: string;
    }[];
    education: {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }[];
    achievements: {
        title: string;
        description: string;
        year: string;
    }[];
    skills: string[];
}, {
    id: number;
    email: string;
    location: string;
    title: string;
    slug: string;
    name: string;
    photo_url: string | null;
    bio: string;
    experience: {
        title: string;
        description: string;
        period: string;
        organization: string;
    }[];
    education: {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }[];
    achievements: {
        title: string;
        description: string;
        year: string;
    }[];
    skills: string[];
}>;
export type Profile = z.infer<typeof ProfileSchema>;
export declare const UpsertProfileInputSchema: z.ZodObject<Omit<{
    id: z.ZodNumber;
    slug: z.ZodString;
    name: z.ZodString;
    title: z.ZodString;
    location: z.ZodString;
    email: z.ZodString;
    photo_url: z.ZodNullable<z.ZodString>;
    bio: z.ZodString;
    experience: z.ZodArray<z.ZodObject<{
        period: z.ZodString;
        title: z.ZodString;
        organization: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        period: string;
        organization: string;
    }, {
        title: string;
        description: string;
        period: string;
        organization: string;
    }>, "many">;
    education: z.ZodArray<z.ZodObject<{
        period: z.ZodString;
        degree: z.ZodString;
        institution: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }, {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }>, "many">;
    achievements: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        year: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        year: string;
    }, {
        title: string;
        description: string;
        year: string;
    }>, "many">;
    skills: z.ZodArray<z.ZodString, "many">;
}, "id">, "strip", z.ZodTypeAny, {
    email: string;
    location: string;
    title: string;
    slug: string;
    name: string;
    photo_url: string | null;
    bio: string;
    experience: {
        title: string;
        description: string;
        period: string;
        organization: string;
    }[];
    education: {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }[];
    achievements: {
        title: string;
        description: string;
        year: string;
    }[];
    skills: string[];
}, {
    email: string;
    location: string;
    title: string;
    slug: string;
    name: string;
    photo_url: string | null;
    bio: string;
    experience: {
        title: string;
        description: string;
        period: string;
        organization: string;
    }[];
    education: {
        period: string;
        degree: string;
        institution: string;
        description?: string | undefined;
    }[];
    achievements: {
        title: string;
        description: string;
        year: string;
    }[];
    skills: string[];
}>;
export type UpsertProfileInput = z.infer<typeof UpsertProfileInputSchema>;
export declare function getAllProfiles(): Promise<Profile[]>;
export declare function getProfileBySlug(slug: string): Promise<Profile | null>;
export declare function getProfileById(id: number): Promise<Profile | null>;
export declare function createProfile(input: UpsertProfileInput): Promise<Profile>;
export declare function updateProfile(id: number, input: UpsertProfileInput): Promise<Profile>;
export declare function deleteProfile(id: number): Promise<void>;
