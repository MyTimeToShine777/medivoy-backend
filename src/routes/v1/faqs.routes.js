const express = require('express');
const faqController = require('../../controllers/faq.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create FAQ (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  faqController.createFAQ,
);

// Get FAQ by ID (public access)
router.get(
  '/:id',
  faqController.getFAQ,
);

// Get all FAQs (public access)
router.get(
  '/',
  faqController.getAllFAQs,
);

// Get FAQs by category (public access)
router.get(
  '/category/:category',
  faqController.getFAQsByCategory,
);

// Update FAQ (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  faqController.updateFAQ,
);

// Delete FAQ (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  faqController.deleteFAQ,
);

module.exports = router;