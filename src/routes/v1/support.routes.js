const express = require('express');
const supportController = require('../../controllers/support.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create support ticket (authenticated users)
router.post(
  '/',
  authMiddleware,
  supportController.createTicket,
);

// Get support ticket by ID (users can only access their own tickets, admin can access all)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  supportController.getTicket,
);

// Update support ticket (users can only update their own tickets, admin can update all)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  supportController.updateTicket,
);

// Delete support ticket (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  supportController.deleteTicket,
);

// Get all support tickets (admin only)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin']),
  supportController.getAllTickets,
);

module.exports = router;