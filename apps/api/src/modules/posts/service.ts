import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';

const TABLE = 'posts';

export const PostSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullable(),
  body: z.string(),
  cover_image_url: z.string().url().nullable(),
  published_at: z.string().datetime().nullable(),
  is_published: z.boolean(),
});

export type PostRecord = z.infer<typeof PostSchema>;

export const UpsertPostSchema = PostSchema.partial({
  id: true,
  is_published: true,
}).extend({
  title: z.string().min(1),
  slug: z.string().min(1),
  body: z.string().min(1),
});

export type UpsertPostInput = z.infer<typeof UpsertPostSchema>;

function normalizePublishedAt(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  try {
    return new Date(value).toISOString();
  } catch (error) {
    return null;
  }
}

function buildPostRecord(id: number, input: UpsertPostInput, existing?: PostRecord): PostRecord {
  return {
    id,
    title: input.title ?? existing?.title ?? '',
    slug: input.slug ?? existing?.slug ?? '',
    summary: input.summary ?? existing?.summary ?? null,
    body: input.body ?? existing?.body ?? '',
    cover_image_url: input.cover_image_url ?? existing?.cover_image_url ?? null,
    published_at:
      normalizePublishedAt(input.published_at) ?? existing?.published_at ?? null,
    is_published: input.is_published ?? existing?.is_published ?? false,
  };
}

function sortPosts(posts: PostRecord[]) {
  return [...posts].sort((a, b) => {
    const aDate = a.published_at ?? '';
    const bDate = b.published_at ?? '';

    if (aDate && bDate) {
      return bDate.localeCompare(aDate);
    }
    if (aDate) {
      return -1;
    }
    if (bDate) {
      return 1;
    }
    return a.title.localeCompare(b.title);
  });
}

interface ListPostsOptions {
  includeDrafts?: boolean;
}

interface GetPostOptions {
  includeDrafts?: boolean;
}

export class PostsService {
  async listPosts(options: ListPostsOptions = {}) {
    const posts = await readTable<PostRecord>(TABLE);
    const filtered = options.includeDrafts
      ? posts
      : posts.filter((post) => post.is_published);
    const sorted = sortPosts(filtered);
    return z.array(PostSchema).parse(sorted);
  }

  async getPostBySlug(slug: string, options: GetPostOptions = {}) {
    const posts = await readTable<PostRecord>(TABLE);
    const post = posts.find((item) => item.slug === slug);
    if (!post) {
      return null;
    }
    if (!options.includeDrafts && !post.is_published) {
      return null;
    }
    return PostSchema.parse(post);
  }

  async upsertPost(input: UpsertPostInput) {
    const payload = UpsertPostSchema.parse(input);
    const posts = await readTable<PostRecord>(TABLE);

    if (payload.id) {
      const existing = posts.find((post) => post.id === payload.id);
      if (!existing) {
        throw new Error('Post not found');
      }
      const updated = buildPostRecord(existing.id, payload, existing);
      const nextPosts = posts.map((post) => (post.id === updated.id ? updated : post));
      await writeTable(TABLE, nextPosts);
      return PostSchema.parse(updated);
    }

    const newId = nextId(posts);
    const record = buildPostRecord(newId, payload);
    const nextPosts = [...posts, record];
    await writeTable(TABLE, nextPosts);
    return PostSchema.parse(record);
  }

  async deletePost(id: number) {
    const posts = await readTable<PostRecord>(TABLE);
    const filtered = posts.filter((post) => post.id !== id);
    if (filtered.length === posts.length) {
      throw new Error('Post not found');
    }
    await writeTable(TABLE, filtered);
  }
}
