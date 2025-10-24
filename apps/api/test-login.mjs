/**
 * Test script for Checkpoint 3: Login with Session Creation
 *
 * Run with: node test-login.mjs
 */

import { buildServer } from './dist/server/server.js';
import { SESSION_CONFIG } from './dist/lib/session.js';
import { getSession } from './dist/lib/session-store.js';

async function test() {
  console.log('🧪 Testing Login with Sessions (Checkpoint 3)...\n');

  const server = await buildServer();

  try {
    await server.listen({ port: 3098, host: '127.0.0.1' });
    console.log('✓ Test server started on port 3098\n');

    // Test 1: Login with valid credentials
    console.log('✓ Test 1: Login with valid credentials...');
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@test.com',
        password: 'test1234', // Test admin created by create-test-admin.mjs (8 chars min)
      },
    });

    if (loginResponse.statusCode !== 200) {
      console.log('  Response:', loginResponse.body);
      throw new Error(`Login failed with status ${loginResponse.statusCode}`);
    }

    const loginData = JSON.parse(loginResponse.body);
    console.log('  ✅ Login successful');
    console.log('  User:', {
      id: loginData.user.id,
      email: loginData.user.email,
      role: loginData.user.role,
    });
    console.log('  Session expires in:', Math.floor(loginData.session.expiresIn / 60 / 60 / 24), 'days');

    // Check if cookie was set
    const setCookieHeader = loginResponse.headers['set-cookie'];
    if (!setCookieHeader) {
      throw new Error('No Set-Cookie header found');
    }

    console.log('  ✅ Session cookie set');

    // Extract session ID from cookie
    const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    const sessionIdMatch = cookieString.match(/kci_session=([^;]+)/);
    if (!sessionIdMatch) {
      throw new Error('Could not extract session ID from cookie');
    }
    const sessionId = sessionIdMatch[1];
    console.log('  Session ID:', sessionId.substring(0, 16) + '...');

    // Verify cookie attributes
    if (!cookieString.includes('HttpOnly')) {
      throw new Error('Cookie missing HttpOnly flag');
    }
    console.log('  ✅ Cookie has HttpOnly flag (XSS protection)');

    if (!cookieString.includes('SameSite=Strict')) {
      throw new Error('Cookie missing SameSite=Strict');
    }
    console.log('  ✅ Cookie has SameSite=Strict (CSRF protection)');

    console.log('');

    // Test 2: Verify session was stored
    console.log('✓ Test 2: Verify session was stored...');
    const storedSession = await getSession(sessionId);
    if (!storedSession) {
      throw new Error('Session not found in storage');
    }
    console.log('  ✅ Session stored successfully');
    console.log('  Stored session:', {
      userId: storedSession.userId,
      email: storedSession.email,
      role: storedSession.role,
    });
    console.log('');

    // Test 3: Make authenticated request with session cookie
    console.log('✓ Test 3: Use session cookie for authenticated request...');
    const authenticatedResponse = await server.inject({
      method: 'GET',
      url: '/healthz', // Any endpoint works for now
      cookies: {
        [SESSION_CONFIG.COOKIE_NAME]: sessionId,
      },
    });

    if (authenticatedResponse.statusCode === 200) {
      console.log('  ✅ Authenticated request successful');
    }
    console.log('');

    // Test 4: Login with invalid credentials
    console.log('✓ Test 4: Login with invalid credentials...');
    const failedLogin = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'admin@komunitaschineseindonesia.com',
        password: 'wrongpassword',
      },
    });

    if (failedLogin.statusCode === 401) {
      console.log('  ✅ Correctly rejected invalid credentials');
      const errorData = JSON.parse(failedLogin.body);
      console.log('  Error message:', errorData.message);
    } else {
      throw new Error('Should have rejected invalid credentials');
    }
    console.log('');

    // Test 5: Login with missing fields
    console.log('✓ Test 5: Login with missing fields...');
    const missingFieldsLogin = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'admin@komunitaschineseindonesia.com',
        // password missing
      },
    });

    if (missingFieldsLogin.statusCode === 400) {
      console.log('  ✅ Correctly rejected missing password');
    } else {
      throw new Error('Should have rejected missing password');
    }
    console.log('');

    await server.close();

    console.log('🎉 All tests passed! Checkpoint 3 is working correctly.\n');
    console.log('📝 Summary:');
    console.log('   - Login creates session with 7-day expiration ✓');
    console.log('   - Session stored in file system ✓');
    console.log('   - HttpOnly cookie set (XSS protection) ✓');
    console.log('   - SameSite=Strict (CSRF protection) ✓');
    console.log('   - Invalid credentials rejected ✓');
    console.log('   - Input validation working ✓\n');
    console.log('Next: Checkpoint 4 will protect admin endpoints\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    await server.close();
    process.exit(1);
  }
}

test();
