import { FastifyInstance } from 'fastify';
import { LinksService, UpsertLinkSchema } from './service.js';

export async function linksRoutes(server: FastifyInstance) {
  const service = new LinksService();

  server.get('/', async () => {
    const links = await service.listLinks();
    return { links };
  });

  server.post('/', async (request) => {
    const payload = UpsertLinkSchema.parse(request.body);
    const link = await service.upsertLink(payload);
    return { link };
  });

  server.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };
    await service.deleteLink(Number(id));
    return { success: true };
  });
}
