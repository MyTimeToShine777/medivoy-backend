const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/subscription.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', authenticate, subscriptionController.getAllSubscriptions);
router.post('/', authenticate, subscriptionController.createSubscription);
router.get('/:id', authenticate, subscriptionController.getSubscription);
router.put('/:id', authenticate, subscriptionController.updateSubscription);
router.post('/:id/cancel', authenticate, subscriptionController.cancelSubscription);
router.post('/:id/renew', authenticate, subscriptionController.renewSubscription);
router.delete('/:id', authenticate, authorize(['admin']), subscriptionController.deleteSubscription);

module.exports = router;
