/**
 * Test script for Checkpoint 1: Session Storage
 *
 * Run with: node test-session.mjs
 */

import { createSession, validateSession, destroySession } from './dist/lib/session.js';

async function test() {
  console.log('🧪 Testing Session Storage (Checkpoint 1)...\n');

  try {
    // Test 1: Create session
    console.log('✓ Test 1: Creating session...');
    const session = await createSession({
      userId: 3,
      email: 'admin@komunitaschineseindonesia.com',
      role: 'owner',
    });
    console.log('  Session created:', {
      sessionId: session.sessionId,
      userId: session.userId,
      email: session.email,
      role: session.role,
      expiresIn: Math.floor((session.expiresAt - Date.now()) / 1000 / 60 / 60 / 24) + ' days',
    });
    console.log('  ✅ Session creation successful\n');

    // Test 2: Validate session
    console.log('✓ Test 2: Validating session...');
    const validated = await validateSession(session.sessionId);
    if (validated && validated.userId === session.userId) {
      console.log('  ✅ Session validation successful\n');
    } else {
      console.log('  ❌ Session validation failed\n');
      throw new Error('Session validation failed');
    }

    // Test 3: Validate non-existent session
    console.log('✓ Test 3: Validating non-existent session...');
    const invalid = await validateSession('invalid-session-id');
    if (invalid === null) {
      console.log('  ✅ Correctly rejected invalid session\n');
    } else {
      console.log('  ❌ Should have rejected invalid session\n');
      throw new Error('Invalid session was not rejected');
    }

    // Test 4: Destroy session
    console.log('✓ Test 4: Destroying session...');
    await destroySession(session.sessionId);
    const destroyed = await validateSession(session.sessionId);
    if (destroyed === null) {
      console.log('  ✅ Session destroyed successfully\n');
    } else {
      console.log('  ❌ Session should have been destroyed\n');
      throw new Error('Session was not destroyed');
    }

    console.log('🎉 All tests passed! Checkpoint 1 is working correctly.\n');
    console.log('📁 Session files are stored in: /kci-data/sessions/');
    console.log('   (Check this directory to see session files)\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();
