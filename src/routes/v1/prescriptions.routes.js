const express = require('express');
const router = express.Router();
const prescriptionController = require('../../controllers/prescription.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, prescriptionController.getAllPrescriptions);
router.post('/', authenticate, authorize(['doctor']), prescriptionController.createPrescription);
router.get('/:id', authenticate, prescriptionController.getPrescription);
router.put('/:id', authenticate, authorize(['doctor']), prescriptionController.updatePrescription);
router.delete('/:id', authenticate, authorize(['doctor', 'admin']), prescriptionController.deletePrescription);
router.get('/patient/:patientId', authenticate, prescriptionController.getPatientPrescriptions);
router.get('/:id/pdf', authenticate, prescriptionController.generatePDF);

module.exports = router;
