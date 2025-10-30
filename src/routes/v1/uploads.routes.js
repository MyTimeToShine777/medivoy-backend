const express = require('express');
const uploadController = require('../../controllers/upload.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');
const { uploadSingle } = require('../../middleware/upload.middleware');

const router = express.Router();

// Upload file (authd users)
router.post(
  '/',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadSingle('file'),
  uploadController.uploadFile,
);

// Get media by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.getMedia,
);

// Update media (authd users)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.updateMedia,
);

// Delete media (authd users)
router.delete(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.deleteMedia,
);

// Get all media for an entity (authd users)
router.get('/', auth, uploadController.getAll);  '/entity/:entityType/:entityId',

router.get('/:id', auth, uploadController.getById);

  // Get all media for an entity (authd users)
  router.get('/entity/:entityType/:entityId',
    auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  uploadController.getEntityMedia,
);

module.exports = router;
