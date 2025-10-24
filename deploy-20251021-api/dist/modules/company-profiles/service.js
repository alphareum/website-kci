import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
// --------------------------------------------------------------------------
// Schemas
// --------------------------------------------------------------------------
const SocialMediaSchema = z.object({
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
}).optional();
export const CompanyProfileSchema = z.object({
    id: z.number().int().positive(),
    slug: z.string(),
    name: z.string(),
    logo_url: z.string().nullable(),
    description: z.string(),
    website_url: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    social_media: SocialMediaSchema,
    services: z.array(z.string()),
    founded_year: z.string().optional(),
    category: z.string().optional(),
});
export const UpsertCompanyProfileInputSchema = CompanyProfileSchema.omit({ id: true });
const DB_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', 'kci-data', 'db');
const DB_FILE = path.join(DB_DIR, 'company_profiles.json');
async function ensureDbFile() {
    try {
        await fs.access(DB_FILE);
    }
    catch {
        await fs.mkdir(DB_DIR, { recursive: true });
        const initialData = { nextId: 1, companyProfiles: [] };
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    }
}
async function readDb() {
    await ensureDbFile();
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(raw);
}
async function writeDb(db) {
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}
// --------------------------------------------------------------------------
// CRUD Operations
// --------------------------------------------------------------------------
/**
 * Get all company profiles
 */
export async function getAllCompanyProfiles() {
    const db = await readDb();
    return db.companyProfiles.map((record) => CompanyProfileSchema.parse(record));
}
/**
 * Get company profile by ID
 */
export async function getCompanyProfileById(id) {
    const db = await readDb();
    const record = db.companyProfiles.find((p) => p.id === id);
    if (!record) {
        return null;
    }
    return CompanyProfileSchema.parse(record);
}
/**
 * Get company profile by slug
 */
export async function getCompanyProfileBySlug(slug) {
    const db = await readDb();
    const record = db.companyProfiles.find((p) => p.slug === slug);
    if (!record) {
        return null;
    }
    return CompanyProfileSchema.parse(record);
}
/**
 * Create new company profile
 */
export async function createCompanyProfile(input) {
    const db = await readDb();
    // Check if slug already exists
    const existing = db.companyProfiles.find((p) => p.slug === input.slug);
    if (existing) {
        throw new Error(`Company profile with slug "${input.slug}" already exists`);
    }
    const newProfile = {
        id: db.nextId,
        ...input,
    };
    db.companyProfiles.push(newProfile);
    db.nextId += 1;
    await writeDb(db);
    return CompanyProfileSchema.parse(newProfile);
}
/**
 * Update existing company profile
 */
export async function updateCompanyProfile(id, input) {
    const db = await readDb();
    const index = db.companyProfiles.findIndex((p) => p.id === id);
    if (index === -1) {
        throw new Error(`Company profile with id ${id} not found`);
    }
    // Check if slug conflicts with another profile
    const slugConflict = db.companyProfiles.find((p) => p.slug === input.slug && p.id !== id);
    if (slugConflict) {
        throw new Error(`Company profile with slug "${input.slug}" already exists`);
    }
    const updatedProfile = {
        id,
        ...input,
    };
    db.companyProfiles[index] = updatedProfile;
    await writeDb(db);
    return CompanyProfileSchema.parse(updatedProfile);
}
/**
 * Delete company profile
 */
export async function deleteCompanyProfile(id) {
    const db = await readDb();
    const index = db.companyProfiles.findIndex((p) => p.id === id);
    if (index === -1) {
        throw new Error(`Company profile with id ${id} not found`);
    }
    db.companyProfiles.splice(index, 1);
    await writeDb(db);
}
//# sourceMappingURL=service.js.map