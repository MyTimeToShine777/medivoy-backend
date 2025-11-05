const express = require('express');
const invoiceController = require('../../controllers/invoice.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create invoice (admin, hospital admins)
router.post(
  '/',
  auth,
  authorize(['admin', 'hospital_admin']),
  invoiceController.createInvoice
);

// Get invoice by ID (authd users)
router.get(
  '/:id',
  auth,
  authorize(['admin', 'patient', 'doctor', 'hospital_admin']),
  invoiceController.getInvoice
);

// Update invoice (admin, hospital admins)
router.put(
  '/:id',
  auth,
  authorize(['admin', 'hospital_admin']),
  invoiceController.updateInvoice
);

// Delete invoice (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  invoiceController.deleteInvoice
);

// Get all invoices (admin, hospital admins)
router.get(
  '/',
  auth,
  authorize(['admin', 'hospital_admin']),
  invoiceController.getAllInvoices
);

module.exports = router;
