const express = require('express');
const translationService = require('../../services/translation.service');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/authorize.middleware');

const router = express.Router();

// Create translation (admin only)
router.post(
  '/',
  auth,
  authorize(['admin']),
  async (req, res) => {
    try {
      const translation = await translationService.createTranslation(req.body);
      res.status(201).json({
        success: true,
        data: translation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Get translation by ID (admin only)
router.get(
  '/:id',
  auth,
  authorize(['admin']),
  async (req, res) => {
    try {
      const translation = await translationService.getTranslationById(req.params.id);
      if (!translation) {
        return res.status(404).json({
          success: false,
          message: 'Translation not found',
        });
      }
      res.json({
        success: true,
        data: translation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Update translation (admin only)
router.put(
  '/:id',
  auth,
  authorize(['admin']),
  async (req, res) => {
    try {
      const translation = await translationService.updateTranslation(req.params.id, req.body);
      res.json({
        success: true,
        data: translation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Delete translation (admin only)
router.delete(
  '/:id',
  auth,
  authorize(['admin']),
  async (req, res) => {
    try {
      await translationService.deleteTranslation(req.params.id);
      res.json({
        success: true,
        message: 'Translation deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Get all translations (public access)
router.get(
  '/',
  async (req, res) => {
    try {
      const translations = await translationService.getAllTranslations(req.query);
      res.json({
        success: true,
        data: translations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// Get translation by key and language (public access)
router.get(
  '/:key/:language',
  async (req, res) => {
    try {
      const translation = await translationService.getTranslationByKeyAndLanguage(
        req.params.key,
        req.params.language,
      );
      if (!translation) {
        return res.status(404).json({
          success: false,
          message: 'Translation not found',
        });
      }
      res.json({
        success: true,
        data: translation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

module.exports = router;
