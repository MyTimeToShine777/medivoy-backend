# Database Seeders

This directory contains Sequelize seeders for populating the database with initial or test data.

## Running Seeders

### Run All Seeders
```bash
npx sequelize-cli db:seed:all
```

### Run Specific Seeder
```bash
npx sequelize-cli db:seed --seed seeder-filename.js
```

### Undo Last Seeder
```bash
npx sequelize-cli db:seed:undo
```

### Undo All Seeders
```bash
npx sequelize-cli db:seed:undo:all
```

### Create New Seeder
```bash
npx sequelize-cli seed:generate --name seeder-name
```

## Seeder Order

Seeders should be run in this order to respect foreign key constraints:

1. **01-users.js** - Create admin and test users
2. **02-treatment-categories.js** - Create treatment categories and subcategories
3. **03-hospitals.js** - Create sample hospitals
4. **04-doctors.js** - Create sample doctors
5. **05-patients.js** - Create sample patients
6. **06-treatments.js** - Create sample treatments
7. **07-packages.js** - Create sample medical packages
8. **08-insurance.js** - Create sample insurance plans
9. **09-subscription-plans.js** - Create subscription plans
10. **10-faqs.js** - Create FAQ entries

## Seeder Types

### Development Seeders
- Used for local development
- Contains realistic test data
- Can be run multiple times

### Production Seeders
- Used for initial production setup
- Contains essential data only (admin user, categories, etc.)
- Should be run only once

### Test Seeders
- Used for automated testing
- Contains minimal data for tests
- Cleaned up after tests

## Example Seeder

```javascript
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@medivoy.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@medivoy.com'
    }, {});
  }
};
```

## Best Practices

1. **Idempotent Seeders**: Make seeders safe to run multiple times
2. **Use Transactions**: Wrap seeder operations in transactions
3. **Handle Errors**: Properly handle and log errors
4. **Clean Data**: Provide clean, realistic data
5. **Document Dependencies**: Note any dependencies between seeders

## Environment-Specific Seeders

You can create environment-specific seeders:

```javascript
if (process.env.NODE_ENV === 'development') {
  // Development-only data
}

if (process.env.NODE_ENV === 'production') {
  // Production-only data
}
```

## Seeder Data Sources

Seeders can load data from:
- JSON files
- CSV files
- External APIs
- Faker.js for random data

## Important Notes

1. **Never seed sensitive data** in version control
2. Use environment variables for sensitive information
3. Test seeders in development before production
4. Keep seeders up to date with model changes
5. Document what each seeder does

## Production Deployment

For production:

1. Create minimal seeders for essential data only
2. Never include test/dummy data
3. Use strong passwords (from environment variables)
4. Verify data after seeding
5. Keep seeder logs for audit

## Faker.js Integration

For generating realistic test data:

```bash
npm install @faker-js/faker --save-dev
```

```javascript
const { faker } = require('@faker-js/faker');

const users = Array.from({ length: 10 }, () => ({
  email: faker.internet.email(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  // ...
}));
```

## Seeder Templates

Create seeder templates for common patterns:
- User creation
- Category/taxonomy creation
- Relationship creation
- Configuration data

## Testing Seeders

Test your seeders:

```bash
# Run seeders
npm run seed

# Verify data
npm run test:seeders

# Cleanup
npm run seed:undo
```

## Note

Seeders are optional but highly recommended for:
- Development environment setup
- Testing
- Demo/staging environments
- Initial production data

For this project, you can create seeders based on your specific needs and the data requirements of your application.