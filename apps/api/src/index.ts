import { buildServer } from './server/server.js';
import { env } from './config/env.js';

async function start() {
  const server = await buildServer();
  try {
    await server.listen({ port: env.server.port, host: env.server.host });
    server.log.info(`API server listening on http://${env.server.host}:${env.server.port}`);
  } catch (error) {
    server.log.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
