/**
 * File-based Session Storage
 *
 * Stores sessions as individual JSON files in /kci-data/sessions/
 * Each session is stored as: {sessionId}.json
 *
 * Why file-based?
 * - No Redis dependency needed
 * - Works with current hosting setup
 * - Easy to migrate to Redis later
 * - Consistent with current data storage pattern
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';
import type { SessionData } from '../types/session.js';

const SESSIONS_DIR = path.join(env.storage.dataDir, 'sessions');

/**
 * Ensure sessions directory exists
 */
async function ensureSessionsDir(): Promise<void> {
  try {
    await fs.access(SESSIONS_DIR);
  } catch {
    await fs.mkdir(SESSIONS_DIR, { recursive: true });
  }
}

/**
 * Get session file path
 */
function getSessionPath(sessionId: string): string {
  // Sanitize sessionId to prevent path traversal
  const sanitized = sessionId.replace(/[^a-zA-Z0-9-]/g, '');
  return path.join(SESSIONS_DIR, `${sanitized}.json`);
}

/**
 * Save session to file
 */
export async function saveSession(sessionData: SessionData): Promise<void> {
  await ensureSessionsDir();
  const filePath = getSessionPath(sessionData.sessionId);
  await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2), 'utf-8');
}

/**
 * Get session from file
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  try {
    const filePath = getSessionPath(sessionId);
    const raw = await fs.readFile(filePath, 'utf-8');
    const sessionData = JSON.parse(raw) as SessionData;

    // Check if session has expired
    if (sessionData.expiresAt < Date.now()) {
      // Expired - delete and return null
      await deleteSession(sessionId);
      return null;
    }

    return sessionData;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Session file doesn't exist
      return null;
    }
    throw error;
  }
}

/**
 * Delete session file
 */
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const filePath = getSessionPath(sessionId);
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore if file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Update session's last accessed time
 */
export async function touchSession(sessionId: string): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) {
    return;
  }

  session.lastAccessedAt = Date.now();
  await saveSession(session);
}

/**
 * Clean up expired sessions
 * This should be called periodically (e.g., on server startup, or via cron)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  await ensureSessionsDir();

  let cleanedCount = 0;
  const files = await fs.readdir(SESSIONS_DIR);

  for (const file of files) {
    if (!file.endsWith('.json')) {
      continue;
    }

    try {
      const filePath = path.join(SESSIONS_DIR, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const session = JSON.parse(raw) as SessionData;

      if (session.expiresAt < Date.now()) {
        await fs.unlink(filePath);
        cleanedCount++;
      }
    } catch (error) {
      // Ignore errors for individual files
      console.error(`Error cleaning session file ${file}:`, error);
    }
  }

  return cleanedCount;
}

/**
 * Get all active sessions (for debugging/admin purposes)
 */
export async function getAllSessions(): Promise<SessionData[]> {
  await ensureSessionsDir();

  const sessions: SessionData[] = [];
  const files = await fs.readdir(SESSIONS_DIR);

  for (const file of files) {
    if (!file.endsWith('.json')) {
      continue;
    }

    try {
      const filePath = path.join(SESSIONS_DIR, file);
      const raw = await fs.readFile(filePath, 'utf-8');
      const session = JSON.parse(raw) as SessionData;

      // Only include non-expired sessions
      if (session.expiresAt >= Date.now()) {
        sessions.push(session);
      }
    } catch (error) {
      // Ignore errors for individual files
      console.error(`Error reading session file ${file}:`, error);
    }
  }

  return sessions;
}
