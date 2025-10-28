const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/invoice.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, invoiceController.getAllInvoices);
router.post('/', authenticate, authorize(['admin']), invoiceController.createInvoice);
router.get('/:id', authenticate, invoiceController.getInvoice);
router.put('/:id', authenticate, authorize(['admin']), invoiceController.updateInvoice);
router.get('/:id/pdf', authenticate, invoiceController.generatePDF);
router.post('/:id/send-email', authenticate, authorize(['admin']), invoiceController.sendInvoiceEmail);
router.delete('/:id', authenticate, authorize(['admin']), invoiceController.deleteInvoice);

module.exports = router;
