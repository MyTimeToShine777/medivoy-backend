const express = require('express');
const router = express.Router();
const supportController = require('../../controllers/support.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, supportController.getAllTickets);
router.post('/', authenticate, supportController.createTicket);
router.get('/:id', authenticate, supportController.getTicket);
router.put('/:id', authenticate, supportController.updateTicket);
router.patch('/:id/status', authenticate, authorize(['admin']), supportController.updateTicketStatus);
router.post('/:id/reply', authenticate, supportController.addReply);
router.post('/:id/close', authenticate, authorize(['admin']), supportController.closeTicket);
router.delete('/:id', authenticate, authorize(['admin']), supportController.deleteTicket);

module.exports = router;
