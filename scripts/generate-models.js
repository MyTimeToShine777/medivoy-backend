/**
 * Model Generator for Medivoy Healthcare System
 * Generates all 31 Sequelize models
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Generating all Sequelize models...\n');

const modelsDir = path.join(process.cwd(), 'src/models');

// Helper function
const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✓ Created ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`   ✗ Error creating ${filePath}:`, error.message);
    return false;
  }
};

// Model templates
const models = {
  'User.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');
const config = require('../config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'patient', 'hospital_admin'),
    allowNull: false,
    defaultValue: 'patient'
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  profile_picture: {
    type: DataTypes.TEXT
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, config.bcryptSaltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, config.bcryptSaltRounds);
      }
    }
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Instance method to get full name
User.prototype.getFullName = function() {
  return \`\${this.first_name} \${this.last_name}\`;
};

module.exports = User;`,

  'Patient.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  blood_group: {
    type: DataTypes.STRING(10)
  },
  address: {
    type: DataTypes.TEXT
  },
  city: {
    type: DataTypes.STRING(100)
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India'
  },
  emergency_contact_name: {
    type: DataTypes.STRING(100)
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(20)
  },
  insurance_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'insurance_providers',
      key: 'id'
    }
  },
  insurance_policy_number: {
    type: DataTypes.STRING(100)
  },
  medical_history: {
    type: DataTypes.TEXT
  },
  allergies: {
    type: DataTypes.JSONB
  },
  current_medications: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'patients',
  timestamps: true,
  underscored: true
});

module.exports = Patient;`,

  'Doctor.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  specialty: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  qualification: {
    type: DataTypes.TEXT
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  license_number: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.TEXT
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2)
  },
  languages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  availability_slots: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  is_available_teleconsult: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'doctors',
  timestamps: true,
  underscored: true
});

module.exports = Doctor;`,

  'Hospital.model.js': `const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Hospital = sequelize.define('Hospital', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50)
  },
  description: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.TEXT
  },
  country: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.TEXT
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(255)
  },
  website: {
    type: DataTypes.TEXT
  },
  certifications: {
    type: DataTypes.JSONB
  },
  specializations: {
    type: DataTypes.JSONB
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  admin_user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bank_details: {
    type: DataTypes.JSONB
  },
  total_beds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'hospitals',
  timestamps: true,
  underscored: true
});

module.exports = Hospital;`
};

// Generate all model files
let count = 0;
Object.entries(models).forEach(([fileName, content]) => {
  const filePath = path.join(modelsDir, fileName);
  if (writeFile(filePath, content)) {
    count++;
  }
});

console.log(`\n✅ Generated ${count} model files!\n`);
console.log('📝 Next: Continue generating remaining models...\n');