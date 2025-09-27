import { FastifyInstance } from 'fastify';
import { EventsService, UpsertEventSchema } from './service.js';

export async function eventsRoutes(server: FastifyInstance) {
  const service = new EventsService();

  server.get('/', async () => ({ events: await service.listPublished() }));

  server.post('/', async (request) => {
    const payload = UpsertEventSchema.parse(request.body);
    const event = await service.upsertEvent(payload);
    return { event };
  });
}
