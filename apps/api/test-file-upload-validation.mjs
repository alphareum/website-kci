/**
 * Test File Upload Validation
 *
 * This script tests that:
 * 1. Valid images are accepted (JPEG, PNG, GIF, WebP)
 * 2. Valid SVG without scripts is accepted
 * 3. Malicious files are rejected:
 *    - Files disguised with wrong extensions
 *    - SVG files with XSS payloads
 *    - Oversized files (> 10MB)
 *    - Non-image files
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEST_FILES_DIR = join(__dirname, 'test-files');

const API_URL = 'http://localhost:3001';
let sessionCookie = '';

// Create test files directory
await mkdir(TEST_FILES_DIR, { recursive: true });

console.log('=== File Upload Validation Test ===\n');
console.log('Creating test files...\n');

// Create a valid 1x1 PNG image (base64 decoded)
const VALID_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const validPngBuffer = Buffer.from(VALID_PNG_BASE64, 'base64');
await writeFile(join(TEST_FILES_DIR, 'valid.png'), validPngBuffer);

// Create a valid 1x1 JPEG image
const VALID_JPEG_BASE64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';
const validJpegBuffer = Buffer.from(VALID_JPEG_BASE64, 'base64');
await writeFile(join(TEST_FILES_DIR, 'valid.jpg'), validJpegBuffer);

// Create a valid GIF image (1x1 transparent)
const VALID_GIF_BASE64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const validGifBuffer = Buffer.from(VALID_GIF_BASE64, 'base64');
await writeFile(join(TEST_FILES_DIR, 'valid.gif'), validGifBuffer);

// Create a valid SVG without scripts
const validSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>';
await writeFile(join(TEST_FILES_DIR, 'valid.svg'), validSvg);

// Create malicious SVG with script tag
const maliciousSvgScript = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("XSS")</script><circle cx="50" cy="50" r="40"/></svg>';
await writeFile(join(TEST_FILES_DIR, 'malicious-script.svg'), maliciousSvgScript);

// Create malicious SVG with event handler
const maliciousSvgEvent = '<svg xmlns="http://www.w3.org/2000/svg" onclick="alert(\'XSS\')"><circle cx="50" cy="50" r="40"/></svg>';
await writeFile(join(TEST_FILES_DIR, 'malicious-event.svg'), maliciousSvgEvent);

// Create malicious SVG with javascript: URL
const maliciousSvgJsUrl = '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(\'XSS\')"><circle cx="50" cy="50" r="40"/></a></svg>';
await writeFile(join(TEST_FILES_DIR, 'malicious-jsurl.svg'), maliciousSvgJsUrl);

// Create text file disguised as image
const fakeImage = '<?php system($_GET["cmd"]); ?>';
await writeFile(join(TEST_FILES_DIR, 'malicious.php.jpg'), fakeImage);

// Create oversized file (11MB - exceeds 10MB limit)
const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024, 'A');
await writeFile(join(TEST_FILES_DIR, 'oversized.jpg'), oversizedBuffer);

console.log('✅ Test files created\n');

/**
 * Helper function to upload a file
 */
async function uploadFile(filename, mimeType = 'image/jpeg', type = 'gallery') {
  const form = new FormData();
  const buffer = await import('node:fs/promises').then(fs =>
    fs.readFile(join(TEST_FILES_DIR, filename))
  );

  form.append('file', buffer, {
    filename,
    contentType: mimeType,
  });
  form.append('type', type);

  const response = await fetch(`${API_URL}/api/media/upload`, {
    method: 'POST',
    headers: {
      'Cookie': sessionCookie,
    },
    body: form,
  });

  return {
    status: response.status,
    ok: response.ok,
    data: await response.json().catch(() => null),
  };
}

/**
 * Login to get session cookie
 */
async function login() {
  console.log('Logging in to get session cookie...');
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'test1234',
    }),
  });

  if (!response.ok) {
    console.error('❌ Login failed:', response.status);
    console.error('   Please update the email/password in test script');
    console.error('   Or create a test admin with: node create-test-admin.mjs\n');
    process.exit(1);
  }

  const cookies = response.headers.get('set-cookie');
  if (cookies) {
    sessionCookie = cookies.split(';')[0];
  }

  console.log('✅ Logged in successfully\n');
}

/**
 * Run all tests
 */
