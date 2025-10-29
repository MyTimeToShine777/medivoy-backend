const express = require('express');
const faqController = require('../../controllers/faq.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create FAQ (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
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
  authMiddleware,
  authorizeMiddleware(['admin']),
  faqController.updateFAQ,
);

// Delete FAQ (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  faqController.deleteFAQ,
);

module.exports = router;