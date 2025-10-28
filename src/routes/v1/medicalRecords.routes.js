const express = require('express');
const router = express.Router();
const medicalRecordController = require('../../controllers/medicalRecord.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, authorize(['doctor', 'admin']), medicalRecordController.getAllMedicalRecords);
router.post('/', authenticate, medicalRecordController.createMedicalRecord);
router.get('/:id', authenticate, medicalRecordController.getMedicalRecord);
router.get('/patient/:patientId', authenticate, medicalRecordController.getPatientMedicalRecords);
router.put('/:id', authenticate, medicalRecordController.updateMedicalRecord);
router.delete('/:id', authenticate, authorize(['admin']), medicalRecordController.deleteMedicalRecord);

module.exports = router;
