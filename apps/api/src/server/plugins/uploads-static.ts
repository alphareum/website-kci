import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import {
  UPLOADS_PUBLIC_PREFIX,
  isWithinUploadsRoot,
  resolveUploadAbsolutePath,
} from '../../lib/uploads.js';

const MIME_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function resolveContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}

export async function registerUploadsStatic(server: FastifyInstance) {
  server.get(`${UPLOADS_PUBLIC_PREFIX}/*`, async (request, reply) => {
    const params = request.params as { '*': string };
    const requested = (params['*'] ?? '').replace(/^[\\/]+/, '');

    if (!requested) {
      reply.callNotFound();
      return;
    }

    const filePath = resolveUploadAbsolutePath(requested);

    if (!isWithinUploadsRoot(filePath)) {
      reply.callNotFound();
      return;
    }

    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        reply.callNotFound();
        return;
      }

      reply.header('Content-Type', resolveContentType(filePath));
      reply.header('Content-Length', fileStat.size.toString());
      reply.header('Cache-Control', 'public, max-age=31536000, immutable');
      reply.header('Last-Modified', fileStat.mtime.toUTCString());
      reply.header('Accept-Ranges', 'bytes');

      return reply.send(createReadStream(filePath));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        reply.callNotFound();
        return;
      }
      request.log.error({ err: error, filePath }, 'Failed to stream uploaded media');
      throw request.server.httpErrors.internalServerError('Unable to serve uploaded file');
    }
  });
}
