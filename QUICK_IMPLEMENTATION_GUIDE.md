# Quick Implementation Guide - Completing the Remaining 35%

This guide provides step-by-step instructions to complete the remaining components of the Medivoy Healthcare Backend API.

---

## 📋 Table of Contents

1. [Remaining Services & Controllers](#1-remaining-services--controllers)
2. [Validators](#2-validators)
3. [Background Jobs](#3-background-jobs)
4. [Database Migrations](#4-database-migrations)
5. [Seed Files](#5-seed-files)
6. [Testing](#6-testing)

---

## 1. Remaining Services & Controllers

### Services to Create

Create these service files in `src/services/`:

#### 1.1 laboratory.service.js
```javascript
const { Laboratory } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class LaboratoryService {
  async createLaboratory(data) {
    const laboratory = await Laboratory.create(data);
    logger.info(`Laboratory created: ${laboratory.id}`);
    return laboratory;
  }

  async getLaboratoryById(id) {
    const laboratory = await Laboratory.findByPk(id);
    if (!laboratory) throw new AppError('Laboratory not found', 404);
    return laboratory;
  }

  async getAllLaboratories(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Laboratory.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { laboratories: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateLaboratory(id, data) {
    const laboratory = await this.getLaboratoryById(id);
    await laboratory.update(data);
    return laboratory;
  }

  async deleteLaboratory(id) {
    const laboratory = await this.getLaboratoryById(id);
    await laboratory.destroy();
    return { message: 'Laboratory deleted successfully' };
  }
}

module.exports = new LaboratoryService();
```

#### 1.2 invoice.service.js
```javascript
const { Invoice, Payment, Booking } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateInvoiceNumber } = require('../utils/helpers');
const logger = require('../utils/logger');

class InvoiceService {
  async createInvoice(data) {
    const invoice_number = generateInvoiceNumber();
    const invoice = await Invoice.create({ ...data, invoice_number });
    logger.info(`Invoice created: ${invoice.id}`);
    return invoice;
  }

  async getInvoiceById(id) {
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Booking, as: 'booking' },
        { model: Payment, as: 'payment' }
      ]
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }

  async getAllInvoices(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Invoice.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [{ model: Booking, as: 'booking' }],
      order: [['created_at', 'DESC']]
    });
    return { invoices: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async generatePDF(id) {
    const invoice = await this.getInvoiceById(id);
    // TODO: Implement PDF generation
    logger.info(`Generating PDF for invoice: ${id}`);
    return { message: 'PDF generation not yet implemented', invoice };
  }
}

module.exports = new InvoiceService();
```

### Controllers to Create

Create corresponding controllers in `src/controllers/`:

#### Example: laboratory.controller.js
```javascript
const laboratoryService = require('../services/laboratory.service');
const { successResponse } = require('../utils/response');

class LaboratoryController {
  async createLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.createLaboratory(req.body);
      return successResponse(res, laboratory, 'Laboratory created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.getLaboratoryById(req.params.id);
      return successResponse(res, laboratory, 'Laboratory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllLaboratories(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await laboratoryService.getAllLaboratories(filters, { page, limit });
      return successResponse(res, result, 'Laboratories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateLaboratory(req, res, next) {
    try {
      const laboratory = await laboratoryService.updateLaboratory(req.params.id, req.body);
      return successResponse(res, laboratory, 'Laboratory updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLaboratory(req, res, next) {
    try {
      const result = await laboratoryService.deleteLaboratory(req.params.id);
      return successResponse(res, result, 'Laboratory deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LaboratoryController();
```

### Routes to Create

Create route files in `src/routes/v1/`:

#### Example: laboratories.routes.js
```javascript
const express = require('express');
const router = express.Router();
const laboratoryController = require('../../controllers/laboratory.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', laboratoryController.getAllLaboratories);
router.post('/', authenticate, authorize(['admin']), laboratoryController.createLaboratory);
router.get('/:id', laboratoryController.getLaboratory);
router.put('/:id', authenticate, authorize(['admin']), laboratoryController.updateLaboratory);
router.delete('/:id', authenticate, authorize(['admin']), laboratoryController.deleteLaboratory);

module.exports = router;
```

---

## 2. Validators

Create validator files in `src/validators/`:

### Example: auth.validator.js
```javascript
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain uppercase, lowercase, number and special character'),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('patient', 'doctor', 'hospital_admin').required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
```

### Using Validators in Routes

Update routes to use validators:

```javascript
const { validateRequest } = require('../../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../../validators/auth.validator');

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
```

---

## 3. Background Jobs

### Setup Bull Queue

Install Bull:
```bash
pnpm add bull
```

Create queue configuration in `src/config/queue.js`:
```javascript
const Queue = require('bull');
const config = require('./index');

const emailQueue = new Queue('email', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  }
});

const smsQueue = new Queue('sms', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  }
});

const notificationQueue = new Queue('notification', {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  }
});

module.exports = {
  emailQueue,
  smsQueue,
  notificationQueue
};
```

### Create Job Workers

Create in `src/jobs/`:

#### email.job.js
```javascript
const { emailQueue } = require('../config/queue');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

emailQueue.process(async (job) => {
  const { to, subject, html, attachments } = job.data;
  
  try {
    await emailService.sendEmail(to, subject, html, attachments);
    logger.info(`Email sent successfully: ${job.id}`);
    return { success: true };
  } catch (error) {
    logger.error(`Email job failed: ${job.id}`, error);
    throw error;
  }
});

emailQueue.on('completed', (job) => {
  logger.info(`Email job completed: ${job.id}`);
});

emailQueue.on('failed', (job, err) => {
  logger.error(`Email job failed: ${job.id}`, err);
});

module.exports = emailQueue;
```

### Start Workers

Create `src/jobs/index.js`:
```javascript
require('./email.job');
require('./sms.job');
require('./notification.job');

console.log('Background job workers started');
```

Update `src/server.js` to start workers:
```javascript
// Start background jobs
require('./jobs');
```

---

## 4. Database Migrations

Create migrations in `migrations/`:

### Example: 001-create-users-table.js
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'patient', 'doctor', 'hospital_admin'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

### Run Migrations

Add to `package.json`:
```json
{
  "scripts": {
    "migrate": "sequelize-cli db:migrate",
    "migrate:undo": "sequelize-cli db:migrate:undo"
  }
}
```

---

## 5. Seed Files

Create seed files in `seeds/`:

### Example: 001-admin-user.js
```javascript
'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      email: 'admin@medivoy.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { email: 'admin@medivoy.com' });
  }
};
```

### Run Seeds

```bash
pnpm run seed
```

---

## 6. Testing

### Setup Jest

Install dependencies:
```bash
pnpm add -D jest supertest @types/jest
```

Configure Jest in `package.json`:
```json
{
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"]
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Example Test: auth.test.js

Create in `tests/integration/`:

```javascript
const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

describe('Auth API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User',
          role: 'patient'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not register with invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User',
          role: 'patient'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
```

### Run Tests

```bash
pnpm test
```

---

## 🎯 Quick Checklist

Use this checklist to track your progress:

### Services & Controllers
- [ ] Laboratory service & controller
- [ ] LabTest service & controller
- [ ] Invoice service & controller
- [ ] Package service & controller
- [ ] MedicalRecord service & controller
- [ ] Support service & controller
- [ ] Subscription service & controller
- [ ] Translation service & controller
- [ ] Analytics service & controller
- [ ] Dashboard service & controller
- [ ] Coupon service & controller
- [ ] FAQ service & controller
- [ ] WebsiteContent service & controller
- [ ] TreatmentCategory service & controller

### Validators
- [ ] Auth validator
- [ ] User validator
- [ ] Hospital validator
- [ ] Doctor validator
- [ ] Patient validator
- [ ] Treatment validator
- [ ] Booking validator
- [ ] Appointment validator
- [ ] Payment validator
- [ ] Review validator

### Background Jobs
- [ ] Email queue worker
- [ ] SMS queue worker
- [ ] Push notification worker
- [ ] Appointment reminder job
- [ ] Payment reminder job
- [ ] Subscription renewal job
- [ ] Cleanup job

### Database
- [ ] Create all migrations
- [ ] Run migrations
- [ ] Create seed files
- [ ] Run seeds

### Testing
- [ ] Setup Jest
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Achieve 80%+ coverage

---

## 📚 Additional Resources

- **Sequelize Migrations**: https://sequelize.org/docs/v6/other-topics/migrations/
- **Bull Queue**: https://github.com/OptimalBits/bull
- **Joi Validation**: https://joi.dev/api/
- **Jest Testing**: https://jestjs.io/docs/getting-started
- **Supertest**: https://github.com/visionmedia/supertest

---

## 💡 Tips

1. **Follow the Pattern**: Use existing services/controllers as templates
2. **Test as You Go**: Write tests for each new feature
3. **Use Generation Scripts**: Modify existing scripts to generate boilerplate
4. **Keep It Simple**: Start with basic CRUD, add complexity later
5. **Document Everything**: Update Swagger docs for new endpoints

---

## 🚀 Estimated Timeline

- **Day 1-2**: Complete remaining services & controllers (8-10 hours)
- **Day 3**: Add validators (4-5 hours)
- **Day 4**: Setup background jobs (4-5 hours)
- **Day 5**: Create migrations & seeds (4-5 hours)
- **Day 6-7**: Write tests (8-10 hours)

**Total**: 28-35 hours of focused development

---

Good luck completing the Medivoy Healthcare Backend API! 🎉