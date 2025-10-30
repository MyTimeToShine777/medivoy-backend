const express = require('express');
const websiteContentController = require('../../controllers/websiteContent.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create website content (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  websiteContentController.createContent,
);

// Get website content by ID (admin only)
router.get(
  '/:id',
  auth,
  authorize(['admin']),
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
  auth,
  authorize(['admin']),
  websiteContentController.updateContent,
);

// Delete website content (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  websiteContentController.deleteContent,
);

// Get all website content (public access)
router.get(

router.get('/:id', websiteContentController.getById);  '/',
  websiteContentController.getAllContent,
);

module.exports = router;
