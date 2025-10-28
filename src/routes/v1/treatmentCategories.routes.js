const express = require('express');
const router = express.Router();
const treatmentCategoryController = require('../../controllers/treatmentCategory.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

router.get('/', treatmentCategoryController.getAllCategories);
router.post('/', authenticate, authorize(['admin']), treatmentCategoryController.createCategory);
router.get('/:id', treatmentCategoryController.getCategory);
router.put('/:id', authenticate, authorize(['admin']), treatmentCategoryController.updateCategory);
router.delete('/:id', authenticate, authorize(['admin']), treatmentCategoryController.deleteCategory);

module.exports = router;
