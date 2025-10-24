/**
 * Debug script to verify password hashing
 */

import { verifyPassword, hashPassword } from './dist/modules/auth/service.js';
import { readTable } from './dist/lib/json-store.js';

async function debug() {
  console.log('🔍 Debugging password verification...\n');

  // Read all admins
  const admins = await readTable('admins');
  console.log('Found admins:', admins.map(a => ({ id: a.id, email: a.email })));
  console.log('');

  // Find test admin
  const testAdmin = admins.find(a => a.email === 'test@test.com');
  if (!testAdmin) {
    console.log('❌ Test admin not found in database');
    return;
  }

  console.log('✓ Test admin found:');
  console.log('  Email:', testAdmin.email);
  console.log('  Password hash:', testAdmin.password_hash);
  console.log('');

  // Test password verification
  const password = 'test1234';
  console.log('Testing password:', password);

  const isValid = verifyPassword(password, testAdmin.password_hash);
  console.log('Verification result:', isValid ? '✅ VALID' : '❌ INVALID');
  console.log('');

  // Generate a fresh hash for comparison
  console.log('Generating fresh hash for comparison...');
  const freshHash = hashPassword(password);
  console.log('Fresh hash:', freshHash);
  const freshVerify = verifyPassword(password, freshHash);
  console.log('Fresh hash verification:', freshVerify ? '✅ VALID' : '❌ INVALID');
  console.log('');

  // Check if we need to update the stored hash
  if (!isValid) {
    console.log('⚠️  Stored hash is invalid. Updating...');
    testAdmin.password_hash = freshHash;
    await import('./dist/lib/json-store.js').then(m => m.writeTable('admins', admins));
    console.log('✅ Updated test admin password hash');
  }
}

debug();
