/**
 * Test script for Forgot Password feature
 * 
 * Usage:
 * 1. Make sure your backend server is running
 * 2. Run: node test-forgot-password.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
};

async function testForgotPassword() {
  console.log('\n🧪 Testing Forgot Password Feature\n');
  console.log('='.repeat(50) + '\n');

  // Test 1: Request password reset with valid email
  log.info('Test 1: Request password reset');
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'test@example.com', // Change this to an email from your database
    });

    if (response.data.success) {
      log.success('Password reset email sent!');
      console.log('\nResponse:', JSON.stringify(response.data, null, 2));
      
      // If in development, the reset token will be in the response
      if (response.data.resetToken) {
        log.warning('\n⚠️  Reset token (development only):');
        console.log(`   Token: ${response.data.resetToken}`);
        console.log(`   URL: ${response.data.resetUrl}\n`);
        
        // Store token for next test
        const resetToken = response.data.resetToken;
        
        // Wait a bit before testing reset
        log.info('\nWaiting 2 seconds before testing password reset...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 2: Reset password with token
        await testResetPassword(resetToken);
      } else {
        log.info('\n📧 Check your email inbox for the reset link!');
        log.info('(If using Mailtrap, check your Mailtrap inbox)');
      }
    }
  } catch (error) {
    if (error.response) {
      log.error('Failed to send reset email');
      console.log('Error:', error.response.data);
    } else {
      log.error('Server not reachable. Is it running?');
      console.log('Error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

async function testResetPassword(resetToken) {
  log.info('Test 2: Reset password with token');
  
  try {
    const response = await axios.put(
      `${API_URL}/auth/reset-password/${resetToken}`,
      {
        password: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }
    );

    if (response.data.success) {
      log.success('Password reset successful!');
      console.log('\nResponse:', JSON.stringify(response.data, null, 2));
      log.info('\n✅ You can now login with the new password!');
    }
  } catch (error) {
    if (error.response) {
      log.error('Failed to reset password');
      console.log('Error:', error.response.data);
    } else {
      log.error('Request failed');
      console.log('Error:', error.message);
    }
  }
}

// Test validation errors
async function testValidation() {
  console.log('\n🧪 Testing Validation\n');
  console.log('='.repeat(50) + '\n');

  // Test invalid email
  log.info('Test 3: Invalid email format');
  try {
    await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'invalid-email',
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.success('Validation working correctly!');
      console.log('Validation errors:', error.response.data.errors);
    }
  }

  // Test weak password
  log.info('\nTest 4: Weak password');
  try {
    await axios.put(`${API_URL}/auth/reset-password/dummy-token`, {
      password: 'weak',
      confirmPassword: 'weak',
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.success('Password validation working!');
      console.log('Validation errors:', error.response.data.errors);
    }
  }

  // Test password mismatch
  log.info('\nTest 5: Password mismatch');
  try {
    await axios.put(`${API_URL}/auth/reset-password/dummy-token`, {
      password: 'Password123',
      confirmPassword: 'Different123',
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      log.success('Password match validation working!');
      console.log('Validation errors:', error.response.data.errors);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

// Run tests
async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('  ProGet - Forgot Password Feature Tests');
  console.log('='.repeat(50));

  // Check if server is running
  try {
    await axios.get(`${API_URL}/health`);
    log.success('Backend server is running!\n');
  } catch (error) {
    log.error('Backend server is not running!');
    log.info('Please start the server with: npm run dev');
    process.exit(1);
  }

  // Run tests
  await testForgotPassword();
  await testValidation();

  console.log('\n✅ All tests completed!\n');
  console.log('Next steps:');
  console.log('1. Check your email inbox (or Mailtrap)');
  console.log('2. Click the reset link');
  console.log('3. Enter a new password');
  console.log('4. Try logging in with the new password\n');
}

// Handle axios dependency
try {
  require('axios');
  runAllTests();
} catch (error) {
  console.log('Installing axios for testing...');
  require('child_process').execSync('npm install axios', {
    cwd: __dirname,
    stdio: 'inherit',
  });
  console.log('Please run the script again: node test-forgot-password.js');
}

