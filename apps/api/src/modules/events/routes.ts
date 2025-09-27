import { FastifyInstance } from 'fastify';
import { EventsService } from './service.js';
import { UpsertEventSchema } from './schema.js';

export async function eventsRoutes(server: FastifyInstance) {
  const service = new EventsService();

  server.get('/', async () => ({ events: await service.listPublished() }));

  server.post('/', async (request) => {
    const payload = UpsertEventSchema.parse(request.body);
    const event = await service.upsertEvent(payload);
    return { event };
  });
}
