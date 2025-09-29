import { FastifyInstance } from 'fastify';
import { PostsService, UpsertPostSchema } from './service.js';

function parseIncludeDrafts(value: string | undefined) {
  if (!value) {
    return false;
  }
  return value === '1' || value.toLowerCase() === 'true';
}

export async function postsRoutes(server: FastifyInstance) {
  const service = new PostsService();

  server.get('/', async (request) => {
    const { includeDrafts } = request.query as { includeDrafts?: string };
    const posts = await service.listPosts({ includeDrafts: parseIncludeDrafts(includeDrafts) });
    return { posts };
  });

  server.get('/:slug', async (request) => {
    const { slug } = request.params as { slug: string };
    const { includeDrafts } = request.query as { includeDrafts?: string };
    const post = await service.getPostBySlug(slug, { includeDrafts: parseIncludeDrafts(includeDrafts) });
    if (!post) {
      throw server.httpErrors.notFound('Post not found');
    }
    return { post };
  });

  server.post('/', async (request) => {
    const payload = UpsertPostSchema.parse(request.body);
    const post = await service.upsertPost(payload);
    return { post };
  });

  server.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };
    await service.deletePost(Number(id));
    return { success: true };
  });
}
