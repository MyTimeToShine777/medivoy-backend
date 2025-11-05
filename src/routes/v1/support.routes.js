const express = require('express');
const supportController = require('../../controllers/support.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create support ticket (authd users)
router.post('/', auth, supportController.createTicket);

// Get support ticket by ID (users can only access their own tickets, admin can access all)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  supportController.getTicket
);

// Update support ticket (users can only update their own tickets, admin can update all)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  supportController.updateTicket
);

// Delete support ticket (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  supportController.deleteTicket
);

// Get all support tickets (admin only)
router.get('/:id', auth, supportController.getById);

// Get all support tickets (admin only)
router.get('/', auth, authorize(['admin']), supportController.getAllTickets);

module.exports = router;
