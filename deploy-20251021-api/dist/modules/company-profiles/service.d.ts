import { z } from 'zod';
export declare const CompanyProfileSchema: z.ZodObject<{
    id: z.ZodNumber;
    slug: z.ZodString;
    name: z.ZodString;
    logo_url: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
    website_url: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    social_media: z.ZodOptional<z.ZodObject<{
        instagram: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
        facebook: z.ZodOptional<z.ZodString>;
        twitter: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    }, {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    }>>;
    services: z.ZodArray<z.ZodString, "many">;
    founded_year: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    slug: string;
    description: string;
    name: string;
    logo_url: string | null;
    services: string[];
    email?: string | undefined;
    phone?: string | undefined;
    category?: string | undefined;
    website_url?: string | undefined;
    address?: string | undefined;
    social_media?: {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
    founded_year?: string | undefined;
}, {
    id: number;
    slug: string;
    description: string;
    name: string;
    logo_url: string | null;
    services: string[];
    email?: string | undefined;
    phone?: string | undefined;
    category?: string | undefined;
    website_url?: string | undefined;
    address?: string | undefined;
    social_media?: {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
    founded_year?: string | undefined;
}>;
export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;
export declare const UpsertCompanyProfileInputSchema: z.ZodObject<Omit<{
    id: z.ZodNumber;
    slug: z.ZodString;
    name: z.ZodString;
    logo_url: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
    website_url: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    social_media: z.ZodOptional<z.ZodObject<{
        instagram: z.ZodOptional<z.ZodString>;
        linkedin: z.ZodOptional<z.ZodString>;
        facebook: z.ZodOptional<z.ZodString>;
        twitter: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    }, {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    }>>;
    services: z.ZodArray<z.ZodString, "many">;
    founded_year: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "id">, "strip", z.ZodTypeAny, {
    slug: string;
    description: string;
    name: string;
    logo_url: string | null;
    services: string[];
    email?: string | undefined;
    phone?: string | undefined;
    category?: string | undefined;
    website_url?: string | undefined;
    address?: string | undefined;
    social_media?: {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
    founded_year?: string | undefined;
}, {
    slug: string;
    description: string;
    name: string;
    logo_url: string | null;
    services: string[];
    email?: string | undefined;
    phone?: string | undefined;
    category?: string | undefined;
    website_url?: string | undefined;
    address?: string | undefined;
    social_media?: {
        instagram?: string | undefined;
        linkedin?: string | undefined;
        facebook?: string | undefined;
        twitter?: string | undefined;
    } | undefined;
    founded_year?: string | undefined;
}>;
export type UpsertCompanyProfileInput = z.infer<typeof UpsertCompanyProfileInputSchema>;
/**
 * Get all company profiles
 */
export declare function getAllCompanyProfiles(): Promise<CompanyProfile[]>;
/**
 * Get company profile by ID
 */
export declare function getCompanyProfileById(id: number): Promise<CompanyProfile | null>;
/**
 * Get company profile by slug
 */
export declare function getCompanyProfileBySlug(slug: string): Promise<CompanyProfile | null>;
/**
 * Create new company profile
 */
export declare function createCompanyProfile(input: UpsertCompanyProfileInput): Promise<CompanyProfile>;
/**
 * Update existing company profile
 */
export declare function updateCompanyProfile(id: number, input: UpsertCompanyProfileInput): Promise<CompanyProfile>;
/**
 * Delete company profile
 */
export declare function deleteCompanyProfile(id: number): Promise<void>;
