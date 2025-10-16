import { FastifyInstance } from 'fastify';
import { authRoutes } from '../modules/auth/routes.js';
import { eventsRoutes } from '../modules/events/routes.js';
import { contactsRoutes } from '../modules/contacts/routes.js';
import { mediaRoutes } from '../modules/media/routes.js';
import { messagingRoutes } from '../modules/messaging/routes.js';
import { linksRoutes } from '../modules/links/routes.js';
import { postsRoutes } from '../modules/posts/routes.js';
import { settingsRoutes } from '../modules/settings/routes.js';
import { profilesRoutes } from '../modules/profiles/routes.js';
import { organizationRoutes } from '../modules/organization/routes.js';

export async function registerRoutes(server: FastifyInstance) {
  await server.register(authRoutes, { prefix: '/auth' });
  await server.register(eventsRoutes, { prefix: '/events' });
  await server.register(contactsRoutes, { prefix: '/contacts' });
  await server.register(mediaRoutes, { prefix: '/media' });
  await server.register(messagingRoutes, { prefix: '/messaging' });
  await server.register(linksRoutes, { prefix: '/links' });
  await server.register(postsRoutes, { prefix: '/posts' });
  await server.register(settingsRoutes, { prefix: '/settings' });
  await server.register(profilesRoutes);
  await server.register(organizationRoutes);
}
