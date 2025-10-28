const express = require('express');
const router = express.Router();
const insuranceController = require('../../controllers/insurance.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, insuranceController.getAllInsurance);
router.post('/', authenticate, insuranceController.createInsurance);
router.get('/:id', authenticate, insuranceController.getInsurance);
router.put('/:id', authenticate, insuranceController.updateInsurance);
router.delete('/:id', authenticate, authorize(['admin']), insuranceController.deleteInsurance);
router.post('/:id/verify', authenticate, authorize(['admin']), insuranceController.verifyInsurance);
router.post('/:id/check-coverage', authenticate, insuranceController.checkCoverage);

module.exports = router;
