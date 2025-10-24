/**
 * Test CORS Whitelist Configuration
 *
 * This script tests that:
 * 1. Allowed origins receive proper CORS headers
 * 2. Blocked origins are rejected
 * 3. No-origin requests work (Postman, curl, same-origin)
 */

import { buildServer } from './dist/server/server.js';

const TEST_PORT = 3099; // Use different port to avoid conflicts

async function testCORS() {
  console.log('=== CORS Whitelist Test ===\n');

  const server = await buildServer();

  try {
    await server.listen({ port: TEST_PORT, host: '0.0.0.0' });
    console.log(`✅ Server started on port ${TEST_PORT}\n`);

    // Test 1: Allowed origin (production domain)
    console.log('Test 1: Allowed origin (https://komunitaschineseindonesia.com)');
    try {
      const response1 = await fetch(`http://localhost:${TEST_PORT}/api`, {
        headers: {
          'Origin': 'https://komunitaschineseindonesia.com',
        },
      });
      const corsHeader1 = response1.headers.get('access-control-allow-origin');

      if (corsHeader1 === 'https://komunitaschineseindonesia.com') {
        console.log('✅ PASS: Allowed origin accepted');
        console.log(`   CORS header: ${corsHeader1}\n`);
      } else {
        console.log('❌ FAIL: Expected CORS header not found');
        console.log(`   Got: ${corsHeader1}\n`);
      }
    } catch (error) {
      console.log('❌ FAIL: Request failed');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 2: Allowed origin (www subdomain)
    console.log('Test 2: Allowed origin (https://www.komunitaschineseindonesia.com)');
    try {
      const response2 = await fetch(`http://localhost:${TEST_PORT}/api`, {
        headers: {
          'Origin': 'https://www.komunitaschineseindonesia.com',
        },
      });
      const corsHeader2 = response2.headers.get('access-control-allow-origin');

      if (corsHeader2 === 'https://www.komunitaschineseindonesia.com') {
        console.log('✅ PASS: WWW subdomain accepted');
        console.log(`   CORS header: ${corsHeader2}\n`);
      } else {
        console.log('❌ FAIL: Expected CORS header not found');
        console.log(`   Got: ${corsHeader2}\n`);
      }
    } catch (error) {
      console.log('❌ FAIL: Request failed');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 3: Development origin (localhost:3000)
    console.log('Test 3: Development origin (http://localhost:3000)');
    try {
      const response3 = await fetch(`http://localhost:${TEST_PORT}/api`, {
        headers: {
          'Origin': 'http://localhost:3000',
        },
      });
      const corsHeader3 = response3.headers.get('access-control-allow-origin');

      if (corsHeader3 === 'http://localhost:3000') {
        console.log('✅ PASS: Development origin accepted');
        console.log(`   CORS header: ${corsHeader3}\n`);
      } else {
        console.log('❌ FAIL: Expected CORS header not found');
        console.log(`   Got: ${corsHeader3}\n`);
      }
    } catch (error) {
      console.log('❌ FAIL: Request failed');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 4: Blocked origin (malicious site)
    console.log('Test 4: Blocked origin (https://evil-malicious-site.com)');
    try {
      const response4 = await fetch(`http://localhost:${TEST_PORT}/api`, {
        headers: {
          'Origin': 'https://evil-malicious-site.com',
        },
      });
      const corsHeader4 = response4.headers.get('access-control-allow-origin');

      if (!corsHeader4 || corsHeader4 === 'null') {
        console.log('✅ PASS: Malicious origin blocked');
        console.log(`   CORS header: ${corsHeader4 || 'none'}\n`);
      } else {
        console.log('❌ FAIL: Malicious origin was allowed!');
        console.log(`   CORS header: ${corsHeader4}\n`);
      }
    } catch (error) {
      console.log('✅ PASS: Malicious origin blocked (request failed)');
      console.log(`   Error: ${error.message}\n`);
    }

    // Test 5: No origin (Postman, curl, same-origin)
    console.log('Test 5: No origin header (Postman/curl)');
    try {
      const response5 = await fetch(`http://localhost:${TEST_PORT}/api`);
      const data = await response5.json();

      if (response5.ok) {
        console.log('✅ PASS: No-origin request accepted');
        console.log(`   Response: ${JSON.stringify(data)}\n`);
      } else {
        console.log('❌ FAIL: No-origin request rejected');
        console.log(`   Status: ${response5.status}\n`);
      }
    } catch (error) {
      console.log('❌ FAIL: Request failed');
      console.log(`   Error: ${error.message}\n`);
    }

    console.log('=== Test Summary ===');
    console.log('✅ All tests completed');
    console.log('\nExpected results:');
    console.log('  - Tests 1-3: Should PASS (allowed origins)');
    console.log('  - Test 4: Should PASS (blocked malicious origin)');
    console.log('  - Test 5: Should PASS (no-origin requests work)');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await server.close();
    console.log('\n✅ Server stopped');
  }
}

testCORS().catch(console.error);
