import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

// --------------------------------------------------------------------------
// Schemas
// --------------------------------------------------------------------------

const ExperienceItemSchema = z.object({
  period: z.string(),
  title: z.string(),
  organization: z.string(),
  description: z.string(),
});

const EducationItemSchema = z.object({
  period: z.string(),
  degree: z.string(),
  institution: z.string(),
  description: z.string().optional(),
});

const AchievementItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  year: z.string(),
});

export const ProfileSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string(),
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: z.string().email(),
  photo_url: z.string().nullable(),
  bio: z.string(),
  experience: z.array(ExperienceItemSchema),
  education: z.array(EducationItemSchema),
  achievements: z.array(AchievementItemSchema),
  skills: z.array(z.string()),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const UpsertProfileInputSchema = ProfileSchema.omit({ id: true });
export type UpsertProfileInput = z.infer<typeof UpsertProfileInputSchema>;

// --------------------------------------------------------------------------
// Storage
// --------------------------------------------------------------------------

interface ProfileRecord {
  id: number;
  slug: string;
  name: string;
  title: string;
  location: string;
  email: string;
  photo_url: string | null;
  bio: string;
  experience: Array<{
    period: string;
    title: string;
    organization: string;
    description: string;
  }>;
  education: Array<{
    period: string;
    degree: string;
    institution: string;
    description?: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    year: string;
  }>;
  skills: string[];
}

interface ProfilesDB {
  nextId: number;
  profiles: ProfileRecord[];
}

const DB_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '', 'kci-data', 'db');
const DB_FILE = path.join(DB_DIR, 'profiles.json');

async function ensureDbFile(): Promise<void> {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
    const initialData: ProfilesDB = { nextId: 1, profiles: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

async function readDb(): Promise<ProfilesDB> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(raw) as ProfilesDB;
}

async function writeDb(data: ProfilesDB): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --------------------------------------------------------------------------
// Business Logic
// --------------------------------------------------------------------------

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await readDb();
  return db.profiles.map((record) => ProfileSchema.parse(record));
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const db = await readDb();
  const record = db.profiles.find((p) => p.slug === slug);
  if (!record) return null;
  return ProfileSchema.parse(record);
}

export async function getProfileById(id: number): Promise<Profile | null> {
  const db = await readDb();
  const record = db.profiles.find((p) => p.id === id);
  if (!record) return null;
  return ProfileSchema.parse(record);
}

export async function createProfile(input: UpsertProfileInput): Promise<Profile> {
  const db = await readDb();

  // Check if slug already exists
  const existing = db.profiles.find((p) => p.slug === input.slug);
  if (existing) {
    throw new Error(`Profile with slug "${input.slug}" already exists`);
  }

  const newProfile: ProfileRecord = {
    id: db.nextId,
    ...input,
  };

  db.profiles.push(newProfile);
  db.nextId += 1;
  await writeDb(db);

  return ProfileSchema.parse(newProfile);
}

export async function updateProfile(id: number, input: UpsertProfileInput): Promise<Profile> {
  const db = await readDb();
  const index = db.profiles.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Profile with id ${id} not found`);
  }

  // Check if slug conflicts with another profile
  const slugConflict = db.profiles.find((p) => p.slug === input.slug && p.id !== id);
  if (slugConflict) {
    throw new Error(`Profile with slug "${input.slug}" already exists`);
  }

  const updatedProfile: ProfileRecord = {
    id,
    ...input,
  };

  db.profiles[index] = updatedProfile;
  await writeDb(db);

  return ProfileSchema.parse(updatedProfile);
}

export async function deleteProfile(id: number): Promise<void> {
  const db = await readDb();
  const index = db.profiles.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new Error(`Profile with id ${id} not found`);
  }

  db.profiles.splice(index, 1);
  await writeDb(db);
}