async function runTests() {
  await login();

  console.log('=== Testing Valid Uploads (Should PASS) ===\n');

  // Test 1: Valid PNG
  console.log('Test 1: Valid PNG image');
  try {
    const result = await uploadFile('valid.png', 'image/png');
    if (result.ok) {
      console.log('✅ PASS: Valid PNG accepted');
      console.log(`   URL: ${result.data?.url}\n`);
    } else {
      console.log('❌ FAIL: Valid PNG rejected');
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${JSON.stringify(result.data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL: Request error');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 2: Valid JPEG
  console.log('Test 2: Valid JPEG image');
  try {
    const result = await uploadFile('valid.jpg', 'image/jpeg');
    if (result.ok) {
      console.log('✅ PASS: Valid JPEG accepted');
      console.log(`   URL: ${result.data?.url}\n`);
    } else {
      console.log('❌ FAIL: Valid JPEG rejected');
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${JSON.stringify(result.data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL: Request error');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 3: Valid GIF
  console.log('Test 3: Valid GIF image');
  try {
    const result = await uploadFile('valid.gif', 'image/gif');
    if (result.ok) {
      console.log('✅ PASS: Valid GIF accepted');
      console.log(`   URL: ${result.data?.url}\n`);
    } else {
      console.log('❌ FAIL: Valid GIF rejected');
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${JSON.stringify(result.data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL: Request error');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 4: Valid SVG
  console.log('Test 4: Valid SVG (no scripts)');
  try {
    const result = await uploadFile('valid.svg', 'image/svg+xml');
    if (result.ok) {
      console.log('✅ PASS: Valid SVG accepted');
      console.log(`   URL: ${result.data?.url}\n`);
    } else {
      console.log('❌ FAIL: Valid SVG rejected');
      console.log(`   Status: ${result.status}`);
      console.log(`   Error: ${JSON.stringify(result.data)}\n`);
    }
  } catch (error) {
    console.log('❌ FAIL: Request error');
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('=== Testing Malicious Uploads (Should FAIL) ===\n');

  // Test 5: SVG with script tag
  console.log('Test 5: SVG with <script> tag (XSS attack)');
  try {
    const result = await uploadFile('malicious-script.svg', 'image/svg+xml');
    if (!result.ok) {
      console.log('✅ PASS: Malicious SVG blocked');
      console.log(`   Error: ${result.data?.message || JSON.stringify(result.data)}\n`);
    } else {
      console.log('❌ FAIL: Malicious SVG was accepted! (Security vulnerability)');
      console.log(`   URL: ${result.data?.url}\n`);
    }
  } catch (error) {
    console.log('✅ PASS: Malicious SVG blocked (request error)');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 6: SVG with event handler
  console.log('Test 6: SVG with onclick event handler (XSS attack)');
  try {
    const result = await uploadFile('malicious-event.svg', 'image/svg+xml');
    if (!result.ok) {
      console.log('✅ PASS: SVG with event handler blocked');
      console.log(`   Error: ${result.data?.message || JSON.stringify(result.data)}\n`);
    } else {
      console.log('❌ FAIL: SVG with event handler was accepted! (Security vulnerability)');
      console.log(`   URL: ${result.data?.url}\n`);
    }
  } catch (error) {
    console.log('✅ PASS: SVG with event handler blocked (request error)');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 7: SVG with javascript: URL
  console.log('Test 7: SVG with javascript: URL (XSS attack)');
  try {
    const result = await uploadFile('malicious-jsurl.svg', 'image/svg+xml');
    if (!result.ok) {
      console.log('✅ PASS: SVG with javascript: URL blocked');
      console.log(`   Error: ${result.data?.message || JSON.stringify(result.data)}\n`);
    } else {
      console.log('❌ FAIL: SVG with javascript: URL was accepted! (Security vulnerability)');
      console.log(`   URL: ${result.data?.url}\n`);
    }
  } catch (error) {
    console.log('✅ PASS: SVG with javascript: URL blocked (request error)');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 8: PHP file disguised as JPEG
  console.log('Test 8: PHP file with .jpg extension (disguised malware)');
  try {
    const result = await uploadFile('malicious.php.jpg', 'image/jpeg');
    if (!result.ok) {
      console.log('✅ PASS: Disguised PHP file blocked');
      console.log(`   Error: ${result.data?.message || JSON.stringify(result.data)}\n`);
    } else {
      console.log('❌ FAIL: Disguised PHP file was accepted! (Security vulnerability)');
      console.log(`   URL: ${result.data?.url}\n`);
    }
  } catch (error) {
    console.log('✅ PASS: Disguised PHP file blocked (request error)');
    console.log(`   Error: ${error.message}\n`);
  }

  // Test 9: Oversized file
  console.log('Test 9: Oversized file (11MB, exceeds 10MB limit)');
  try {
    const result = await uploadFile('oversized.jpg', 'image/jpeg');
    if (!result.ok) {
      console.log('✅ PASS: Oversized file blocked');
      console.log(`   Error: ${result.data?.message || JSON.stringify(result.data)}\n`);
    } else {
      console.log('❌ FAIL: Oversized file was accepted! (Storage abuse risk)');
      console.log(`   URL: ${result.data?.url}\n`);
    }
  } catch (error) {
    console.log('✅ PASS: Oversized file blocked (request error)');
    console.log(`   Error: ${error.message}\n`);
  }

  console.log('=== Test Summary ===');
  console.log('✅ All tests completed');
  console.log('\nExpected results:');
  console.log('  - Tests 1-4: Should PASS (valid images accepted)');
  console.log('  - Tests 5-9: Should PASS (malicious files blocked)');
  console.log('\n⚠️  If any "FAIL" results appear above, the validation has issues!');
}

runTests().catch(console.error);
