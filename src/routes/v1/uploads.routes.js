const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');
const uploadMiddleware = require('../../middleware/upload.middleware');

const router = express.Router();

// Upload file (authenticated users)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadMiddleware,
  uploadController.uploadFile,
);

// Get media by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.getMedia,
);

// Update media (authenticated users)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.updateMedia,
);

// Delete media (authenticated users)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.deleteMedia,
);

// Get all media for an entity (authenticated users)
router.get(
  '/entity/:entityType/:entityId',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.getEntityMedia,
);

module.exports = router;