import { FastifyInstance } from 'fastify';
import { MediaService, UpsertMediaSchema } from './service.js';

export async function mediaRoutes(server: FastifyInstance) {
  const service = new MediaService();

  server.get('/:type', async (request) => {
    const { type } = request.params as { type: 'gallery' | 'testimonial' | 'partner' };
    const items = await service.listByType(type);
    return { items };
  });

  server.post('/', async (request) => {
    const payload = UpsertMediaSchema.parse(request.body);
    const item = await service.upsertMedia(payload);
    return { item };
  });
}
