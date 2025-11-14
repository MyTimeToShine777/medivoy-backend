'use strict';

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizationMiddleware as authorizeRole } from '../middleware/authorization.middleware.js';

// Import all routes
import authRoutes from './authRoutes.js';
import superAdminRoutes from './superAdminRoutes.js';
import adminRoutes from './adminRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import patientRoutes from './patientRoutes.js';
import staffRoutes from './staffRoutes.js';
import publicRoutes from './publicRoutes.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
    return res.status(200).json({ success: true, message: 'API is running' });
});

// Public Routes (No Authentication)
router.use('/api/public', publicRoutes);

// Authentication Routes
router.use('/api/auth', authRoutes);

// Role-Based Protected Routes
router.use('/api/super-admin', authenticateToken, authorizeRole('super_admin'), superAdminRoutes);
router.use('/api/admin', authenticateToken, authorizeRole('admin'), adminRoutes);
router.use('/api/doctor', authenticateToken, authorizeRole('doctor'), doctorRoutes);
router.use('/api/patient', authenticateToken, authorizeRole('patient'), patientRoutes);
router.use('/api/staff', authenticateToken, authorizeRole('staff'), staffRoutes);

// 404 Handler
router.use((req, res) => {
    return res.status(404).json({ success: false, error: 'Route not found' });
});

export default router;