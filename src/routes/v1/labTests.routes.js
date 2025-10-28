const express = require('express');
const router = express.Router();
const labTestController = require('../../controllers/labTest.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, labTestController.getAllLabTests);
router.post('/', authenticate, labTestController.createLabTest);
router.get('/:id', authenticate, labTestController.getLabTest);
router.put('/:id', authenticate, labTestController.updateLabTest);
router.patch('/:id/results', authenticate, authorize(['doctor', 'admin']), labTestController.updateLabTestResults);
router.delete('/:id', authenticate, authorize(['admin']), labTestController.deleteLabTest);

module.exports = router;
