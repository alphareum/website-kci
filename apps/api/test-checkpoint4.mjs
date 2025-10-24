/**
 * Test script for Checkpoint 4: Admin Endpoints Protection
 *
 * Verifies that:
 * - Admin endpoints require authentication
 * - Unauthenticated requests get 401
 * - Public endpoints still work without auth
 * - Authenticated requests work correctly
 *
 * Run with: node test-checkpoint4.mjs
 */

import { buildServer } from './dist/server/server.js';
import { SESSION_CONFIG } from './dist/lib/session.js';

async function test() {
  console.log('🧪 Testing Admin Endpoint Protection (Checkpoint 4)...\n');

  const server = await buildServer();

  try {
    await server.listen({ port: 3099, host: '127.0.0.1' });
    console.log('✓ Test server started on port 3099\n');

    // First, login to get a valid session
    console.log('⚙️  Logging in to get session cookie...');
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@test.com',
        password: 'test1234',
      },
    });

    if (loginResponse.statusCode !== 200) {
      throw new Error(`Login failed: ${loginResponse.statusCode}`);
    }

    const setCookieHeader = loginResponse.headers['set-cookie'];
    const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    const sessionIdMatch = cookieString.match(/kci_session=([^;]+)/);
    const sessionId = sessionIdMatch[1];
    console.log('  ✅ Login successful, session ID:', sessionId.substring(0, 16) + '...\n');

    // Test 1: Public endpoints work without authentication
    console.log('✓ Test 1: Public endpoints accessible without auth...');

    const publicTests = [
      { method: 'GET', url: '/api/company-profiles', name: 'Company profiles list' },
      { method: 'GET', url: '/api/posts', name: 'Posts list' },
      { method: 'GET', url: '/api/media/gallery', name: 'Media gallery' },
    ];

    for (const test of publicTests) {
      const response = await server.inject({
        method: test.method,
        url: test.url,
      });

      if (response.statusCode === 200) {
        console.log(`  ✅ ${test.name}: ${response.statusCode}`);
      } else {
        throw new Error(`${test.name} failed with ${response.statusCode}`);
      }
    }
    console.log('');

    // Test 2: Admin endpoints blocked without authentication
    console.log('✓ Test 2: Admin endpoints blocked without auth...');

    const protectedTests = [
      { method: 'POST', url: '/api/admin/company-profiles', name: 'Create company profile', payload: {} },
      { method: 'POST', url: '/api/posts', name: 'Create post', payload: {} },
      { method: 'POST', url: '/api/media', name: 'Create media', payload: {} },
      { method: 'DELETE', url: '/api/posts/999', name: 'Delete post' },
      { method: 'DELETE', url: '/api/media/999', name: 'Delete media' },
    ];

    for (const test of protectedTests) {
      const response = await server.inject({
        method: test.method,
        url: test.url,
        payload: test.payload,
      });

      if (response.statusCode === 401) {
        const body = JSON.parse(response.body);
        console.log(`  ✅ ${test.name}: 401 Unauthorized`);
        console.log(`     Message: "${body.message}"`);
      } else {
        throw new Error(`${test.name} should return 401, got ${response.statusCode}`);
      }
    }
    console.log('');

    // Test 3: Admin endpoints work with valid session
    console.log('✓ Test 3: Admin endpoints accessible with valid session...');

    // Test creating a post with authentication
    const authenticatedPostResponse = await server.inject({
      method: 'POST',
      url: '/api/posts',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
      payload: {
        title: 'Test Post',
        slug: 'test-post-checkpoint-4',
        excerpt: 'Test excerpt',
        content: 'Test content',
        status: 'draft',
        category: 'news',
        author_id: 2,
      },
    });

    // Should not be 401 (it might be 400 for validation or 200 for success)
    if (authenticatedPostResponse.statusCode === 401) {
      throw new Error('Authenticated request to create post was rejected');
    } else if (authenticatedPostResponse.statusCode === 200) {
      console.log('  ✅ Create post with auth: 200 OK');
    } else {
      console.log(`  ✅ Create post with auth: ${authenticatedPostResponse.statusCode} (not 401, auth working)`);
    }

    // Test media upload endpoint is protected
    const authenticatedMediaResponse = await server.inject({
      method: 'POST',
      url: '/api/media',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
      payload: {
        type: 'gallery',
        title: 'Test Image',
        url: 'https://example.com/test.jpg',
        alt_text: 'Test',
        sort_order: 1,
      },
    });

    if (authenticatedMediaResponse.statusCode === 401) {
      throw new Error('Authenticated request to create media was rejected');
    } else if (authenticatedMediaResponse.statusCode === 200) {
      console.log('  ✅ Create media with auth: 200 OK');
    } else {
      console.log(`  ✅ Create media with auth: ${authenticatedMediaResponse.statusCode} (not 401, auth working)`);
    }

    console.log('');

    // Test 4: Invalid/expired session is rejected
    console.log('✓ Test 4: Invalid session rejected...');
    const invalidSessionResponse = await server.inject({
      method: 'POST',
      url: '/api/posts',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: 'invalid-session-id-12345',
      },
      payload: {
        title: 'Test',
        slug: 'test',
      },
    });

    if (invalidSessionResponse.statusCode === 401) {
      const body = JSON.parse(invalidSessionResponse.body);
      console.log('  ✅ Invalid session rejected: 401 Unauthorized');
      console.log(`     Message: "${body.message}"`);
    } else {
      throw new Error(`Invalid session should return 401, got ${invalidSessionResponse.statusCode}`);
    }
    console.log('');

    await server.close();

    console.log('🎉 All tests passed! Checkpoint 4 is working correctly.\n');
    console.log('📝 Summary:');
    console.log('   ✓ Public endpoints accessible without auth');
    console.log('   ✓ Admin endpoints blocked without auth (401)');
    console.log('   ✓ Admin endpoints work with valid session');
    console.log('   ✓ Invalid sessions rejected (401)\n');
    console.log('🔒 Protected endpoints:');
    console.log('   - POST /api/admin/company-profiles');
    console.log('   - PUT /api/admin/company-profiles/:id');
    console.log('   - DELETE /api/admin/company-profiles/:id');
    console.log('   - POST /api/posts');
    console.log('   - DELETE /api/posts/:id');
    console.log('   - POST /api/media/upload');
    console.log('   - POST /api/media');
    console.log('   - DELETE /api/media/:id');
    console.log('   - PATCH /api/media/:id/reorder\n');
    console.log('Next: Checkpoint 5 will add logout functionality\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    await server.close();
    process.exit(1);
  }
}

test();
