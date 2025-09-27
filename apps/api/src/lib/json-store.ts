import { promises as fs } from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';

async function ensureDirectory(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function resolveTablePath(tableName: string) {
  return path.join(env.storage.dataDir, `${tableName}.json`);
}

export async function readTable<T>(tableName: string, fallback: T[] = []): Promise<T[]> {
  const filePath = resolveTablePath(tableName);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await ensureDirectory(filePath);
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    throw error;
  }
}

export async function writeTable<T>(tableName: string, rows: T[]): Promise<void> {
  const filePath = resolveTablePath(tableName);
  await ensureDirectory(filePath);
  await fs.writeFile(filePath, JSON.stringify(rows, null, 2));
}

export function nextId(records: Array<{ id: number }>): number {
  return records.reduce((max, record) => (record.id > max ? record.id : max), 0) + 1;
}
