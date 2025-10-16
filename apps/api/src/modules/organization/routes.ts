import { FastifyInstance } from 'fastify';
import { OrganizationService } from './service.js';

export async function organizationRoutes(server: FastifyInstance) {
  const service = new OrganizationService();

  /**
   * GET /api/organization
   * Public endpoint - fetches organizational structure
   */
  server.get('/', async () => {
    const organization = await service.getOrganization();
    return { organization };
  });

  /**
   * POST /api/organization
   * Admin-only endpoint - updates organizational structure
   * Request body should match OrganizationSchema
   */
  server.post('/', async (request) => {
    const organization = await service.updateOrganization(request.body);
    return { organization };
  });
}
