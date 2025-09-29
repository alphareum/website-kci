import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'contacts';

const OptionalTextSchema = z
  .preprocess((value) => {
    if (typeof value !== 'string') {
      return value;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().trim().min(1).nullable());

const UrlLikeSchema = z
  .string()
  .trim()
  .min(1)
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (error) {
      return value.startsWith('/');
    }
  }, { message: 'URL must be absolute (http/https) or start with /' });

const OptionalUrlSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, UrlLikeSchema.nullable());

export const ContactSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  role: z.string().nullable(),
  phone: z.string().nullable(),
  whatsapp_url: z.string().nullable(),
  photo_url: z.string().nullable(),
});

export type ContactRecord = z.infer<typeof ContactSchema>;

export const UpsertContactSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(1),
  role: OptionalTextSchema.optional(),
  phone: OptionalTextSchema.optional(),
  whatsapp_url: OptionalUrlSchema.optional(),
  photo_url: OptionalUrlSchema.optional(),
});

export type UpsertContactInput = z.infer<typeof UpsertContactSchema>;

const FALLBACK_CONTACTS: ContactRecord[] = [
  {
    id: 1,
    name: 'Founder KCI',
    role: 'Pendiri Komunitas',
    phone: '+62 878-8492-4385',
    whatsapp_url: 'https://wa.me/6287884924385',
    photo_url: '/assets/profile/founder-profile.jpg',
  },
  {
    id: 2,
    name: 'Admin KCI',
    role: 'Administrasi & Informasi Kegiatan',
    phone: '+62 856-4187-7775',
    whatsapp_url: 'https://wa.me/6285641877775',
    photo_url: '/assets/profile/admin-kci-profile.jpg',
  },
];

function buildContactRecord(id: number, input: UpsertContactInput, existing?: ContactRecord): ContactRecord {
  return {
    id,
    name: input.name.trim(),
    role: typeof input.role === 'string' ? input.role : existing?.role ?? null,
    phone: typeof input.phone === 'string' ? input.phone : existing?.phone ?? null,
    whatsapp_url:
      typeof input.whatsapp_url === 'string'
        ? input.whatsapp_url
        : existing?.whatsapp_url ?? null,
    photo_url: typeof input.photo_url === 'string' ? input.photo_url : existing?.photo_url ?? null,
  };
}

export class ContactsService {
  async listContacts() {
    const contacts = await readTable<ContactRecord>(TABLE, FALLBACK_CONTACTS);
    return z.array(ContactSchema).parse(contacts);
  }

  async upsertContact(input: UpsertContactInput) {
    const payload = UpsertContactSchema.parse(input);
    const contacts = await readTable<ContactRecord>(TABLE, FALLBACK_CONTACTS);

    if (payload.id) {
      const existing = contacts.find((contact) => contact.id === payload.id);
      if (!existing) {
        throw new Error('Contact not found');
      }
      const updated = buildContactRecord(existing.id, payload, existing);
      const nextContacts = contacts.map((contact) =>
        contact.id === updated.id ? updated : contact
      );
      await writeTable(TABLE, nextContacts);
      return ContactSchema.parse(updated);
    }

    const newId = nextId(contacts);
    const record = buildContactRecord(newId, payload);
    const nextContacts = [...contacts, record];
    await writeTable(TABLE, nextContacts);
    return ContactSchema.parse(record);
  }

  async deleteContact(id: number) {
    const contacts = await readTable<ContactRecord>(TABLE, FALLBACK_CONTACTS);
    const exists = contacts.some((contact) => contact.id === id);
    if (!exists) {
      throw new Error('Contact not found');
    }
    const nextContacts = contacts.filter((contact) => contact.id !== id);
    await writeTable(TABLE, nextContacts);
    return { success: true } as const;
  }
}
