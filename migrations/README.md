# Database Migrations

This directory contains Sequelize migrations for the PostgreSQL database.

## Running Migrations

### Install Sequelize CLI
```bash
npm install -g sequelize-cli
# or
pnpm add -g sequelize-cli
```

### Run All Migrations
```bash
npx sequelize-cli db:migrate
```

### Undo Last Migration
```bash
npx sequelize-cli db:migrate:undo
```

### Undo All Migrations
```bash
npx sequelize-cli db:migrate:undo:all
```

### Create New Migration
```bash
npx sequelize-cli migration:generate --name migration-name
```

## Migration Order

Migrations are executed in chronological order based on their timestamp prefix.

## Important Notes

1. **Never modify existing migrations** that have been run in production
2. Always create new migrations for schema changes
3. Test migrations in development before running in production
4. Keep migrations small and focused on a single change
5. Always provide both `up` and `down` methods

## Migration Files

The migrations will create all tables in the correct order, respecting foreign key dependencies:

1. Core tables (users, roles)
2. Profile tables (patients, doctors, hospitals)
3. Content tables (treatments, packages)
4. Transaction tables (bookings, appointments, payments)
5. Support tables (reviews, notifications, support tickets)
6. System tables (audit logs, sessions)

## Auto-Generation

You can auto-generate migrations from your models using:

```bash
npx sequelize-cli migration:generate --name create-all-tables
```

Then manually fill in the migration based on your models.

## Manual Migration Creation

For this project, migrations should be created manually to ensure proper:
- Foreign key constraints
- Indexes
- Default values
- Data types
- Constraints

## Production Deployment

Before deploying to production:

1. Backup your database
2. Test migrations in staging
3. Run migrations during maintenance window
4. Verify data integrity after migration
5. Keep rollback plan ready

## Sequelize Configuration

Make sure your `.sequelizerc` file is configured:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src/config', 'database.js'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/seeders'),
  'migrations-path': path.resolve('src/migrations')
};
```

## Example Migration

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      // ... other fields
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('users', ['email']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

## Note

For this project, since we're using Sequelize models with `sync()`, migrations are optional for development. However, they are **highly recommended** for production deployments to have better control over schema changes.

To generate migrations from existing models, you can use the `sequelize-auto-migrations` package or create them manually based on your model definitions.