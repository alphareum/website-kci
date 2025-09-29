import multipart from '@fastify/multipart';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FastifyInstance } from 'fastify';
import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import { MediaService, UpsertMediaSchema } from './service.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const appsDir = path.resolve(moduleDir, '../../../..');
const LOCAL_UPLOAD_ROOT = path.resolve(appsDir, 'web/public/uploads');

function sanitizeSegment(value?: string | null) {
  if (!value) {
    return 'media';
  }
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return normalized || 'media';
}

function buildFileName(originalName?: string) {
  const ext = originalName ? path.extname(originalName) : '';
  const safeExt = ext ? ext.toLowerCase() : '';
  return `${Date.now()}-${randomUUID()}${safeExt}`;
}

async function storeFileLocally(folder: string, fileName: string, buffer: Buffer) {
  const targetDir = path.join(LOCAL_UPLOAD_ROOT, folder);
  await mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fileName);
  await writeFile(targetPath, buffer);
  const relativePath = `${folder}/${fileName}`;
  return {
    publicUrl: `/uploads/${relativePath}`,
    storageKey: relativePath,
  };
}

async function storeFileInSupabase(folder: string, fileName: string, buffer: Buffer, mimeType?: string | null) {
  const supabase = getSupabaseClient();
  const bucket = env.supabase?.storageBucket ?? 'media-library';
  const objectKey = `${folder}/${fileName}`;

  const uploadResult = await supabase.storage.from(bucket).upload(objectKey, buffer, {
    contentType: mimeType ?? 'application/octet-stream',
    upsert: false,
  });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrlResult = supabase.storage.from(bucket).getPublicUrl(objectKey);
  if (publicUrlResult.error) {
    throw publicUrlResult.error;
  }

  const publicUrl = publicUrlResult.data.publicUrl;
  if (!publicUrl) {
    throw new Error('Failed to resolve public URL for uploaded file.');
  }

  return {
    publicUrl,
    storageKey: objectKey,
  };
}

export async function mediaRoutes(server: FastifyInstance) {
  const service = new MediaService();

  await server.register(multipart, {
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  });

  server.get('/:type', async (request) => {
    const { type } = request.params as { type: 'gallery' | 'testimonial' | 'partner' };
    const items = await service.listByType(type);
    return { items };
  });

  server.post('/upload', async (request) => {
    const file = await request.file();

    if (!file) {
      throw server.httpErrors.badRequest('No file uploaded');
    }

    const buffer = await file.toBuffer();
    if (buffer.length === 0) {
      throw server.httpErrors.badRequest('Uploaded file is empty');
    }

    const fieldType = typeof file.fields?.type?.value === 'string' ? file.fields?.type?.value : null;
    const folder = sanitizeSegment(fieldType);
    const fileName = buildFileName(file.filename);
    const baseMetadata = {
      originalName: file.filename,
      mimeType: file.mimetype,
      size: buffer.length,
      folder,
    };

    try {
      if (env.supabase) {
        const { publicUrl, storageKey } = await storeFileInSupabase(folder, fileName, buffer, file.mimetype);
        return {
          url: publicUrl,
          metadata: {
            ...baseMetadata,
            storage: 'supabase' as const,
            storageKey,
          },
        };
      }

      const { publicUrl, storageKey } = await storeFileLocally(folder, fileName, buffer);
      return {
        url: publicUrl,
        metadata: {
          ...baseMetadata,
          storage: 'local' as const,
          storageKey,
        },
      };
    } catch (error) {
      request.log.error({ err: error }, 'Failed to store media upload');
      throw server.httpErrors.internalServerError('Failed to store uploaded file');
    }
  });

  server.post('/', async (request) => {
    const payload = UpsertMediaSchema.parse(request.body);
    const item = await service.upsertMedia(payload);
    return { item };
  });
}
