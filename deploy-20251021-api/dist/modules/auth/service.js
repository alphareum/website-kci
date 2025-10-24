import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { nextId, readTable, writeTable } from '../../lib/json-store.js';
const AdminSchema = z.object({
    id: z.number().int().positive(),
    email: z.string().email(),
    full_name: z.string(),
    role: z.enum(['owner', 'editor', 'contributor']).default('editor'),
    password_hash: z.string(),
    last_login_at: z.string().nullable(),
});
const PublicAdminSchema = AdminSchema.omit({ password_hash: true });
export const CredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
const ADMIN_TABLE = 'admins';
const KEY_LENGTH = 64;
export class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid credentials');
        this.name = 'InvalidCredentialsError';
    }
}
export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
    const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return `${salt}:${hash}`;
}
export function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash)
        return false;
    const derived = scryptSync(password, salt, KEY_LENGTH);
    const hashBuffer = Buffer.from(hash, 'hex');
    if (hashBuffer.length !== derived.length)
        return false;
    return timingSafeEqual(hashBuffer, derived);
}
export class AuthService {
    async listAdmins() {
        const admins = await readTable(ADMIN_TABLE);
        return admins.map((admin) => PublicAdminSchema.parse(admin));
    }
    async createAdmin(payload) {
        const admins = await readTable(ADMIN_TABLE);
        const record = {
            id: nextId(admins),
            email: payload.email.toLowerCase(),
            full_name: payload.full_name,
            role: payload.role,
            password_hash: hashPassword(payload.password),
            last_login_at: null,
        };
        admins.push(record);
        await writeTable(ADMIN_TABLE, admins);
        return PublicAdminSchema.parse(record);
    }
    async verifyCredentials(input) {
        const payload = CredentialsSchema.parse(input);
        const admins = await readTable(ADMIN_TABLE);
        const admin = admins.find((item) => item.email.toLowerCase() === payload.email.toLowerCase());
        if (!admin) {
            throw new InvalidCredentialsError();
        }
        if (!verifyPassword(payload.password, admin.password_hash)) {
            throw new InvalidCredentialsError();
        }
        const updated = {
            ...admin,
            last_login_at: new Date().toISOString(),
        };
        const nextAdmins = admins.map((item) => (item.id === updated.id ? updated : item));
        await writeTable(ADMIN_TABLE, nextAdmins);
        return PublicAdminSchema.parse(updated);
    }
}
//# sourceMappingURL=service.js.map