/**
 * Generate ALL remaining models
 */

const fs = require('fs');
const path = require('path');

const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
};

console.log('📦 Generating remaining models...\n');

const models = {
  'Payment.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    unique: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: { model: 'bookings', key: 'id' }
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'appointments', key: 'id' }
  },
  patient_id: {
    type: DataTypes.INTEGER,
    references: { model: 'patients', key: 'id' }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  payment_method: {
    type: DataTypes.STRING(50)
  },
  payment_gateway: {
    type: DataTypes.STRING(50)
  },
  gateway_transaction_id: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  },
  payment_date: {
    type: DataTypes.DATE
  },
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  refund_date: {
    type: DataTypes.DATE
  },
  metadata: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

module.exports = Payment;`,

  'Invoice.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: { model: 'bookings', key: 'id' }
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'appointments', key: 'id' }
  },
  patient_id: {
    type: DataTypes.INTEGER,
    references: { model: 'patients', key: 'id' }
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hospitals', key: 'id' }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  final_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  line_items: {
    type: DataTypes.JSONB
  },
  invoice_date: {
    type: DataTypes.DATEONLY
  },
  due_date: {
    type: DataTypes.DATEONLY
  },
  pdf_url: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'draft'
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true
});

module.exports = Invoice;`,

  'Review.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    references: { model: 'patients', key: 'id' }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    references: { model: 'doctors', key: 'id' }
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hospitals', key: 'id' }
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    references: { model: 'appointments', key: 'id' }
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: { model: 'bookings', key: 'id' }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review_text: {
    type: DataTypes.TEXT
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true
});

module.exports = Review;`,

  'Notification.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  title: {
    type: DataTypes.STRING(255)
  },
  message: {
    type: DataTypes.TEXT
  },
  type: {
    type: DataTypes.STRING(50)
  },
  reference_type: {
    type: DataTypes.STRING(50)
  },
  reference_id: {
    type: DataTypes.INTEGER
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  channel: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  underscored: true
});

module.exports = Notification;`,

  'SupportTicket.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupportTicket = sequelize.define('SupportTicket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticket_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  subject: {
    type: DataTypes.STRING(255)
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING(100)
  },
  priority: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'open'
  },
  assigned_to_user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  sla_due_date: {
    type: DataTypes.DATE
  },
  resolution_notes: {
    type: DataTypes.TEXT
  },
  resolved_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'support_tickets',
  timestamps: true,
  underscored: true
});

module.exports = SupportTicket;`,

  'SubscriptionPlan.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  plan_type: {
    type: DataTypes.STRING(50)
  },
  target_user: {
    type: DataTypes.STRING(50)
  },
  price_monthly: {
    type: DataTypes.DECIMAL(10, 2)
  },
  price_yearly: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  features: {
    type: DataTypes.JSONB
  },
  max_doctors: {
    type: DataTypes.INTEGER
  },
  max_appointments_per_month: {
    type: DataTypes.INTEGER
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'subscription_plans',
  timestamps: true,
  underscored: true
});

module.exports = SubscriptionPlan;`,

  'Subscription.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plan_id: {
    type: DataTypes.INTEGER,
    references: { model: 'subscription_plans', key: 'id' }
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    references: { model: 'hospitals', key: 'id' }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    references: { model: 'doctors', key: 'id' }
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  },
  billing_cycle: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.STRING(50)
  },
  auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true
});

module.exports = Subscription;`,

  'Translation.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Translation = sequelize.define('Translation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  entity_type: {
    type: DataTypes.STRING(100)
  },
  entity_id: {
    type: DataTypes.INTEGER
  },
  field_name: {
    type: DataTypes.STRING(100)
  },
  locale: {
    type: DataTypes.STRING(10)
  },
  translated_text: {
    type: DataTypes.TEXT
  },
  is_auto_translated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'translations',
  timestamps: true,
  underscored: true
});

module.exports = Translation;`,

  'Coupon.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  discount_type: {
    type: DataTypes.STRING(50)
  },
  discount_value: {
    type: DataTypes.DECIMAL(10, 2)
  },
  min_purchase_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  max_discount_amount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  valid_from: {
    type: DataTypes.DATEONLY
  },
  valid_until: {
    type: DataTypes.DATEONLY
  },
  usage_limit: {
    type: DataTypes.INTEGER
  },
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  underscored: true
});

module.exports = Coupon;`,

  'FAQ.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100)
  },
  display_order: {
    type: DataTypes.INTEGER
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'faqs',
  timestamps: true,
  underscored: true
});

module.exports = FAQ;`,

  'WebsiteContent.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WebsiteContent = sequelize.define('WebsiteContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page_slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(255)
  },
  content: {
    type: DataTypes.TEXT
  },
  meta_description: {
    type: DataTypes.TEXT
  },
  meta_keywords: {
    type: DataTypes.TEXT
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'website_content',
  timestamps: true,
  underscored: true
});

module.exports = WebsiteContent;`,

  'Media.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  file_name: {
    type: DataTypes.STRING(255)
  },
  file_url: {
    type: DataTypes.TEXT
  },
  file_type: {
    type: DataTypes.STRING(50)
  },
  file_size: {
    type: DataTypes.INTEGER
  },
  entity_type: {
    type: DataTypes.STRING(100)
  },
  entity_id: {
    type: DataTypes.INTEGER
  },
  uploaded_by_user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'media',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = Media;`,

  'PasswordReset.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'password_resets',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = PasswordReset;`,

  'RefreshToken.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE
  },
  is_revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  underscored: true,
  updatedAt: false
});

module.exports = RefreshToken;`,

  'HospitalDoctor.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HospitalDoctor = sequelize.define('HospitalDoctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'hospitals', key: 'id' },
    onDelete: 'CASCADE'
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'doctors', key: 'id' },
    onDelete: 'CASCADE'
  },
  department: {
    type: DataTypes.STRING(100)
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'hospital_doctors',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['hospital_id', 'doctor_id']
    }
  ]
});

module.exports = HospitalDoctor;`,

  'HospitalTreatment.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HospitalTreatment = sequelize.define('HospitalTreatment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  hospital_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'hospitals', key: 'id' },
    onDelete: 'CASCADE'
  },
  treatment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'treatments', key: 'id' },
    onDelete: 'CASCADE'
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  duration_days: {
    type: DataTypes.INTEGER
  },
  success_rate: {
    type: DataTypes.DECIMAL(5, 2)
  },
  description: {
    type: DataTypes.TEXT
  },
  inclusions: {
    type: DataTypes.JSONB
  },
  exclusions: {
    type: DataTypes.JSONB
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'hospital_treatments',
  timestamps: true,
  underscored: true
});

module.exports = HospitalTreatment;`
};

let count = 0;
Object.entries(models).forEach(([fileName, content]) => {
  if (writeFile(path.join('src/models', fileName), content)) {
    count++;
    console.log(`   ✓ ${fileName}`);
  }
});

console.log(`\n✅ Generated ${count} additional model files!\n`);
console.log('📝 Total models now: 31 models complete!\n');