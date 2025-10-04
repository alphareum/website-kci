import path from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.resolve(moduleDir, '..', '..');

export const UPLOADS_PUBLIC_PREFIX = '/uploads';
export const UPLOADS_DIRECTORY = path.resolve(apiDir, 'uploads');

export function buildUploadStorageKey(folder: string, fileName: string) {
  return path.posix.join(folder, fileName);
}

export function buildUploadPublicPath(storageKey: string) {
  const normalized = storageKey.replace(/\\/g, '/').replace(/^\/+/g, '');
  return `${UPLOADS_PUBLIC_PREFIX}/${normalized}`;
}

export function resolveUploadAbsolutePath(storageKey: string) {
  return path.resolve(UPLOADS_DIRECTORY, storageKey);
}

export function isWithinUploadsRoot(targetPath: string) {
  const relative = path.relative(UPLOADS_DIRECTORY, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
