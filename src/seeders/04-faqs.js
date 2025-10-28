'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const faqs = [
      {
        question: 'How do I book a medical treatment?',
        answer: 'To book a medical treatment, simply browse our treatment catalog, select your desired treatment, choose a hospital and doctor, and follow the booking process. You can also contact our support team for assistance.',
        category: 'booking',
        language: 'en',
        sort_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, and online payment methods through Stripe and Razorpay. All payments are secure and encrypted.',
        category: 'payment',
        language: 'en',
        sort_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'Can I cancel or reschedule my appointment?',
        answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time. Please note that cancellation policies may vary by hospital and doctor. Check your booking details for specific terms.',
        category: 'appointment',
        language: 'en',
        sort_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'How do I access my medical records?',
        answer: 'You can access all your medical records through your patient dashboard. Simply log in to your account and navigate to the "Medical Records" section. You can view, download, and share your records securely.',
        category: 'medical_records',
        language: 'en',
        sort_order: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'Is my personal and medical information secure?',
        answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. All information is stored securely and only accessible to authorized healthcare providers involved in your care.',
        category: 'security',
        language: 'en',
        sort_order: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'Do you accept insurance?',
        answer: 'Yes, we work with many insurance providers. You can check if your insurance is accepted by using our insurance verification tool. Simply enter your insurance details during the booking process.',
        category: 'insurance',
        language: 'en',
        sort_order: 6,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'How do video consultations work?',
        answer: 'Video consultations allow you to meet with doctors remotely. After booking, you will receive a link to join the video call at your scheduled time. Make sure you have a stable internet connection and a device with a camera.',
        category: 'consultation',
        language: 'en',
        sort_order: 7,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'What is included in a medical package?',
        answer: 'Medical packages typically include the treatment procedure, hospital stay, meals, airport transfers, and sometimes accommodation. Each package is different, so please review the specific inclusions and exclusions before booking.',
        category: 'packages',
        language: 'en',
        sort_order: 8,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'How do I get my prescription?',
        answer: 'After your consultation, your doctor will create a digital prescription that will be available in your account. You can view, download, and print it. Some prescriptions can also be sent directly to partner pharmacies.',
        category: 'prescription',
        language: 'en',
        sort_order: 9,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'What should I do if I need to contact support?',
        answer: 'You can contact our support team 24/7 through the support ticket system in your account, via email at support@medivoy.com, or by phone. We typically respond within 2-4 hours.',
        category: 'support',
        language: 'en',
        sort_order: 10,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'How do subscription plans work?',
        answer: 'Subscription plans give you access to discounted treatments, priority support, and other benefits. You can choose monthly or annual billing. All plans come with a free trial period.',
        category: 'subscription',
        language: 'en',
        sort_order: 11,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        question: 'Can I get a refund if I cancel my booking?',
        answer: 'Refund policies depend on when you cancel and the specific hospital/doctor policies. Generally, cancellations made 7+ days in advance receive full refunds, 3-7 days receive 50%, and less than 3 days may not be refundable.',
        category: 'refund',
        language: 'en',
        sort_order: 12,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('faqs', faqs, {});

    console.log('✅ FAQs created successfully');
    console.log('📚 12 FAQ entries created');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('faqs', null, {});
  }
};