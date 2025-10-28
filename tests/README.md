# Tests

This directory contains all tests for the Medivoy Healthcare Backend API.

## Test Structure

```
tests/
├── unit/           # Unit tests for individual functions/methods
├── integration/    # Integration tests for API endpoints
├── e2e/           # End-to-end tests for complete workflows
└── setup.js       # Test setup and configuration
```

## Running Tests

### Install Test Dependencies
```bash
pnpm add -D jest supertest @faker-js/faker
```

### Run All Tests
```bash
npm test
# or
pnpm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run E2E Tests Only
```bash
npm run test:e2e
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Configuration

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ],
    "testMatch": [
      "**/__tests__/**/*.js",
      "**/?(*.)+(spec|test).js"
    ]
  }
}
```

## Writing Tests

### Unit Test Example

```javascript
// tests/unit/helpers.test.js
const { generateBookingNumber } = require('../../src/utils/helpers');

describe('Helpers', () => {
  describe('generateBookingNumber', () => {
    it('should generate a booking number', () => {
      const bookingNumber = generateBookingNumber();
      expect(bookingNumber).toMatch(/^BK-\d{10}$/);
    });

    it('should generate unique booking numbers', () => {
      const number1 = generateBookingNumber();
      const number2 = generateBookingNumber();
      expect(number1).not.toBe(number2);
    });
  });
});
```

### Integration Test Example

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User',
          role: 'patient'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return error for duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User',
          role: 'patient'
        });

      // Try to register with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User',
          role: 'patient'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### E2E Test Example

```javascript
// tests/e2e/booking-flow.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('Complete Booking Flow', () => {
  let authToken;
  let patientId;
  let bookingId;

  beforeAll(async () => {
    // Register and login
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'patient@example.com',
        password: 'Password123!',
        first_name: 'Test',
        last_name: 'Patient',
        role: 'patient'
      });

    authToken = registerResponse.body.data.token;
    patientId = registerResponse.body.data.user.id;
  });

  it('should complete full booking workflow', async () => {
    // 1. Create booking
    const bookingResponse = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        patient_id: patientId,
        treatment_id: 1,
        hospital_id: 1,
        preferred_date: '2024-12-25'
      });

    expect(bookingResponse.status).toBe(201);
    bookingId = bookingResponse.body.data.id;

    // 2. Update booking status
    const statusResponse = await request(app)
      .patch(`/api/v1/bookings/${bookingId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'confirmed'
      });

    expect(statusResponse.status).toBe(200);

    // 3. Get booking details
    const detailsResponse = await request(app)
      .get(`/api/v1/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(detailsResponse.status).toBe(200);
    expect(detailsResponse.body.data.status).toBe('confirmed');
  });
});
```

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after tests
3. **Mocking**: Mock external services and APIs
4. **Coverage**: Aim for >80% code coverage
5. **Naming**: Use descriptive test names
6. **Assertions**: Use clear, specific assertions
7. **Setup/Teardown**: Use beforeAll, afterAll, beforeEach, afterEach

## Test Database

Use a separate test database:

```javascript
// tests/setup.js
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'medivoy_test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/medivoy_test';
```

## Mocking

### Mock External Services

```javascript
jest.mock('../../src/services/email.service', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));
```

### Mock Database

```javascript
jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));
```

## Coverage Reports

Coverage reports will be generated in the `coverage/` directory:

```
coverage/
├── lcov-report/    # HTML coverage report
├── lcov.info       # LCOV format
└── coverage.json   # JSON format
```

View HTML report:
```bash
open coverage/lcov-report/index.html
```

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Test Data

Use Faker.js for generating test data:

```javascript
const { faker } = require('@faker-js/faker');

const testUser = {
  email: faker.internet.email(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  phone: faker.phone.number()
};
```

## Debugging Tests

Run tests with debugging:

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Test Checklist

Before committing:
- [ ] All tests pass
- [ ] New features have tests
- [ ] Coverage is maintained/improved
- [ ] No console.log statements
- [ ] Tests are independent
- [ ] Test data is cleaned up

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

## Note

Tests are currently not implemented but the structure is ready. You can start writing tests following the examples and best practices above.

Priority test areas:
1. Authentication and authorization
2. CRUD operations for all resources
3. Workflow state transitions
4. Payment processing
5. File uploads
6. Background jobs
7. Error handling