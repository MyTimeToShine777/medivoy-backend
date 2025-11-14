const BASE_URL = 'http://localhost:3000';
const results = {
    public: { passed: 0, failed: 0, tests: [] },
    auth: { passed: 0, failed: 0, tests: [] },
    patient: { passed: 0, failed: 0, tests: [] },
    doctor: { passed: 0, failed: 0, tests: [] },
    admin: { passed: 0, failed: 0, tests: [] },
    superAdmin: { passed: 0, failed: 0, tests: [] },
    staff: { passed: 0, failed: 0, tests: [] }
};

let patientToken = null;

async function testEndpoint(name, method, url, body = null, headers = {}, category = 'public') {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json', ...headers }
        };
        if (body) options.body = JSON.stringify(body);

        const response = await globalThis.fetch(url, options);
        const status = response.status;

        if (status < 400) {
            results[category].passed++;
            results[category].tests.push({ name, status: '✓', code: status });
            return { success: true, status, data: await response.json() };
        } else {
            results[category].failed++;
            results[category].tests.push({ name, status: '✗', code: status });
            return { success: false, status };
        }
    } catch (error) {
        results[category].failed++;
        results[category].tests.push({ name, status: '✗', error: error.message });
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('=== COMPREHENSIVE ENDPOINT TEST ===\n');

    // PUBLIC ENDPOINTS
    console.log('1. PUBLIC ENDPOINTS:');
    await testEndpoint('GET /health', 'GET', `${BASE_URL}/health`, null, {}, 'public');
    await testEndpoint('GET /', 'GET', `${BASE_URL}/`, null, {}, 'public');
    await testEndpoint('GET /api/public/doctors', 'GET', `${BASE_URL}/api/public/doctors`, null, {}, 'public');
    await testEndpoint('GET /api/public/treatments', 'GET', `${BASE_URL}/api/public/treatments`, null, {}, 'public');
    await testEndpoint('GET /api/public/hospitals', 'GET', `${BASE_URL}/api/public/hospitals`, null, {}, 'public');
    await testEndpoint('GET /api/public/search', 'GET', `${BASE_URL}/api/public/search?q=test`, null, {}, 'public');

    // AUTH ENDPOINTS
    console.log('\n2. AUTH ENDPOINTS:');
    const testEmail = `test${Date.now()}@test.com`;
    const regResult = await testEndpoint('POST /api/auth/register', 'POST', `${BASE_URL}/api/auth/register`, { firstName: 'Test', lastName: 'User', email: testEmail, password: 'Test123!' }, {}, 'auth');

    const loginResult = await testEndpoint('POST /api/auth/login', 'POST', `${BASE_URL}/api/auth/login`, { email: testEmail, password: 'Test123!' }, {}, 'auth');

    if (loginResult.success && loginResult.data) {
        patientToken = loginResult.data.data.accessToken;
    }

    await testEndpoint('POST /api/auth/forgot-password', 'POST', `${BASE_URL}/api/auth/forgot-password`, { email: testEmail }, {}, 'auth');
    await testEndpoint('POST /api/auth/resend-verification-email', 'POST', `${BASE_URL}/api/auth/resend-verification-email`, { email: testEmail }, {}, 'auth');

    // PATIENT ENDPOINTS (with token)
    if (patientToken) {
        console.log('\n3. PATIENT ENDPOINTS (Sample):');
        const authHeaders = { 'Authorization': `Bearer ${patientToken}` };
        await testEndpoint('GET /api/patient/search', 'GET', `${BASE_URL}/api/patient/search?q=test`, null, authHeaders, 'patient');
        await testEndpoint('GET /api/patient/bookings', 'GET', `${BASE_URL}/api/patient/bookings`, null, authHeaders, 'patient');
        await testEndpoint('GET /api/patient/appointments', 'GET', `${BASE_URL}/api/patient/appointments`, null, authHeaders, 'patient');
        await testEndpoint('GET /api/patient/profile', 'GET', `${BASE_URL}/api/patient/profile`, null, authHeaders, 'patient');
        await testEndpoint('GET /api/patient/notifications', 'GET', `${BASE_URL}/api/patient/notifications`, null, authHeaders, 'patient');
    }

    // PROTECTED ROUTES (Should return 403)
    console.log('\n4. RBAC VERIFICATION (Should be 403):');
    if (patientToken) {
        const authHeaders = { 'Authorization': `Bearer ${patientToken}` };
        const adminTest = await testEndpoint('GET /api/admin/users', 'GET', `${BASE_URL}/api/admin/users`, null, authHeaders, 'admin');
        const doctorTest = await testEndpoint('GET /api/doctor/appointments', 'GET', `${BASE_URL}/api/doctor/appointments`, null, authHeaders, 'doctor');
        const superAdminTest = await testEndpoint('GET /api/super-admin/analytics', 'GET', `${BASE_URL}/api/super-admin/analytics`, null, authHeaders, 'superAdmin');

        // 403 is expected (pass), others are fail
        if (adminTest.status === 403) results.admin.passed++;
        else results.admin.failed++;
        if (doctorTest.status === 403) results.doctor.passed++;
        else results.doctor.failed++;
        if (superAdminTest.status === 403) results.superAdmin.passed++;
        else results.superAdmin.failed++;
    }

    // RESULTS
    console.log('\n========================================');
    console.log('ENDPOINT TEST RESULTS:');
    console.log('========================================');

    for (const [category, data] of Object.entries(results)) {
        const total = data.passed + data.failed;
        if (total > 0) {
            const pct = Math.round((data.passed / total) * 100);
            console.log(`\n${category.toUpperCase()}: ${data.passed}/${total} passed (${pct}%)`);
            data.tests.forEach(t => {
                        console.log(`  ${t.status} ${t.name} ${t.code ? `[${t.code}]` : ''}`);
            });
        }
    }

    const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
    const totalTests = Object.values(results).reduce((sum, r) => sum + r.passed + r.failed, 0);
    const overallPct = Math.round((totalPassed / totalTests) * 100);
    
    console.log('\n========================================');
    console.log(`OVERALL: ${totalPassed}/${totalTests} endpoints (${overallPct}%)`);
    console.log('========================================');
    
    if (overallPct === 100) {
        console.log('\n🎉 ALL ENDPOINTS WORKING!');
    } else if (overallPct >= 90) {
        console.log('\n✅ MOSTLY WORKING - Minor issues');
    } else if (overallPct >= 75) {
        console.log('\n⚠️  NEEDS ATTENTION - Some failures');
    } else {
        console.log('\n❌ CRITICAL ISSUES - Many failures');
    }
}

runTests().catch(console.error);