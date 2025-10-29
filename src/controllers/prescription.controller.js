const Prescription = require('../models/Prescription.model');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class PrescriptionController {
  /**
   * Create a new prescription
   */
  async createPrescription(req, res) {
    try {
      const {
        appointmentId, doctorId, patientId, medications, dosage, duration, notes,
      } = req.body;

      // Create prescription
      const prescription = await Prescription.create({
        appointmentId,
        doctorId,
        patientId,
        medications,
        dosage,
        duration,
        notes,
      });

      return successResponse(res, {
        message: 'Prescription created successfully',
        data: prescription,
      }, 201);
    } catch (error) {
      logger.error('Create prescription error:', error);
      return errorResponse(res, {
        message: 'Failed to create prescription',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get prescription by ID
   */
  async getPrescription(req, res) {
    try {
      const { id } = req.params;

      // Find prescription
      const prescription = await Prescription.findByPk(id);

      if (!prescription) {
        return errorResponse(res, {
          message: 'Prescription not found',
        }, 404);
      }

      return successResponse(res, {
        message: 'Prescription retrieved successfully',
        data: prescription,
      });
    } catch (error) {
      logger.error('Get prescription error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve prescription',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Update prescription
   */
  async updatePrescription(req, res) {
    try {
      const { id } = req.params;
      const {
        medications, dosage, duration, notes, isFulfilled,
      } = req.body;

      // Find prescription
      const prescription = await Prescription.findByPk(id);

      if (!prescription) {
        return errorResponse(res, {
          message: 'Prescription not found',
        }, 404);
      }

      // Update prescription
      await prescription.update({
        medications,
        dosage,
        duration,
        notes,
        isFulfilled,
      });

      return successResponse(res, {
        message: 'Prescription updated successfully',
        data: prescription,
      });
    } catch (error) {
      logger.error('Update prescription error:', error);
      return errorResponse(res, {
        message: 'Failed to update prescription',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Delete prescription
   */
  async deletePrescription(req, res) {
    try {
      const { id } = req.params;

      // Find prescription
      const prescription = await Prescription.findByPk(id);

      if (!prescription) {
        return errorResponse(res, {
          message: 'Prescription not found',
        }, 404);
      }

      // Delete prescription
      await prescription.destroy();

      return successResponse(res, {
        message: 'Prescription deleted successfully',
      });
    } catch (error) {
      logger.error('Delete prescription error:', error);
      return errorResponse(res, {
        message: 'Failed to delete prescription',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Get all prescriptions for a patient
   */
  async getPatientPrescriptions(req, res) {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 10, isFulfilled } = req.query;

      // Build where clause
      const where = { patientId };
      if (isFulfilled !== undefined) where.isFulfilled = isFulfilled === 'true';

      // Get prescriptions with pagination
      const prescriptions = await Prescription.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Prescriptions retrieved successfully',
        data: prescriptions.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(prescriptions.count / parseInt(limit, 10)),
          totalRecords: prescriptions.count,
        },
      });
    } catch (error) {
      logger.error('Get patient prescriptions error:', error);
      return errorResponse(res, {
        message: 'Failed to retrieve prescriptions',
        error: error.message,
      }, 500);
    }
  }

  /**
   * Generate prescription PDF
   */
  async generatePrescriptionPDF(req, res) {
    try {
      const { id } = req.params;

      // Find prescription
      const prescription = await Prescription.findByPk(id);

      if (!prescription) {
        return errorResponse(res, {
          message: 'Prescription not found',
        }, 404);
      }

      // Generate PDF
      // Note: This would require integrating with PDF generation service
      const pdfUrl = `https://example.com/prescriptions/${id}.pdf`; // Placeholder

      // Update prescription with PDF URL
      await prescription.update({ pdfUrl });

      return successResponse(res, {
        message: 'Prescription PDF generated successfully',
        data: { pdfUrl },
      });
    } catch (error) {
      logger.error('Generate prescription PDF error:', error);
      return errorResponse(res, {
        message: 'Failed to generate prescription PDF',
        error: error.message,
      }, 500);
    }
  }
}

module.exports = new PrescriptionController();
