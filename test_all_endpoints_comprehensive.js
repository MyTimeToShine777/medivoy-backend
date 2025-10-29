const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api/v1';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'Password123!',
  first_name: 'Test',
  last_name: 'User',
  role: 'patient',
  phone: '+1234567890'
};

let authToken = '';

// Test results
const results = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper function to test endpoints
async function testEndpoint(method, url, data = null, headers = {}, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      results.passed++;
      results.details.push({
        method,
        url,
        status: 'PASS',
        responseStatus: response.status,
        message: 'Success'
      });
      return { success: true, data: response.data };
    } else {
      results.failed++;
      results.details.push({
        method,
        url,
        status: 'FAIL',
        responseStatus: response.status,
        expectedStatus,
        message: `Expected status ${expectedStatus}, got ${response.status}`
      });
      return { success: false, error: `Wrong status code: ${response.status}` };
    }
  } catch (error) {
    results.failed++;
    const status = error.response?.status || 'NO_RESPONSE';
    results.details.push({
      method,
      url,
      status: 'FAIL',
      responseStatus: status,
      expectedStatus,
      message: error.message
    });
    return { success: false, error: error.message };
  }
  
  results.total++;
}

// Comprehensive endpoint tests
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Endpoint Tests...\n');
  
  // Test 1: Health check
  console.log('Testing health endpoint...');
  await testEndpoint('GET', '/health');
  
  // Test 2: Root endpoint
  console.log('Testing root endpoint...');
  await testEndpoint('GET', '/');
  
  // Test 3: Auth endpoints
  console.log('Testing authentication endpoints...');
  
  // Registration
  const regResult = await testEndpoint('POST', '/auth/register', testUser, {}, 201);
  if (regResult.success) {
    authToken = regResult.data.data.accessToken;
  }
  
  // Login
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  if (loginResult.success) {
    authToken = loginResult.data.data.accessToken;
  }
  
  // Protected endpoints with token
  const authHeaders = { 'Authorization': `Bearer ${authToken}` };
  
  // Test 4: User endpoints
  console.log('Testing user endpoints...');
  await testEndpoint('GET', '/users/profile', null, authHeaders);
  await testEndpoint('PUT', '/users/profile', { first_name: 'Updated' }, authHeaders);
  
  // Test 5: Patient endpoints
  console.log('Testing patient endpoints...');
  await testEndpoint('GET', '/patients', null, authHeaders);
  await testEndpoint('POST', '/patients', {
    dateOfBirth: '1990-01-01',
    gender: 'male',
    bloodType: 'O+'
  }, authHeaders, 201);
  
  // Test 6: Doctor endpoints
  console.log('Testing doctor endpoints...');
  await testEndpoint('GET', '/doctors');
  await testEndpoint('POST', '/doctors', {
    first_name: 'Dr. John',
    last_name: 'Smith',
    specialty: 'Cardiology',
    licenseNumber: 'DOC123456'
  }, authHeaders, 201);
  
  // Test 7: Hospital endpoints
  console.log('Testing hospital endpoints...');
  await testEndpoint('GET', '/hospitals');
  await testEndpoint('POST', '/hospitals', {
    name: 'Test Hospital',
    address: '123 Test St',
    phone: '+1234567890'
  }, authHeaders, 201);
  
  // Test 8: Treatment endpoints
  console.log('Testing treatment endpoints...');
  await testEndpoint('GET', '/treatments');
  await testEndpoint('POST', '/treatments', {
    name: 'Test Treatment',
    description: 'Test Description',
    category: 'General'
  }, authHeaders, 201);
  
  // Test 9: Appointment endpoints
  console.log('Testing appointment endpoints...');
  await testEndpoint('GET', '/appointments', null, authHeaders);
  await testEndpoint('POST', '/appointments', {
    doctorId: 1,
    patientId: 1,
    date: '2024-12-01',
    time: '10:00'
  }, authHeaders, 201);
  
  // Test 10: Booking endpoints
  console.log('Testing booking endpoints...');
  await testEndpoint('GET', '/bookings', null, authHeaders);
  await testEndpoint('POST', '/bookings', {
    service: 'Consultation',
    date: '2024-12-01',
    time: '10:00'
  }, authHeaders, 201);
  
  // Test 11: Payment endpoints
  console.log('Testing payment endpoints...');
  await testEndpoint('GET', '/payments', null, authHeaders);
  await testEndpoint('POST', '/payments', {
    amount: 100,
    currency: 'USD',
    method: 'credit_card'
  }, authHeaders, 201);
  
  // Test 12: Insurance endpoints
  console.log('Testing insurance endpoints...');
  await testEndpoint('GET', '/insurance');
  await testEndpoint('POST', '/insurance', {
    provider: 'Test Insurance',
    policyNumber: 'POL123456',
    coverage: 'Full'
  }, authHeaders, 201);
  
  // Test 13: Laboratory endpoints
  console.log('Testing laboratory endpoints...');
  await testEndpoint('GET', '/laboratories');
  await testEndpoint('POST', '/laboratories', {
    name: 'Test Lab',
    address: '123 Lab St',
    phone: '+1234567890'
  }, authHeaders, 201);
  
  // Test 14: Lab Test endpoints
  console.log('Testing lab test endpoints...');
  await testEndpoint('GET', '/lab-tests');
  await testEndpoint('POST', '/lab-tests', {
    name: 'Blood Test',
    description: 'Complete blood count',
    price: 50
  }, authHeaders, 201);
  
  // Test 15: Package endpoints
  console.log('Testing package endpoints...');
  await testEndpoint('GET', '/packages');
  await testEndpoint('POST', '/packages', {
    name: 'Health Package',
    description: 'Complete health checkup',
    price: 200
  }, authHeaders, 201);
  
  // Test 16: Medical Record endpoints
  console.log('Testing medical record endpoints...');
  await testEndpoint('GET', '/medical-records', null, authHeaders);
  await testEndpoint('POST', '/medical-records', {
    recordType: 'Consultation',
    notes: 'Patient consultation notes'
  }, authHeaders, 201);
  
  // Test 17: Prescription endpoints
  console.log('Testing prescription endpoints...');
  await testEndpoint('GET', '/prescriptions', null, authHeaders);
  await testEndpoint('POST', '/prescriptions', {
    patientId: 1,
    doctorId: 1,
    medications: 'Paracetamol 500mg'
  }, authHeaders, 201);
  
  // Test 18: Notification endpoints
  console.log('Testing notification endpoints...');
  await testEndpoint('GET', '/notifications', null, authHeaders);
  await testEndpoint('POST', '/notifications', {
    title: 'Test Notification',
    message: 'This is a test notification'
  }, authHeaders, 201);
  
  // Test 19: Support endpoints
  console.log('Testing support endpoints...');
  await testEndpoint('GET', '/support');
  await testEndpoint('POST', '/support', {
    subject: 'Test Issue',
    message: 'This is a test support ticket'
  }, authHeaders, 201);
  
  // Test 20: FAQ endpoints
  console.log('Testing FAQ endpoints...');
  await testEndpoint('GET', '/faqs');
  await testEndpoint('POST', '/faqs', {
    question: 'Test Question',
    answer: 'Test Answer',
    category: 'General'
  }, authHeaders, 201);
  
  // Test 21: Analytics endpoints
  console.log('Testing analytics endpoints...');
  await testEndpoint('GET', '/analytics/dashboard', null, authHeaders);
  
  // Test 22: Upload endpoints
  console.log('Testing upload endpoints...');
  await testEndpoint('GET', '/uploads', null, authHeaders);
  
  // Test 23: System Settings endpoints
  console.log('Testing system settings endpoints...');
  await testEndpoint('GET', '/system-settings', null, authHeaders);
  
  // Test 24: Website Content endpoints
  console.log('Testing website content endpoints...');
  await testEndpoint('GET', '/website-content');
  await testEndpoint('POST', '/website-content', {
    page: 'home',
    content: 'Home page content'
  }, authHeaders, 201);
  
  // Test remaining endpoints...
  console.log('Testing remaining endpoints...');
  
  // Subscription endpoints
  await testEndpoint('GET', '/subscriptions');
  await testEndpoint('POST', '/subscriptions', {
    plan: 'basic',
    duration: 'monthly'
  }, authHeaders, 201);
  
  // Coupon endpoints
  await testEndpoint('GET', '/coupons');
  await testEndpoint('POST', '/coupons', {
    code: 'TEST10',
    discount: 10,
    type: 'percentage'
  }, authHeaders, 201);
  
  // Review endpoints
  await testEndpoint('GET', '/reviews');
  await testEndpoint('POST', '/reviews', {
    rating: 5,
    comment: 'Excellent service'
  }, authHeaders, 201);
  
  // Invoice endpoints
  await testEndpoint('GET', '/invoices', null, authHeaders);
  await testEndpoint('POST', '/invoices', {
    patientId: 1,
    amount: 100,
    items: 'Consultation fee'
  }, authHeaders, 201);
  
  // Chat endpoints
  await testEndpoint('GET', '/chat', null, authHeaders);
  await testEndpoint('POST', '/chat', {
    message: 'Hello',
    recipientId: 1
  }, authHeaders, 201);
  
  // Video Call endpoints
  await testEndpoint('GET', '/video-calls', null, authHeaders);
  await testEndpoint('POST', '/video-calls', {
    participantIds: [1, 2],
    scheduledTime: '2024-12-01T10:00:00Z'
  }, authHeaders, 201);
  
  // Treatment Category endpoints
  await testEndpoint('GET', '/treatment-categories');
  await testEndpoint('POST', '/treatment-categories', {
    name: 'General Medicine',
    description: 'General medical treatments'
  }, authHeaders, 201);
  
  // Doctor Schedule endpoints
  await testEndpoint('GET', '/doctor-schedules');
  await testEndpoint('POST', '/doctor-schedules', {
    doctorId: 1,
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  }, authHeaders, 201);
  
  // Staff endpoints
  await testEndpoint('GET', '/staff');
  await testEndpoint('POST', '/staff', {
    name: 'John Staff',
    role: 'Nurse',
    department: 'Emergency'
  }, authHeaders, 201);
  
  // Translation endpoints
  await testEndpoint('GET', '/translations');
  await testEndpoint('POST', '/translations', {
    key: 'welcome',
    language: 'es',
    value: 'Bienvenido'
  }, authHeaders, 201);
  
  // DNA Kit endpoints
  await testEndpoint('GET', '/dna-kits');
  await testEndpoint('POST', '/dna-kits', {
    kitType: 'Basic',
    description: 'Basic DNA analysis'
  }, authHeaders, 201);
  
  // Media endpoints
  await testEndpoint('GET', '/media');
  await testEndpoint('POST', '/media', {
    filename: 'test.jpg',
    type: 'image'
  }, authHeaders, 201);
  
  // Terms and Privacy endpoints
  await testEndpoint('GET', '/terms-privacy');
  await testEndpoint('POST', '/terms-privacy', {
    type: 'terms',
    content: 'Terms and conditions content'
  }, authHeaders, 201);
  
  // Audit Logs endpoints
  await testEndpoint('GET', '/audit-logs', null, authHeaders);
  
  // Integration endpoints
  await testEndpoint('GET', '/integrations');
  await testEndpoint('POST', '/integrations', {
    name: 'Test Integration',
    type: 'api',
    config: {}
  }, authHeaders, 201);
  
  // Generate final report
  generateReport();
}

function generateReport() {
  console.log('\n📊 COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed} ✅`);
  console.log(`Failed: ${results.failed} ❌`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
  
  console.log('\n📋 DETAILED RESULTS:');
  console.log('-'.repeat(50));
  
  results.details.forEach((test, index) => {
    const status = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${test.method} ${test.url} - ${test.message}`);
  });
  
  // Save report to file
  const reportData = {
    summary: {
      total: results.passed + results.failed,
      passed: results.passed,
      failed: results.failed,
      successRate: ((results.passed / (results.passed + results.failed)) * 100).toFixed(2)
    },
    details: results.details,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('comprehensive_test_report.json', JSON.stringify(reportData, null, 2));
  console.log('\n📄 Detailed report saved to: comprehensive_test_report.json');
}

// Run the tests
runComprehensiveTests().catch(console.error);