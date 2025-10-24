import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { AuthService, CredentialsSchema, InvalidCredentialsError } from './service.js';
import { createSession, destroySession, SESSION_CONFIG } from '../../lib/session.js';
import { requireSession } from '../../middleware/require-session.js';

export async function authRoutes(server: FastifyInstance) {
  const service = new AuthService();

  // GET /api/auth - List all admins (requires authentication)
  server.get('/', { preHandler: requireSession }, async () => {
    return { admins: await service.listAdmins() };
  });

  server.post('/login', async (request, reply) => {
    try {
      // Validate request body
      const credentials = CredentialsSchema.parse(request.body);

      // Verify credentials (validates email/password, updates last_login_at)
      const admin = await service.verifyCredentials(credentials);

      // Create session
      const sessionData = await createSession({
        userId: admin.id,
        email: admin.email,
        role: admin.role,
      });

      // Set HttpOnly cookie with session ID
      reply.setCookie(SESSION_CONFIG.COOKIE_NAME, sessionData.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: SESSION_CONFIG.MAX_AGE / 1000, // Convert ms to seconds
      });

      // Return user info (without password_hash) and session metadata
      return {
        user: admin,
        session: {
          expiresAt: sessionData.expiresAt,
          expiresIn: Math.floor((sessionData.expiresAt - Date.now()) / 1000), // seconds
        },
      };
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        throw server.httpErrors.badRequest('Invalid request: ' + error.issues[0].message);
      }

      // Handle authentication errors
      if (error instanceof InvalidCredentialsError) {
        throw server.httpErrors.unauthorized('Invalid email or password');
      }

      // Log unexpected errors
      server.log.error({ error }, 'Login error');
      throw server.httpErrors.internalServerError('Login failed');
    }
  });

  server.post('/logout', { preHandler: requireSession }, async (request, reply) => {
    try {
      // Get session ID from cookie
      const sessionId = request.cookies[SESSION_CONFIG.COOKIE_NAME];

      if (sessionId) {
        // Delete session from storage
        await destroySession(sessionId);
      }

      // Clear the session cookie
      reply.clearCookie(SESSION_CONFIG.COOKIE_NAME, {
        path: '/',
      });

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      server.log.error({ error }, 'Logout error');
      throw server.httpErrors.internalServerError('Logout failed');
    }
  });
}
