import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';
const TABLE = 'media_library';
const MediaTypeEnum = z.enum(['gallery', 'testimonial', 'partner']);
const AssetUrlSchema = z
    .string()
    .min(1)
    .refine((value) => {
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch (err) {
        return value.startsWith('/');
    }
}, {
    message: 'Asset URL must be an absolute URL or start with /',
});
export const MediaItemSchema = z.object({
    id: z.number().int().positive(),
    type: MediaTypeEnum,
    title: z.string().nullable(),
    description: z.string().nullable(),
    asset_url: AssetUrlSchema,
    metadata: z.record(z.string(), z.any()).nullable(),
    order: z.number().int().nullable(),
    created_at: z.string(),
});
export const UpsertMediaSchema = MediaItemSchema.partial({
    id: true,
    created_at: true,
}).extend({
    type: MediaTypeEnum,
    asset_url: AssetUrlSchema,
});
function isRecord(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function mergeMetadata(incoming, existing) {
    if (incoming === null) {
        return null;
    }
    if (typeof incoming === 'undefined') {
        return isRecord(existing) ? existing : null;
    }
    const base = isRecord(existing) ? existing : {};
    const merged = { ...base, ...incoming };
    return Object.keys(merged).length > 0 ? merged : null;
}
function buildMediaRecord(id, input, existing) {
    return {
        id,
        type: input.type,
        title: input.title ?? existing?.title ?? null,
        description: input.description ?? existing?.description ?? null,
        asset_url: input.asset_url ?? existing?.asset_url ?? '',
        metadata: mergeMetadata(input.metadata, existing?.metadata),
        order: input.order ?? existing?.order ?? null,
        created_at: existing?.created_at ?? new Date().toISOString(),
    };
}
export class MediaService {
    async listByType(type) {
        const items = await readTable(TABLE);
        const filtered = items.filter((item) => item.type === type);
        // Sort by order first (ascending), then by created_at (descending)
        filtered.sort((a, b) => {
            const orderA = a.order ?? 999999;
            const orderB = b.order ?? 999999;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return b.created_at.localeCompare(a.created_at);
        });
        return z.array(MediaItemSchema).parse(filtered);
    }
    async upsertMedia(input) {
        const payload = UpsertMediaSchema.parse(input);
        const items = await readTable(TABLE);
        if (payload.id) {
            const existing = items.find((item) => item.id === payload.id);
            if (!existing) {
                throw new Error('Media item not found');
            }
            const updated = buildMediaRecord(existing.id, payload, existing);
            const nextItems = items.map((item) => (item.id === updated.id ? updated : item));
            await writeTable(TABLE, nextItems);
            return MediaItemSchema.parse(updated);
        }
        const newId = nextId(items);
        const record = buildMediaRecord(newId, payload);
        const nextItems = [...items, record];
        await writeTable(TABLE, nextItems);
        return MediaItemSchema.parse(record);
    }
    async deleteMedia(id) {
        const items = await readTable(TABLE);
        const existing = items.find((item) => item.id === id);
        if (!existing) {
            throw new Error('Media item not found');
        }
        const filtered = items.filter((item) => item.id !== id);
        await writeTable(TABLE, filtered);
        return existing;
    }
    async reorderMedia(id, direction) {
        const items = await readTable(TABLE);
        const current = items.find((item) => item.id === id);
        if (!current) {
            throw new Error('Media item not found');
        }
        // Get all items of the same type, sorted by order
        const sameTypeItems = items
            .filter((item) => item.type === current.type)
            .sort((a, b) => {
            const orderA = a.order ?? 999999;
            const orderB = b.order ?? 999999;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return b.created_at.localeCompare(a.created_at);
        });
        const currentIndex = sameTypeItems.findIndex((item) => item.id === id);
        if (currentIndex === -1) {
            throw new Error('Media item not found in same type list');
        }
        // Check bounds
        if (direction === 'up' && currentIndex === 0) {
            return; // Already at the top
        }
        if (direction === 'down' && currentIndex === sameTypeItems.length - 1) {
            return; // Already at the bottom
        }
        // Find adjacent item to swap with
        const adjacentIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const adjacentItem = sameTypeItems[adjacentIndex];
        // Swap order values
        const currentOrder = current.order ?? (currentIndex + 1);
        const adjacentOrder = adjacentItem.order ?? (adjacentIndex + 1);
        // Update both items
        const updatedItems = items.map((item) => {
            if (item.id === current.id) {
                return { ...item, order: adjacentOrder };
            }
            if (item.id === adjacentItem.id) {
                return { ...item, order: currentOrder };
            }
            return item;
        });
        await writeTable(TABLE, updatedItems);
    }
}
//# sourceMappingURL=service.js.map