import { FastifyInstance } from 'fastify';
import { AuthService, CredentialsSchema } from './service.js';

export async function authRoutes(server: FastifyInstance) {
  const service = new AuthService();

  server.get('/', async () => {
    return { admins: await service.listAdmins() };
  });

  server.post('/login', async (request) => {
    const credentials = CredentialsSchema.parse(request.body);
    const session = await service.verifyCredentials(credentials);
    return { session };
  });
}
