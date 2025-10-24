/**
 * Test script for Checkpoint 6: Protect Admin List Endpoint
 *
 * Verifies that:
 * - Admin list endpoint requires authentication
 * - Admin emails are not exposed to unauthenticated users
 * - Admin list works with valid session
 *
 * Run with: node test-checkpoint6.mjs
 */

import { buildServer } from './dist/server/server.js';
import { SESSION_CONFIG } from './dist/lib/session.js';

async function test() {
  console.log('🧪 Testing Admin List Protection (Checkpoint 6)...\n');

  const server = await buildServer();

  try {
    await server.listen({ port: 3096, host: '127.0.0.1' });
    console.log('✓ Test server started on port 3096\n');

    // Test 1: Admin list blocked without authentication
    console.log('✓ Test 1: Admin list endpoint blocked without auth...');
    const unauthResponse = await server.inject({
      method: 'GET',
      url: '/api/auth',
    });

    if (unauthResponse.statusCode === 401) {
      const body = JSON.parse(unauthResponse.body);
      console.log('  ✅ Admin list blocked: 401 Unauthorized');
      console.log(`     Message: "${body.message}"`);
      console.log('  ✅ Admin emails NOT exposed to public');
    } else {
      throw new Error(`Expected 401, got ${unauthResponse.statusCode}`);
    }
    console.log('');

    // Test 2: Login to get valid session
    console.log('✓ Test 2: Login to get valid session...');
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

    // Test 3: Access admin list with valid session
    console.log('✓ Test 3: Admin list accessible with valid session...');
    const authResponse = await server.inject({
      method: 'GET',
      url: '/api/auth',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
    });

    if (authResponse.statusCode === 200) {
      const body = JSON.parse(authResponse.body);
      console.log('  ✅ Admin list accessible: 200 OK');
      console.log(`  Found ${body.admins.length} admin(s):`);
      body.admins.forEach((admin) => {
        console.log(`     - ${admin.email} (${admin.role})`);
      });

      // Verify password_hash is NOT included in response
      const hasPasswordHash = body.admins.some(admin => 'password_hash' in admin);
      if (hasPasswordHash) {
        throw new Error('❌ Security Issue: password_hash included in admin list response!');
      }
      console.log('  ✅ Password hashes NOT included in response (secure)');
    } else {
      throw new Error(`Expected 200, got ${authResponse.statusCode}`);
    }
    console.log('');

    // Test 4: Invalid session is rejected
    console.log('✓ Test 4: Invalid session rejected...');
    const invalidResponse = await server.inject({
      method: 'GET',
      url: '/api/auth',
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: 'invalid-session-id',
      },
    });

    if (invalidResponse.statusCode === 401) {
      const body = JSON.parse(invalidResponse.body);
      console.log('  ✅ Invalid session rejected: 401 Unauthorized');
      console.log(`     Message: "${body.message}"`);
    } else {
      throw new Error(`Expected 401, got ${invalidResponse.statusCode}`);
    }
    console.log('');

    await server.close();

    console.log('🎉 All tests passed! Checkpoint 6 is working correctly.\n');
    console.log('📝 Summary:');
    console.log('   ✓ Admin list requires authentication (401 without session)');
    console.log('   ✓ Admin emails NOT exposed to public');
    console.log('   ✓ Admin list works with valid session');
    console.log('   ✓ Password hashes NOT included in response');
    console.log('   ✓ Invalid sessions rejected\n');
    console.log('🔒 Security improvement:');
    console.log('   - Critical vulnerability fixed: Admin list no longer publicly exposed');
    console.log('   - Admin emails protected from enumeration attacks');
    console.log('   - Only authenticated admins can view admin list\n');
    console.log('Next: Checkpoint 7 will add session cleanup on startup\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    await server.close();
    process.exit(1);
  }
}

test();
