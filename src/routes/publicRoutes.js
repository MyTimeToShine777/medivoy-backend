'use strict';

import { Router } from 'express';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES - No Authentication Required
// ═══════════════════════════════════════════════════════════════════════════════

// Get all doctors (public listing)
router.get('/doctors', async(req, res) => {
    try {
        // TODO: Implement doctor listing
        res.status(200).json({
            success: true,
            message: 'Public doctors endpoint',
            data: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all treatments (public listing)
router.get('/treatments', async(req, res) => {
    try {
        // TODO: Implement treatment listing
        res.status(200).json({
            success: true,
            message: 'Public treatments endpoint',
            data: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all hospitals (public listing)
router.get('/hospitals', async(req, res) => {
    try {
        // TODO: Implement hospital listing
        res.status(200).json({
            success: true,
            message: 'Public hospitals endpoint',
            data: []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;