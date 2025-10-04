import multipart from '@fastify/multipart';
import type { Multipart, MultipartValue } from '@fastify/multipart';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FastifyInstance } from 'fastify';
import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import {
  UPLOADS_DIRECTORY,
  buildUploadPublicPath,
  buildUploadStorageKey,
  isWithinUploadsRoot,
  resolveUploadAbsolutePath,
} from '../../lib/uploads.js';
import type { MediaItem } from './service.js';
import { MediaService, UpsertMediaSchema } from './service.js';

function isMetadataRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMultipartFieldWithStringValue(entry: Multipart): entry is MultipartValue<string> {
  return entry.type === 'field' && typeof entry.value === 'string';
}

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
  const targetDir = path.join(UPLOADS_DIRECTORY, folder);
  await mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fileName);
  await writeFile(targetPath, buffer);
  const storageKey = buildUploadStorageKey(folder, fileName);
  const publicUrl = new URL(buildUploadPublicPath(storageKey), env.publicBaseUrl).toString();
  return {
    publicUrl,
    storageKey,
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

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(objectKey);

  const publicUrl = publicUrlData?.publicUrl;
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

    const typeField = file.fields?.type;
    const entries: Multipart[] = Array.isArray(typeField)
      ? typeField
      : typeField
        ? [typeField]
        : [];
    const typeFieldEntry = entries.find(isMultipartFieldWithStringValue);
    const fieldType = typeFieldEntry?.value ?? null;
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
            publicUrl,
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
          publicUrl,
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

  server.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };
    const numericId = Number(id);
    if (!Number.isFinite(numericId) || numericId <= 0) {
      throw server.httpErrors.badRequest('Invalid media id');
    }

    const removed = await service.deleteMedia(numericId);
    await removeStoredFile(server, removed);
    return { success: true };
  });
}

async function removeStoredFile(server: FastifyInstance, item: MediaItem) {
  const metadata = item.metadata;
  if (!isMetadataRecord(metadata)) {
    return;
  }

  const storage = metadata.upload_storage;
  const storageKey = typeof metadata.upload_storage_key === 'string' ? metadata.upload_storage_key : null;

  if (!storageKey) {
    return;
  }

  if (storage === 'local') {
    const targetPath = resolveUploadAbsolutePath(storageKey);
    if (!isWithinUploadsRoot(targetPath)) {
      server.log.warn({ storageKey }, 'Skipping removal of media file outside uploads root');
      return;
    }
    try {
      await unlink(targetPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        server.log.error({ err: error, storageKey }, 'Failed to remove local media file');
      }
    }
    return;
  }

  if (storage === 'supabase' && env.supabase) {
    try {
      const supabase = getSupabaseClient();
      const bucket = env.supabase.storageBucket ?? 'media-library';
      const { error } = await supabase.storage.from(bucket).remove([storageKey]);
      if (error) {
        server.log.error({ err: error, storageKey }, 'Failed to remove Supabase media file');
      }
    } catch (error) {
      server.log.error({ err: error, storageKey }, 'Failed to remove Supabase media file');
    }
  }
}
