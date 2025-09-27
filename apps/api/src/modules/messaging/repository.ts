import { ResultSetHeader } from 'mysql2/promise';
import { env } from '../../config/env.js';
import { getSupabaseClient } from '../../lib/supabase.js';
import { getLegacyPool } from '../../lib/mysql.js';
import { MessageRecord, MessageSchema, CreateMessageInput, CreateMessageSchema } from './schema.js';

export interface MessagingRepository {
  listMessages(): Promise<MessageRecord[]>;
  createMessage(input: CreateMessageInput): Promise<MessageRecord>;
}

class SupabaseMessagingRepository implements MessagingRepository {
  private client = getSupabaseClient();

  async listMessages(): Promise<MessageRecord[]> {
    const { data, error } = await this.client
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data ? data.map((row: any) => MessageSchema.parse(row)) : [];
  }

  async createMessage(input: CreateMessageInput): Promise<MessageRecord> {
    const payload = CreateMessageSchema.parse(input);

    const { data, error } = await this.client
      .from('messages')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return MessageSchema.parse(data);
  }
}

class LegacyMessagingRepository implements MessagingRepository {
  private pool = getLegacyPool();

  private mapRow(row: any): MessageRecord {
    return MessageSchema.parse({
      id: Number(row.id),
      sender_name: row.nama ?? row.sender_name ?? '',
      sender_email: row.email ?? row.sender_email ?? '',
      subject: row.subject ?? row.subjek ?? null,
      body: row.pesan ?? row.body ?? '',
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      status: row.status ?? 'new',
    });
  }

  async listMessages(): Promise<MessageRecord[]> {
    const [rows] = await this.pool.query(
      `SELECT id, nama, email, subject, pesan, status, created_at FROM kontak ORDER BY created_at DESC`
    );

    return Array.isArray(rows) ? rows.map((row: any) => this.mapRow(row)) : [];
  }

  async createMessage(input: CreateMessageInput): Promise<MessageRecord> {
    const payload = CreateMessageSchema.parse(input);

    const [result] = await this.pool.query<ResultSetHeader>(
      `INSERT INTO kontak (nama, email, subject, pesan, status, created_at)
       VALUES (?, ?, ?, ?, 'new', NOW())`
      [payload.sender_name, payload.sender_email, payload.subject ?? null, payload.body]
    );

    const insertId = (result as ResultSetHeader).insertId;
    const [rows] = await this.pool.query(`SELECT id, nama, email, subject, pesan, status, created_at FROM kontak WHERE id = ?`, [
      insertId,
    ]);
    const row = Array.isArray(rows) ? rows[0] : null;

    if (!row) {
      throw new Error('MESSAGE_NOT_FOUND');
    }

    return this.mapRow(row);
  }
}

export function resolveMessagingRepositories(): {
  primary: MessagingRepository;
  fallback?: MessagingRepository;
} {
  if (env.dataBackend === 'mysql') {
    return { primary: new LegacyMessagingRepository() };
  }

  if (env.dataBackend === 'hybrid') {
    return {
      primary: new SupabaseMessagingRepository(),
      fallback: new LegacyMessagingRepository(),
    };
  }

  return { primary: new SupabaseMessagingRepository() };
}
