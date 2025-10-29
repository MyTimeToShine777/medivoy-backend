const express = require('express');
const invoiceController = require('../../controllers/invoice.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeMiddleware = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create invoice (admin, hospital admins)
router.post(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  invoiceController.createInvoice,
);

// Get invoice by ID (authenticated users)
router.get(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'patient', 'doctor', 'hospital_admin']),
  invoiceController.getInvoice,
);

// Update invoice (admin, hospital admins)
router.put(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  invoiceController.updateInvoice,
);

// Delete invoice (admin only)
router.delete(
  '/:id',
  authMiddleware,
  authorizeMiddleware(['admin']),
  invoiceController.deleteInvoice,
);

// Get all invoices (admin, hospital admins)
router.get(
  '/',
  authMiddleware,
  authorizeMiddleware(['admin', 'hospital_admin']),
  invoiceController.getAllInvoices,
);

module.exports = router;