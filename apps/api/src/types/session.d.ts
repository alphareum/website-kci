/**
 * Session Types for BFF Authentication
 */

export interface SessionData {
  sessionId: string;
  userId: number;
  email: string;
  role: 'owner' | 'editor' | 'contributor';
  createdAt: number;
  expiresAt: number;
  lastAccessedAt: number;
}

export interface SessionCreateInput {
  userId: number;
  email: string;
  role: 'owner' | 'editor' | 'contributor';
}

// Extend Fastify request to include session
declare module 'fastify' {
  interface FastifyRequest {
    session?: SessionData;
  }
}
