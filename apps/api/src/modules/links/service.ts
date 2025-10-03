import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'links';

const LinkCategory = z.enum(['primary', 'secondary', 'social']);

const IconSchema = z.string().min(1).max(64).optional().nullable();

export const LinkRecordSchema = z.object({
  id: z.number().int().positive(),
  label: z.string(),
  url: z.string().url(),
  category: LinkCategory,
  order: z.number().int().nonnegative(),
  is_active: z.boolean(),
  icon: IconSchema.default(null),
});

export const UpsertLinkSchema = LinkRecordSchema.partial({
  id: true,
}).extend({
  label: z.string().min(1),
  url: z.string().url(),
  category: LinkCategory.default('primary'),
  order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
  icon: IconSchema,
});

export type LinkRecord = z.infer<typeof LinkRecordSchema>;
export type UpsertLinkInput = z.infer<typeof UpsertLinkSchema>;

export class LinksService {
  async listLinks() {
    const links = await readTable<LinkRecord>(TABLE);
    const sorted = [...links].sort((a, b) => a.order - b.order);
    return z.array(LinkRecordSchema).parse(sorted);
  }

  async upsertLink(input: UpsertLinkInput) {
    const payload = UpsertLinkSchema.parse(input);
    const links = await readTable<LinkRecord>(TABLE);

    if (payload.id) {
      const existing = links.find((link) => link.id === payload.id);
      if (!existing) {
        throw new Error('Link not found');
      }
      const updated: LinkRecord = {
        ...existing,
        ...payload,
        icon: typeof payload.icon === 'undefined' ? existing.icon ?? null : payload.icon,
      };
      const nextLinks = links.map((link) => (link.id === updated.id ? updated : link));
      await writeTable(TABLE, nextLinks);
      return LinkRecordSchema.parse(updated);
    }

    const newId = nextId(links);
    const record: LinkRecord = {
      id: newId,
      label: payload.label,
      url: payload.url,
      category: payload.category ?? 'primary',
      order: payload.order ?? 0,
      is_active: payload.is_active ?? true,
      icon: payload.icon ?? null,
    };
    const nextLinks = [...links, record];
    await writeTable(TABLE, nextLinks);
    return LinkRecordSchema.parse(record);
  }

  async deleteLink(id: number) {
    const links = await readTable<LinkRecord>(TABLE);
    const filtered = links.filter((link) => link.id !== id);
    if (filtered.length === links.length) {
      throw new Error('Link not found');
    }
    await writeTable(TABLE, filtered);
  }
}
