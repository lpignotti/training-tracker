import { validateEmail } from '../utils/validation';

// Test cases for email validation
const testCases = [
  { email: 'user@example.com', expected: null, description: 'Valid email' },
  { email: 'user@examplecom', expected: 'Email must contain a domain with at least one dot (e.g., @example.com)', description: 'Missing dot in domain' },
  { email: 'user@example.', expected: 'Domain extension must be at least 2 characters long', description: 'Empty domain extension' },
  { email: 'user@example.c', expected: 'Domain extension must be at least 2 characters long', description: 'Too short domain extension' },
  { email: '@example.com', expected: 'Please enter a valid email address (e.g., user@example.com)', description: 'Missing username' },
  { email: 'user@', expected: 'Email must contain a domain with at least one dot (e.g., @example.com)', description: 'Missing domain' },
  { email: 'user..name@example.com', expected: 'Email cannot contain consecutive dots', description: 'Consecutive dots' },
  { email: '.user@example.com', expected: 'Email cannot start or end with a dot', description: 'Starting with dot' },
  { email: 'user@.example.com', expected: 'Invalid email format around @ symbol', description: 'Dot after @' },
  { email: '', expected: 'Email is required', description: 'Empty email' },
  { email: '   ', expected: 'Email is required', description: 'Only whitespace' },
  { email: 'test.email+tag@example.co.uk', expected: null, description: 'Valid complex email' },
  { email: 'user@subdomain.example.com', expected: null, description: 'Valid subdomain email' }
];

export const runEmailValidationTests = () => {
  console.log('Running email validation tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const result = validateEmail(testCase.email);
    const success = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`  Input: "${testCase.email}"`);
    console.log(`  Expected: ${testCase.expected || 'null (valid)'}`);
    console.log(`  Got: ${result || 'null (valid)'}`);
    console.log(`  Result: ${success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    if (success) {
      passed++;
    } else {
      failed++;
    }
  });
  
  console.log(`\nTest Summary: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  
  return { passed, failed, total: testCases.length };
};

// Export for potential use in components
export { testCases };
