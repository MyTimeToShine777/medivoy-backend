const express = require('express');
const router = express.Router();
const translationController = require('../../controllers/translation.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', translationController.getAllTranslations);
router.get('/key', translationController.getTranslationByKey);
router.post('/', authenticate, authorize(['admin']), translationController.createTranslation);
router.post('/bulk', authenticate, authorize(['admin']), translationController.bulkCreateTranslations);
router.get('/:id', translationController.getTranslation);
router.put('/:id', authenticate, authorize(['admin']), translationController.updateTranslation);
router.delete('/:id', authenticate, authorize(['admin']), translationController.deleteTranslation);

module.exports = router;
