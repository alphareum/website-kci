import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { env } from '../config/env.js';
import { registerRoutes } from '../routes/index.js';

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
  });

  await server.register(registerRoutes, { prefix: '/api' });

  server.get('/healthz', async () => ({ status: 'ok' }));

  return server;
}
