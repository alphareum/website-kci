/**
 * Create a test admin user
 * Run with: node create-test-admin.mjs
 */

import { AuthService } from './dist/modules/auth/service.js';

async function createTestAdmin() {
  const service = new AuthService();

  try {
    console.log('Creating test admin...');

    const admin = await service.createAdmin({
      email: 'test@test.com',
      full_name: 'Test Admin',
      role: 'owner',
      password: 'test1234',
    });

    console.log('✅ Test admin created successfully:');
    console.log('   Email:', admin.email);
    console.log('   Password: test1234');
    console.log('   Role:', admin.role);
    console.log('\nYou can now use these credentials for testing.');
  } catch (error) {
    if (error.message.includes('E11000')) {
      console.log('Test admin already exists. Use: test@test.com / test1234');
    } else {
      console.error('Error:', error.message);
    }
  }
}

createTestAdmin();
