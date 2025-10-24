/**
 * Session Validation Middleware
 *
 * This middleware:
 * 1. Reads session cookie from request
 * 2. Validates the session
 * 3. Attaches session data to request.session
 * 4. Rejects request if session is invalid (401 Unauthorized)
 *
 * Usage:
 * ```typescript
 * fastify.post('/admin/endpoint', {
 *   preHandler: requireSession
 * }, async (request, reply) => {
 *   // request.session is available and validated
 *   const userId = request.session.userId;
 * });
 * ```
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { validateSession } from '../lib/session.js';
import { SESSION_CONFIG } from '../lib/session.js';

/**
 * Require valid session middleware
 *
 * This middleware BLOCKS requests that don't have a valid session.
 * Use this for protected routes (admin endpoints).
 *
 * @param request - Fastify request
 * @param reply - Fastify reply
 */
export async function requireSession(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Get session ID from cookie
  const sessionId = request.cookies[SESSION_CONFIG.COOKIE_NAME];

  // No cookie = not authenticated
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Authentication required. Please login.',
      code: 'NO_SESSION',
    });
  }

  // Validate session
  const session = await validateSession(sessionId);

  // Invalid/expired session
  if (!session) {
    // Clear the invalid cookie
    reply.clearCookie(SESSION_CONFIG.COOKIE_NAME, {
      path: '/',
    });

    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Session expired or invalid. Please login again.',
      code: 'INVALID_SESSION',
    });
  }

  // Attach session to request for use in route handlers
  request.session = session;

  // Session is valid, continue to route handler
}

/**
 * Require specific role middleware
 *
 * This middleware requires both a valid session AND a specific role.
 * Use this for routes that need specific permissions.
 *
 * @param allowedRoles - Array of roles that can access this route
 * @returns Middleware function
 *
 * Usage:
 * ```typescript
 * fastify.delete('/admin/critical', {
 *   preHandler: [requireSession, requireRole(['owner'])]
 * }, async (request, reply) => {
 *   // Only 'owner' role can access this
 * });
 * ```
 */
export function requireRole(allowedRoles: Array<'owner' | 'editor' | 'contributor'>) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // requireSession should have already run and attached session
    if (!request.session) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authentication required.',
        code: 'NO_SESSION',
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(request.session.role)) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
        userRole: request.session.role,
        requiredRoles: allowedRoles,
      });
    }

    // Role is allowed, continue
  };
}
