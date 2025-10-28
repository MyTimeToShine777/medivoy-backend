const express = require('express');
const router = express.Router();
const uploadController = require('../../controllers/upload.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.post('/single', authenticate, upload.single('file'), uploadController.uploadFile);
router.post('/multiple', authenticate, upload.array('files', 10), uploadController.uploadMultipleFiles);
router.get('/', authenticate, uploadController.getAllMedia);
router.get('/:id', authenticate, uploadController.getMedia);
router.delete('/:id', authenticate, uploadController.deleteFile);

module.exports = router;
