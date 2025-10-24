import multipart from '@fastify/multipart';
import type { Multipart, MultipartValue, MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FastifyInstance } from 'fastify';
import { fileTypeFromBuffer } from 'file-type';
import { requireSession } from '../../middleware/require-session.js';
import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import type { MediaItem } from './service.js';
import { MediaService, UpsertMediaSchema } from './service.js';

const LOCAL_UPLOAD_ROOT = path.join(env.storage.dataDir, 'uploads');

// File upload validation configuration
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SVG_DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i, // Event handlers like onclick=, onload=, etc.
  /<iframe/i,
  /<embed/i,
  /<object/i,
];

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

/**
 * Validates uploaded files to prevent security vulnerabilities
 *
 * Security checks:
 * 1. File size limit (10MB max)
 * 2. MIME type whitelist
 * 3. Magic bytes validation (prevents MIME type spoofing)
 * 4. SVG content validation (prevents XSS attacks)
 * 5. File extension validation
 *
 * @throws Error if validation fails
 */
async function validateUpload(file: MultipartFile, buffer: Buffer): Promise<void> {
  // 1. Check file size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB, ` +
      `but file is ${(buffer.length / 1024 / 1024).toFixed(2)}MB`
    );
  }

  // 2. Validate MIME type from client
  if (!Object.keys(ALLOWED_MIME_TYPES).includes(file.mimetype)) {
    throw new Error(
      `File type '${file.mimetype}' not allowed. ` +
      `Allowed types: ${Object.keys(ALLOWED_MIME_TYPES).join(', ')}`
    );
  }

  // 3. Validate magic bytes (actual file content) to prevent MIME type spoofing
  const detectedType = await fileTypeFromBuffer(buffer);

  // Special handling for SVG (text-based format, file-type can't detect)
  if (file.mimetype === 'image/svg+xml') {
    const content = buffer.toString('utf-8');

    // Check if it's actually an SVG
    if (!content.trim().startsWith('<svg') && !content.includes('<svg')) {
      throw new Error('File is not a valid SVG (missing <svg> tag)');
    }

    // Check for dangerous patterns (XSS attacks)
    for (const pattern of SVG_DANGEROUS_PATTERNS) {
      if (pattern.test(content)) {
        throw new Error(
          'SVG contains potentially dangerous content (scripts, event handlers, or embedded objects). ' +
          'Please remove all JavaScript and event handlers from the SVG file.'
        );
      }
    }
  } else {
    // For binary images, verify magic bytes match MIME type
    if (!detectedType) {
      throw new Error(
        'Could not detect file type from content. ' +
        'File may be corrupted or is not a valid image.'
      );
    }

    if (!Object.keys(ALLOWED_MIME_TYPES).includes(detectedType.mime)) {
      throw new Error(
        `File content type '${detectedType.mime}' not allowed. ` +
        `This may be a disguised file (fake extension).`
      );
    }

    if (detectedType.mime !== file.mimetype) {
      throw new Error(
        `File content (${detectedType.mime}) does not match declared type (${file.mimetype}). ` +
        `This may be a file with a fake extension.`
      );
    }
  }

  // 4. Validate file extension
  const ext = path.extname(file.filename).toLowerCase();
  const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];

  if (!allowedExtensions || !allowedExtensions.includes(ext)) {
    throw new Error(
      `File extension '${ext}' not allowed for MIME type '${file.mimetype}'. ` +
      `Allowed extensions: ${allowedExtensions?.join(', ') || 'none'}`
    );
  }
}

async function storeFileLocally(folder: string, fileName: string, buffer: Buffer) {
  const targetDir = path.join(LOCAL_UPLOAD_ROOT, folder);
  await mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, fileName);
  await writeFile(targetPath, buffer);
  const relativePath = `${folder}/${fileName}`;
  const publicUrl = env.publicBaseUrl
    ? `${env.publicBaseUrl}/uploads/${relativePath}`
    : `/uploads/${relativePath}`;
  return {
    publicUrl,
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

  server.post('/upload', { preHandler: requireSession }, async (request) => {
    const file = await request.file();

    if (!file) {
      throw server.httpErrors.badRequest('No file uploaded');
    }

    const buffer = await file.toBuffer();
    if (buffer.length === 0) {
      throw server.httpErrors.badRequest('Uploaded file is empty');
    }

    // Validate upload for security (file type, size, content)
    try {
      await validateUpload(file, buffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'File validation failed';
      throw server.httpErrors.badRequest(message);
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

  server.post('/', { preHandler: requireSession }, async (request) => {
    const payload = UpsertMediaSchema.parse(request.body);
    const item = await service.upsertMedia(payload);
    return { item };
  });

  server.delete('/:id', { preHandler: requireSession }, async (request) => {
    const { id } = request.params as { id: string };
    const numericId = Number(id);
    if (!Number.isFinite(numericId) || numericId <= 0) {
      throw server.httpErrors.badRequest('Invalid media id');
    }

    const removed = await service.deleteMedia(numericId);
    await removeStoredFile(server, removed);
    return { success: true };
  });

  server.patch('/:id/reorder', { preHandler: requireSession }, async (request) => {
    const { id } = request.params as { id: string };
    const { direction } = request.body as { direction: 'up' | 'down' };

    const numericId = Number(id);
    if (!Number.isFinite(numericId) || numericId <= 0) {
      throw server.httpErrors.badRequest('Invalid media id');
    }

    if (direction !== 'up' && direction !== 'down') {
      throw server.httpErrors.badRequest('Direction must be "up" or "down"');
    }

    await service.reorderMedia(numericId, direction);
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
    const targetPath = path.join(LOCAL_UPLOAD_ROOT, storageKey);
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
