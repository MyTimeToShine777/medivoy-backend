const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, '../src/routes/v1');

const routes = [
  {
    name: 'laboratories.routes.js',
    content: `const express = require('express');
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
`
  },
  {
    name: 'labTests.routes.js',
    content: `const express = require('express');
const router = express.Router();
const labTestController = require('../../controllers/labTest.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, labTestController.getAllLabTests);
router.post('/', authenticate, labTestController.createLabTest);
router.get('/:id', authenticate, labTestController.getLabTest);
router.put('/:id', authenticate, labTestController.updateLabTest);
router.patch('/:id/results', authenticate, authorize(['doctor', 'admin']), labTestController.updateLabTestResults);
router.delete('/:id', authenticate, authorize(['admin']), labTestController.deleteLabTest);

module.exports = router;
`
  },
  {
    name: 'invoices.routes.js',
    content: `const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/invoice.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, invoiceController.getAllInvoices);
router.post('/', authenticate, authorize(['admin']), invoiceController.createInvoice);
router.get('/:id', authenticate, invoiceController.getInvoice);
router.put('/:id', authenticate, authorize(['admin']), invoiceController.updateInvoice);
router.get('/:id/pdf', authenticate, invoiceController.generatePDF);
router.post('/:id/send-email', authenticate, authorize(['admin']), invoiceController.sendInvoiceEmail);
router.delete('/:id', authenticate, authorize(['admin']), invoiceController.deleteInvoice);

module.exports = router;
`
  },
  {
    name: 'packages.routes.js',
    content: `const express = require('express');
const router = express.Router();
const packageController = require('../../controllers/package.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', packageController.getAllPackages);
router.post('/', authenticate, authorize(['admin']), packageController.createPackage);
router.get('/:id', packageController.getPackage);
router.put('/:id', authenticate, authorize(['admin']), packageController.updatePackage);
router.delete('/:id', authenticate, authorize(['admin']), packageController.deletePackage);

module.exports = router;
`
  },
  {
    name: 'medicalRecords.routes.js',
    content: `const express = require('express');
const router = express.Router();
const medicalRecordController = require('../../controllers/medicalRecord.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, authorize(['doctor', 'admin']), medicalRecordController.getAllMedicalRecords);
router.post('/', authenticate, medicalRecordController.createMedicalRecord);
router.get('/:id', authenticate, medicalRecordController.getMedicalRecord);
router.get('/patient/:patientId', authenticate, medicalRecordController.getPatientMedicalRecords);
router.put('/:id', authenticate, medicalRecordController.updateMedicalRecord);
router.delete('/:id', authenticate, authorize(['admin']), medicalRecordController.deleteMedicalRecord);

module.exports = router;
`
  },
  {
    name: 'support.routes.js',
    content: `const express = require('express');
const router = express.Router();
const supportController = require('../../controllers/support.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, supportController.getAllTickets);
router.post('/', authenticate, supportController.createTicket);
router.get('/:id', authenticate, supportController.getTicket);
router.put('/:id', authenticate, supportController.updateTicket);
router.patch('/:id/status', authenticate, authorize(['admin']), supportController.updateTicketStatus);
router.post('/:id/reply', authenticate, supportController.addReply);
router.post('/:id/close', authenticate, authorize(['admin']), supportController.closeTicket);
router.delete('/:id', authenticate, authorize(['admin']), supportController.deleteTicket);

module.exports = router;
`
  },
  {
    name: 'subscriptions.routes.js',
    content: `const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/subscription.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, subscriptionController.getAllSubscriptions);
router.post('/', authenticate, subscriptionController.createSubscription);
router.get('/:id', authenticate, subscriptionController.getSubscription);
router.put('/:id', authenticate, subscriptionController.updateSubscription);
router.post('/:id/cancel', authenticate, subscriptionController.cancelSubscription);
router.post('/:id/renew', authenticate, subscriptionController.renewSubscription);
router.delete('/:id', authenticate, authorize(['admin']), subscriptionController.deleteSubscription);

module.exports = router;
`
  },
  {
    name: 'translations.routes.js',
    content: `const express = require('express');
const router = express.Router();
const translationController = require('../../controllers/translation.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', translationController.getAllTranslations);
router.get('/key', translationController.getTranslationByKey);
router.post('/', authenticate, authorize(['admin']), translationController.createTranslation);
router.post('/bulk', authenticate, authorize(['admin']), translationController.bulkCreateTranslations);
router.get('/:id', translationController.getTranslation);
router.put('/:id', authenticate, authorize(['admin']), translationController.updateTranslation);
router.delete('/:id', authenticate, authorize(['admin']), translationController.deleteTranslation);

module.exports = router;
`
  },
  {
    name: 'coupons.routes.js',
    content: `const express = require('express');
const router = express.Router();
const couponController = require('../../controllers/coupon.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, authorize(['admin']), couponController.getAllCoupons);
router.post('/', authenticate, authorize(['admin']), couponController.createCoupon);
router.post('/validate', authenticate, couponController.validateCoupon);
router.post('/apply', authenticate, couponController.applyCoupon);
router.get('/:id', authenticate, authorize(['admin']), couponController.getCoupon);
router.put('/:id', authenticate, authorize(['admin']), couponController.updateCoupon);
router.delete('/:id', authenticate, authorize(['admin']), couponController.deleteCoupon);

module.exports = router;
`
  },
  {
    name: 'faqs.routes.js',
    content: `const express = require('express');
const router = express.Router();
const faqController = require('../../controllers/faq.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', faqController.getAllFAQs);
router.get('/category/:category', faqController.getFAQsByCategory);
router.post('/', authenticate, authorize(['admin']), faqController.createFAQ);
router.post('/reorder', authenticate, authorize(['admin']), faqController.reorderFAQs);
router.get('/:id', faqController.getFAQ);
router.put('/:id', authenticate, authorize(['admin']), faqController.updateFAQ);
router.delete('/:id', authenticate, authorize(['admin']), faqController.deleteFAQ);

module.exports = router;
`
  },
  {
    name: 'websiteContent.routes.js',
    content: `const express = require('express');
const router = express.Router();
const websiteContentController = require('../../controllers/websiteContent.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', websiteContentController.getAllContent);
router.get('/slug/:slug', websiteContentController.getContentBySlug);
router.get('/type/:type', websiteContentController.getContentByType);
router.post('/', authenticate, authorize(['admin']), websiteContentController.createContent);
router.get('/:id', websiteContentController.getContent);
router.put('/:id', authenticate, authorize(['admin']), websiteContentController.updateContent);
router.post('/:id/publish', authenticate, authorize(['admin']), websiteContentController.publishContent);
router.post('/:id/unpublish', authenticate, authorize(['admin']), websiteContentController.unpublishContent);
router.delete('/:id', authenticate, authorize(['admin']), websiteContentController.deleteContent);

module.exports = router;
`
  },
  {
    name: 'treatmentCategories.routes.js',
    content: `const express = require('express');
const router = express.Router();
const treatmentCategoryController = require('../../controllers/treatmentCategory.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', treatmentCategoryController.getAllCategories);
router.post('/', authenticate, authorize(['admin']), treatmentCategoryController.createCategory);
router.get('/:id', treatmentCategoryController.getCategory);
router.put('/:id', authenticate, authorize(['admin']), treatmentCategoryController.updateCategory);
router.delete('/:id', authenticate, authorize(['admin']), treatmentCategoryController.deleteCategory);

module.exports = router;
`
  }
];

// Generate all route files
routes.forEach(route => {
  const filePath = path.join(routesDir, route.name);
  fs.writeFileSync(filePath, route.content);
  console.log(`✓ Created ${route.name}`);
});

console.log(`\n✓ Successfully generated ${routes.length} route files!`);