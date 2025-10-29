const express = require('express');
const websiteContentController = require('../../controllers/websiteContent.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create website content (admin only)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  websiteContentController.createContent,
);

// Get website content by ID (admin only)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  websiteContentController.getContent,
);

// Get website content by slug (public access)
router.get(
  '/slug/:slug',
  websiteContentController.getContentBySlug,
);

// Update website content (admin only)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  websiteContentController.updateContent,
);

// Delete website content (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  websiteContentController.deleteContent,
);

// Get all website content (public access)
router.get(
  '/',
  websiteContentController.getAllContent,
);

module.exports = router;