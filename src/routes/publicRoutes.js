'use strict';

import { Router } from 'express';
import DoctorController from '../controllers/DoctorController.js';
import TreatmentController from '../controllers/TreatmentController.js';
import HospitalController from '../controllers/HospitalController.js';
import SearchController from '../controllers/SearchController.js';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES - No Authentication Required
// ═══════════════════════════════════════════════════════════════════════════════

// Get all doctors (public listing)
router.get('/doctors', (req, res) => DoctorController.listDoctors(req, res));
router.get('/doctors/:doctorId', (req, res) => DoctorController.getDoctorById(req, res));

// Get all treatments (public listing)
router.get('/treatments', (req, res) => TreatmentController.listTreatments(req, res));
router.get('/treatments/:treatmentId', (req, res) => TreatmentController.getTreatmentById(req, res));

// Get all hospitals (public listing)
router.get('/hospitals', (req, res) => HospitalController.listHospitals(req, res));
router.get('/hospitals/:hospitalId', (req, res) => HospitalController.getHospitalById(req, res));

// Search endpoint
router.get('/search', (req, res) => SearchController.globalSearch(req, res));

export default router;