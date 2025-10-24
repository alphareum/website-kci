import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { env } from '../config/env.js';
import { registerRoutes } from '../routes/index.js';
import { sitemapRoutes } from '../modules/sitemap/routes.js';
import { cleanupExpiredSessions } from '../lib/session-store.js';

const uploadsPath = path.resolve(env.storage.dataDir, 'uploads');

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: env.nodeEnv === 'development' ? 'debug' : 'info',
    },
  });

  // Register cookie plugin for session management
  await server.register(cookie, {
    secret: env.nodeEnv === 'production'
      ? process.env.COOKIE_SECRET || 'kci-cookie-secret-change-in-production'
      : 'dev-cookie-secret',
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
      path: '/',
    },
  });

  await server.register(sensible);
  await server.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Serve uploaded files from /uploads route
  await server.register(fastifyStatic, {
    root: uploadsPath,
    prefix: '/uploads/',
    decorateReply: false,
  });

  server.get('/', async () => ({
    name: 'KCI CMS API',
    status: 'online',
    documentation: 'All endpoints are available beneath the /api prefix.',
    healthcheck: '/healthz',
    apiBase: '/api',
  }));

  server.get('/healthz', async () => ({ status: 'ok' }));

  // Register sitemap route (must be before /api prefix)
  await server.register(sitemapRoutes);

  await server.register(registerRoutes, { prefix: '/api' });

  server.get('/api', async () => ({
    status: 'ok',
    message: 'Use /api/<module> to access CMS resources such as /api/media or /api/events.',
  }));

  // Cleanup expired sessions on startup
  server.addHook('onReady', async () => {
    try {
      const count = await cleanupExpiredSessions();
      server.log.info({ cleanedSessions: count }, 'Cleaned up expired sessions on startup');
    } catch (error) {
      server.log.error({ error }, 'Failed to cleanup expired sessions on startup');
    }
  });

  return server;
}
