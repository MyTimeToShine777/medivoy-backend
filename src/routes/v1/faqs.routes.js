const express = require('express');
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
