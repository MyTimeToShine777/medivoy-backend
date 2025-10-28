const express = require('express');
const router = express.Router();
const websiteContentController = require('../../controllers/websiteContent.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', websiteContentController.getAllContent);
router.get('/slug/:slug', websiteContentController.getContentBySlug);
router.get('/type/:type', websiteContentController.getContentByType);
router.post('/', authenticate, authorize(['admin']), websiteContentController.createContent);
router.get('/:id', websiteContentController.getContent);
router.put('/:id', authenticate, authorize(['admin']), websiteContentController.updateContent);
router.post('/:id/publish', authenticate, authorize(['admin']), websiteContentController.publishContent);
router.post('/:id/unpublish', authenticate, authorize(['admin']), websiteContentController.unpublishContent);
router.delete('/:id', authenticate, authorize(['admin']), websiteContentController.deleteContent);

module.exports = router;
