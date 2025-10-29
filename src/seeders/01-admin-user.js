const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!@#', 12);

    // Create admin user
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@medivoy.com',
        password: hashedPassword,
        first_name: 'System',
        last_name: 'Administrator',
        phone: '+1234567890',
        role: 'admin',
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@medivoy.com');
    console.log('🔑 Password: Admin123!@#');
    console.log('⚠️  Please change the password after first login!');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@medivoy.com',
    }, {});
  },
};
