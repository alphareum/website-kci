/**
 * Optional Session Middleware
 *
 * This middleware:
 * 1. Reads session cookie from request (if exists)
 * 2. Validates the session (if cookie exists)
 * 3. Attaches session data to request.session (if valid)
 * 4. DOES NOT reject request if session is missing/invalid
 *
 * Use this for routes that are public but want to know if user is logged in.
 *
 * Usage:
 * ```typescript
 * fastify.get('/api/posts', {
 *   preHandler: optionalSession
 * }, async (request, reply) => {
 *   // request.session might be undefined
 *   if (request.session) {
 *     // User is logged in, can show drafts
 *     return allPosts;
 *   } else {
 *     // Anonymous user, show only published
 *     return publishedPosts;
 *   }
 * });
 * ```
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { validateSession } from '../lib/session.js';
import { SESSION_CONFIG } from '../lib/session.js';

/**
 * Optional session middleware
 *
 * Loads session if it exists, but doesn't reject request if missing.
 *
 * @param request - Fastify request
 * @param reply - Fastify reply
 */
export async function optionalSession(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Get session ID from cookie
  const sessionId = request.cookies[SESSION_CONFIG.COOKIE_NAME];

  // No cookie = anonymous request, but that's OK
  if (!sessionId) {
    request.session = undefined;
    return;
  }

  // Validate session
  const session = await validateSession(sessionId);

  if (!session) {
    // Invalid/expired session - clear the cookie
    reply.clearCookie(SESSION_CONFIG.COOKIE_NAME, {
      path: '/',
    });
    request.session = undefined;
    return;
  }

  // Attach valid session to request
  request.session = session;
}
