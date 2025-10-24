import { PostsService, UpsertPostSchema } from './service.js';
function parseIncludeDrafts(value) {
    if (!value) {
        return false;
    }
    return value === '1' || value.toLowerCase() === 'true';
}
export async function postsRoutes(server) {
    const service = new PostsService();
    server.get('/', async (request) => {
        const { includeDrafts } = request.query;
        const posts = await service.listPosts({ includeDrafts: parseIncludeDrafts(includeDrafts) });
        return { posts };
    });
    server.get('/:slug', async (request) => {
        const { slug } = request.params;
        const { includeDrafts } = request.query;
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
        const { id } = request.params;
        await service.deletePost(Number(id));
        return { success: true };
    });
}
//# sourceMappingURL=routes.js.map