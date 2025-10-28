const express = require('express');
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
