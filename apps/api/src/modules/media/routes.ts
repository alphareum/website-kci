import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { MediaService } from './service.js';
import { MediaTypeEnum, UpsertMediaSchema } from './schema.js';

export async function mediaRoutes(server: FastifyInstance) {
  const service = new MediaService();
  const typeParamsSchema = z.object({ type: MediaTypeEnum });

  server.get('/:type', async (request) => {
    const { type } = typeParamsSchema.parse(request.params);
    const items = await service.listByType(type);
    return { items };
  });

  server.post('/', async (request) => {
    const payload = UpsertMediaSchema.parse(request.body);
    const item = await service.upsertMedia(payload);
    return { item };
  });
}
