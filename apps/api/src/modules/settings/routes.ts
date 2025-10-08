import { FastifyInstance } from 'fastify';
import { SettingsService, UpdateSettingsSchema } from './service.js';

export async function settingsRoutes(server: FastifyInstance) {
  const service = new SettingsService();

  // GET /api/settings - Get current site settings
  server.get('/', async () => {
    const settings = await service.getSettings();
    return { settings };
  });

  // POST /api/settings - Update site settings
  server.post('/', async (request) => {
    const payload = UpdateSettingsSchema.parse(request.body);
    const settings = await service.updateSettings(payload);
    return { settings };
  });
}
