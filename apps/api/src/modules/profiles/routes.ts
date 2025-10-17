import { FastifyInstance } from 'fastify';
import {
  getAllProfiles,
  getProfileBySlug,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  UpsertProfileInputSchema,
} from './service.js';

export async function profilesRoutes(fastify: FastifyInstance) {
  // GET /api/profiles - Get all profiles
  fastify.get('/profiles', async (request, reply) => {
    try {
      const profiles = await getAllProfiles();
      return reply.send({ profiles });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch profiles' });
    }
  });

  // GET /api/profiles/:slugOrId - Get profile by slug or ID
  fastify.get('/profiles/:slugOrId', async (request, reply) => {
    try {
      const { slugOrId } = request.params as { slugOrId: string };

      // Try to get by ID first (if it's a number)
      const numId = parseInt(slugOrId, 10);
      if (!isNaN(numId)) {
        const profile = await getProfileById(numId);
        if (profile) {
          return reply.send({ profile });
        }
      }

      // Try to get by slug
      const profile = await getProfileBySlug(slugOrId);
      if (!profile) {
        return reply.status(404).send({ error: 'Profile not found' });
      }

      return reply.send({ profile });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch profile' });
    }
  });

  // POST /api/admin/profiles - Create or update profile (UPSERT logic)
  // CMS sends ID in body when editing, so we check for it
  fastify.post('/admin/profiles', async (request, reply) => {
    try {
      const body = request.body as any;

      // Check if this is an update (id provided in body)
      if (body.id !== undefined && body.id !== null) {
        const numId = parseInt(body.id, 10);
        if (isNaN(numId)) {
          return reply.status(400).send({ error: 'Invalid profile ID' });
        }

        // Extract input without the id field (API expects it without id)
        const { id, ...inputWithoutId } = body;
        const input = UpsertProfileInputSchema.parse(inputWithoutId);

        // Update existing profile
        const profile = await updateProfile(numId, input);
        return reply.send({ profile });
      }

      // Create new profile
      const input = UpsertProfileInputSchema.parse(body);
      const profile = await createProfile(input);
      return reply.status(201).send({ profile });
    } catch (error: any) {
      fastify.log.error(error);
      if (error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      if (error.message.includes('not found')) {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(500).send({ error: error.message || 'Failed to save profile' });
    }
  });

  // PUT /api/admin/profiles/:id - Update profile (admin only)
  fastify.put('/admin/profiles/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const numId = parseInt(id, 10);

      if (isNaN(numId)) {
        return reply.status(400).send({ error: 'Invalid profile ID' });
      }

      const input = UpsertProfileInputSchema.parse(request.body);
      const profile = await updateProfile(numId, input);
      return reply.send({ profile });
    } catch (error: any) {
      fastify.log.error(error);
      if (error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Invalid input', details: error.errors });
      }
      if (error.message.includes('not found')) {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(500).send({ error: error.message || 'Failed to update profile' });
    }
  });

  // DELETE /api/admin/profiles/:id - Delete profile (admin only)
  fastify.delete('/admin/profiles/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const numId = parseInt(id, 10);

      if (isNaN(numId)) {
        return reply.status(400).send({ error: 'Invalid profile ID' });
      }

      await deleteProfile(numId);
      return reply.send({ success: true });
    } catch (error: any) {
      fastify.log.error(error);
      if (error.message.includes('not found')) {
        return reply.status(404).send({ error: error.message });
      }
      return reply.status(500).send({ error: 'Failed to delete profile' });
    }
  });
}
