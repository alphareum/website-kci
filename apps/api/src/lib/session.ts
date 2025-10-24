/**
 * Session Management Utilities
 *
 * Provides high-level session operations:
 * - Create session (generate session ID, set expiration)
 * - Validate session (check if valid and not expired)
 * - Destroy session (logout)
 */

import { randomBytes } from 'node:crypto';
import type { SessionData, SessionCreateInput } from '../types/session.js';
import { saveSession, getSession, deleteSession, touchSession } from './session-store.js';

/**
 * Session configuration
 */
const SESSION_CONFIG = {
  // 7 days in milliseconds
  MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  // Session ID length (bytes)
  ID_LENGTH: 32,

  // Cookie name
  COOKIE_NAME: 'kci_session',
} as const;

export { SESSION_CONFIG };

/**
 * Generate a cryptographically secure session ID
 */
function generateSessionId(): string {
  return randomBytes(SESSION_CONFIG.ID_LENGTH).toString('hex');
}

/**
 * Create a new session
 *
 * @param input - User information to store in session
 * @returns SessionData with generated sessionId and expiration
 */
export async function createSession(input: SessionCreateInput): Promise<SessionData> {
  const now = Date.now();

  const sessionData: SessionData = {
    sessionId: generateSessionId(),
    userId: input.userId,
    email: input.email,
    role: input.role,
    createdAt: now,
    expiresAt: now + SESSION_CONFIG.MAX_AGE,
    lastAccessedAt: now,
  };

  await saveSession(sessionData);
  return sessionData;
}

/**
 * Validate session by session ID
 *
 * @param sessionId - Session ID from cookie
 * @returns SessionData if valid, null if invalid/expired
 */
export async function validateSession(sessionId: string): Promise<SessionData | null> {
  if (!sessionId || sessionId.length === 0) {
    return null;
  }

  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  // Check expiration (double-check, getSession already does this)
  if (session.expiresAt < Date.now()) {
    await deleteSession(sessionId);
    return null;
  }

  // Update last accessed time (async, don't wait)
  touchSession(sessionId).catch((error) => {
    console.error('Failed to touch session:', error);
  });

  return session;
}

/**
 * Destroy session (logout)
 *
 * @param sessionId - Session ID to destroy
 */
export async function destroySession(sessionId: string): Promise<void> {
  await deleteSession(sessionId);
}

/**
 * Refresh session expiration (extend session life)
 *
 * @param sessionId - Session ID to refresh
 * @returns Updated SessionData, or null if session doesn't exist
 */
export async function refreshSession(sessionId: string): Promise<SessionData | null> {
  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  // Extend expiration by MAX_AGE from now
  session.expiresAt = Date.now() + SESSION_CONFIG.MAX_AGE;
  session.lastAccessedAt = Date.now();

  await saveSession(session);
  return session;
}
