const express = require('express');
const router = express.Router();
const laboratoryController = require('../../controllers/laboratory.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', laboratoryController.getAllLaboratories);
router.post('/', authenticate, authorize(['admin']), laboratoryController.createLaboratory);
router.get('/:id', laboratoryController.getLaboratory);
router.put('/:id', authenticate, authorize(['admin']), laboratoryController.updateLaboratory);
router.delete('/:id', authenticate, authorize(['admin']), laboratoryController.deleteLaboratory);

module.exports = router;
