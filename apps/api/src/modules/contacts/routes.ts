import { FastifyInstance } from 'fastify';
import { ContactsService, UpsertContactSchema } from './service.js';

export async function contactsRoutes(server: FastifyInstance) {
  const service = new ContactsService();

  server.get('/', async () => ({ contacts: await service.listContacts() }));

  server.post('/', async (request) => {
    const payload = UpsertContactSchema.parse(request.body);
    try {
      const contact = await service.upsertContact(payload);
      return { contact };
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact not found') {
        throw server.httpErrors.notFound(error.message);
      }
      throw error;
    }
  });

  server.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };
    const numericId = Number(id);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw server.httpErrors.badRequest('Contact id must be a positive integer');
    }
    try {
      await service.deleteContact(numericId);
    } catch (error) {
      if (error instanceof Error && error.message === 'Contact not found') {
        throw server.httpErrors.notFound(error.message);
      }
      throw error;
    }
    return { success: true };
  });
}
