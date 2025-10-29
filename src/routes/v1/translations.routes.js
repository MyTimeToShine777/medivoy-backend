const express = require('express');
const translationController = require('../../controllers/translation.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create translation (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  translationController.createTranslation,
);

// Get translation by ID (admin only)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  translationController.getTranslation,
);

// Update translation (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  translationController.updateTranslation,
);

// Delete translation (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  translationController.deleteTranslation,
);

// Get all translations (public access)
router.get(
  '/',
  translationController.getAllTranslations,
);

// Get translation by key and language (public access)
router.get(
  '/:key/:language',
  translationController.getTranslationByKeyAndLanguage,
);

module.exports = router;