import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { env } from '../config/env.js';
import { registerRoutes } from '../routes/index.js';

const uploadsPath = path.join(env.storage.dataDir, 'uploads');

export async function buildServer() {
  const server = Fastify({
    logger: {
      level: env.nodeEnv === 'development' ? 'debug' : 'info',
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

  await server.register(registerRoutes, { prefix: '/api' });

  server.get('/api', async () => ({
    status: 'ok',
    message: 'Use /api/<module> to access CMS resources such as /api/media or /api/events.',
  }));

  return server;
}
