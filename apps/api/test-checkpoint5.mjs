/**
 * Test script for Checkpoint 5: Logout Functionality
 *
 * Verifies that:
 * - Logout endpoint requires authentication
 * - Logout deletes session from storage
 * - Logout clears session cookie
 * - After logout, session cannot be used
 *
 * Run with: node test-checkpoint5.mjs
 */

import { buildServer } from './dist/server/server.js';
import { SESSION_CONFIG } from './dist/lib/session.js';
import { getSession } from './dist/lib/session-store.js';

async function test() {
  console.log('🧪 Testing Logout Functionality (Checkpoint 5)...\n');

  const server = await buildServer();

  try {
    await server.listen({ port: 3097, host: '127.0.0.1' });
    console.log('✓ Test server started on port 3097\n');

    // Test 1: Logout requires authentication
    console.log('✓ Test 1: Logout endpoint requires authentication...');
    const unauthLogout = await server.inject({
      method: 'POST',
      url: '/api/auth/logout',
    });

    if (unauthLogout.statusCode === 401) {
      const body = JSON.parse(unauthLogout.body);
      console.log('  ✅ Unauthenticated logout rejected: 401 Unauthorized');
      console.log(`     Message: "${body.message}"`);
    } else {
      throw new Error(`Expected 401, got ${unauthLogout.statusCode}`);
    }
    console.log('');

    // Test 2: Login to get a session
    console.log('✓ Test 2: Login to get a session...');
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
    console.log('  ✅ Login successful');
    console.log('  Session ID:', sessionId.substring(0, 16) + '...');
    console.log('');

    // Test 3: Verify session exists in storage
    console.log('✓ Test 3: Verify session exists in storage...');
    const sessionBefore = await getSession(sessionId);
    if (!sessionBefore) {
      throw new Error('Session not found in storage after login');
    }
    console.log('  ✅ Session found in storage');
    console.log('  User:', sessionBefore.email);
    console.log('');

    // Test 4: Use session to access protected endpoint
    console.log('✓ Test 4: Verify session works before logout...');
    const beforeLogout = await server.inject({
      method: 'POST',
      url: '/api/posts',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
      payload: {
        title: 'Test Post',
        slug: 'test-post-checkpoint-5',
        summary: 'Test summary',
        body: 'Test body',
        status: 'draft',
        category: 'news',
        author_id: 2,
        cover_image_url: 'https://example.com/image.jpg',
        published_at: new Date().toISOString(),
      },
    });

    // Should not be 401
    if (beforeLogout.statusCode === 401) {
      throw new Error('Session not working before logout');
    }
    console.log(`  ✅ Protected endpoint accessible: ${beforeLogout.statusCode}`);
    console.log('');

    // Test 5: Logout with valid session
    console.log('✓ Test 5: Logout with valid session...');
    const logoutResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/logout',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
    });

    if (logoutResponse.statusCode !== 200) {
      throw new Error(`Logout failed with status ${logoutResponse.statusCode}`);
    }

    const logoutData = JSON.parse(logoutResponse.body);
    console.log('  ✅ Logout successful');
    console.log('  Response:', logoutData);

    // Check if cookie was cleared
    const clearCookieHeader = logoutResponse.headers['set-cookie'];
    if (!clearCookieHeader) {
      throw new Error('No Set-Cookie header found for clearing cookie');
    }
    console.log('  ✅ Cookie cleared in response');
    console.log('');

    // Test 6: Verify session deleted from storage
    console.log('✓ Test 6: Verify session deleted from storage...');
    const sessionAfter = await getSession(sessionId);
    if (sessionAfter) {
      throw new Error('Session still exists in storage after logout');
    }
    console.log('  ✅ Session deleted from storage');
    console.log('');

    // Test 7: Try to use old session (should fail)
    console.log('✓ Test 7: Old session cannot be used after logout...');
    const afterLogout = await server.inject({
      method: 'POST',
      url: '/api/posts',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
      payload: {
        title: 'Test',
        slug: 'test',
      },
    });

    if (afterLogout.statusCode === 401) {
      const body = JSON.parse(afterLogout.body);
      console.log('  ✅ Old session rejected: 401 Unauthorized');
      console.log(`     Message: "${body.message}"`);
    } else {
      throw new Error(`Expected 401, got ${afterLogout.statusCode}`);
    }
    console.log('');

    await server.close();

    console.log('🎉 All tests passed! Checkpoint 5 is working correctly.\n');
    console.log('📝 Summary:');
    console.log('   ✓ Logout requires authentication');
    console.log('   ✓ Logout deletes session from storage');
    console.log('   ✓ Logout clears session cookie');
    console.log('   ✓ Old session cannot be reused after logout\n');
    console.log('Next: Checkpoint 6 will protect the admin list endpoint\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    await server.close();
    process.exit(1);
  }
}

test();
