import { promises as fs } from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';
async function ensureDirectory(filePath) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
}
function resolveTablePath(tableName) {
    return path.join(env.storage.dataDir, `${tableName}.json`);
}
export async function readTable(tableName, fallback = []) {
    const filePath = resolveTablePath(tableName);
    try {
        const raw = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(raw);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            await ensureDirectory(filePath);
            await fs.writeFile(filePath, JSON.stringify(fallback, null, 2));
            return fallback;
        }
        throw error;
    }
}
export async function writeTable(tableName, rows) {
    const filePath = resolveTablePath(tableName);
    await ensureDirectory(filePath);
    await fs.writeFile(filePath, JSON.stringify(rows, null, 2));
}
export function nextId(records) {
    return records.reduce((max, record) => (record.id > max ? record.id : max), 0) + 1;
}
//# sourceMappingURL=json-store.js.map