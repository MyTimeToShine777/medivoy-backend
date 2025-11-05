module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create treatment categories
    const categories = [
      {
        name: 'Cardiology',
        slug: 'cardiology',
        description: 'Heart and cardiovascular system treatments',
        icon: 'heart',
        sort_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Orthopedics',
        slug: 'orthopedics',
        description: 'Bone, joint, and muscle treatments',
        icon: 'bone',
        sort_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Oncology',
        slug: 'oncology',
        description: 'Cancer diagnosis and treatment',
        icon: 'ribbon',
        sort_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Neurology',
        slug: 'neurology',
        description: 'Brain and nervous system treatments',
        icon: 'brain',
        sort_order: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Cosmetic Surgery',
        slug: 'cosmetic-surgery',
        description: 'Aesthetic and reconstructive procedures',
        icon: 'sparkles',
        sort_order: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Dental',
        slug: 'dental',
        description: 'Dental and oral health treatments',
        icon: 'tooth',
        sort_order: 6,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Ophthalmology',
        slug: 'ophthalmology',
        description: 'Eye care and vision treatments',
        icon: 'eye',
        sort_order: 7,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Fertility',
        slug: 'fertility',
        description: 'Reproductive health and fertility treatments',
        icon: 'baby',
        sort_order: 8,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('treatment_categories', categories, {});

    // Get inserted category IDs
    const insertedCategories = await queryInterface.sequelize.query(
      'SELECT id, slug FROM treatment_categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create subcategories
    const subcategories = [];

    // Cardiology subcategories
    const cardiologyId = insertedCategories.find(
      (c) => c.slug === 'cardiology'
    )?.id;
    if (cardiologyId) {
      subcategories.push(
        {
          category_id: cardiologyId,
          name: 'Heart Bypass Surgery',
          slug: 'heart-bypass-surgery',
          description: 'Coronary artery bypass grafting',
          sort_order: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: cardiologyId,
          name: 'Angioplasty',
          slug: 'angioplasty',
          description: 'Coronary angioplasty and stenting',
          sort_order: 2,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: cardiologyId,
          name: 'Heart Valve Replacement',
          slug: 'heart-valve-replacement',
          description: 'Surgical heart valve replacement',
          sort_order: 3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    // Orthopedics subcategories
    const orthopedicsId = insertedCategories.find(
      (c) => c.slug === 'orthopedics'
    )?.id;
    if (orthopedicsId) {
      subcategories.push(
        {
          category_id: orthopedicsId,
          name: 'Hip Replacement',
          slug: 'hip-replacement',
          description: 'Total hip arthroplasty',
          sort_order: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: orthopedicsId,
          name: 'Knee Replacement',
          slug: 'knee-replacement',
          description: 'Total knee arthroplasty',
          sort_order: 2,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: orthopedicsId,
          name: 'Spine Surgery',
          slug: 'spine-surgery',
          description: 'Spinal fusion and disc replacement',
          sort_order: 3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    // Cosmetic Surgery subcategories
    const cosmeticId = insertedCategories.find(
      (c) => c.slug === 'cosmetic-surgery'
    )?.id;
    if (cosmeticId) {
      subcategories.push(
        {
          category_id: cosmeticId,
          name: 'Rhinoplasty',
          slug: 'rhinoplasty',
          description: 'Nose reshaping surgery',
          sort_order: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: cosmeticId,
          name: 'Liposuction',
          slug: 'liposuction',
          description: 'Fat removal procedure',
          sort_order: 2,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: cosmeticId,
          name: 'Breast Augmentation',
          slug: 'breast-augmentation',
          description: 'Breast enhancement surgery',
          sort_order: 3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    // Dental subcategories
    const dentalId = insertedCategories.find((c) => c.slug === 'dental')?.id;
    if (dentalId) {
      subcategories.push(
        {
          category_id: dentalId,
          name: 'Dental Implants',
          slug: 'dental-implants',
          description: 'Permanent tooth replacement',
          sort_order: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: dentalId,
          name: 'Teeth Whitening',
          slug: 'teeth-whitening',
          description: 'Professional teeth bleaching',
          sort_order: 2,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: dentalId,
          name: 'Orthodontics',
          slug: 'orthodontics',
          description: 'Braces and teeth alignment',
          sort_order: 3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );
    }

    if (subcategories.length > 0) {
      await queryInterface.bulkInsert(
        'treatment_subcategories',
        subcategories,
        {}
      );
    }

    console.log(
      '✅ Treatment categories and subcategories created successfully'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('treatment_subcategories', null, {});
    await queryInterface.bulkDelete('treatment_categories', null, {});
  },
};
