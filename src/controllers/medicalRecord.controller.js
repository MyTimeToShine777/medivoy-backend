const MedicalRecord = require("../models/MedicalRecord.model");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class MedicalRecordController {
  /**
   static async getAllMedicalRecords(req, res) {\n     try {\n       const { page = 1, limit = 10, recordType, patientId } = req.query;\n\n       // Build where clause\n       const where = {};\n       if (recordType) where.recordType = recordType;\n       if (patientId) where.patientId = patientId;\n\n       // Get medical records with pagination\n       const medicalRecords = await MedicalRecord.findAndCountAll({\n         where,\n         limit: parseInt(limit, 10),\n         offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),\n         order: [["recordDate", "DESC"]],\n       });\n\n       return successResponse(res, {\n         message: "Medical records retrieved successfully",\n         data: medicalRecords.rows,\n         pagination: {\n           currentPage: parseInt(page, 10),\n           totalPages: Math.ceil(medicalRecords.count / parseInt(limit, 10)),\n           totalRecords: medicalRecords.count,\n         },\n       });\n     } catch (error) {\n       logger.error("Get all medical records error:", error);\n       return errorResponse(res, {\n         message: "Failed to retrieve medical records",\n         error: error.message,\n       }, 500);\n     }\n   }\n
   * Create a new medical record
   */
  static async createMedicalRecord(req, res) {
    try {
      const {
        patientId,
        doctorId,
        hospitalId,
        recordType,
        recordDate,
        notes,
        fileUrl,
      } = req.body;

      // Create medical record
      const medicalRecord = await MedicalRecord.create({
        patientId,
        doctorId,
        hospitalId,
        recordType,
        recordDate,
        notes,
        fileUrl,
      });

      return successResponse(
        res,
        {
          message: "Medical record created successfully",
          data: medicalRecord,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get medical record by ID
   */
  static async getMedicalRecord(req, res) {
    try {
      const { id } = req.params;

      // Find medical record
      const medicalRecord = await MedicalRecord.findByPk(id);

      if (!medicalRecord) {
        return errorResponse(
          res,
          {
            message: "Medical record not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Medical record retrieved successfully",
        data: medicalRecord,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update medical record
   */
  static async updateMedicalRecord(req, res) {
    try {
      const { id } = req.params;
      const { recordType, recordDate, notes, fileUrl } = req.body;

      // Find medical record
      const medicalRecord = await MedicalRecord.findByPk(id);

      if (!medicalRecord) {
        return errorResponse(
          res,
          {
            message: "Medical record not found",
          },
          404,
        );
      }

      // Update medical record
      await medicalRecord.update({
        recordType,
        recordDate,
        notes,
        fileUrl,
      });

      return successResponse(res, {
        message: "Medical record updated successfully",
        data: medicalRecord,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete medical record
   */
  static async deleteMedicalRecord(req, res) {
    try {
      const { id } = req.params;

      // Find medical record
      const medicalRecord = await MedicalRecord.findByPk(id);

      if (!medicalRecord) {
        return errorResponse(
          res,
          {
            message: "Medical record not found",
          },
          404,
        );
      }

      // Delete medical record
      await medicalRecord.destroy();

      return successResponse(res, {
        message: "Medical record deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all medical records for a patient
   */
  static async getPatientMedicalRecords(req, res) {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 10, recordType } = req.query;

      // Build where clause
      const where = { patientId };
      if (recordType) where.recordType = recordType;

      // Get medical records with pagination
      const medicalRecords = await MedicalRecord.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["recordDate", "DESC"]],
      });

      return successResponse(res, {
        message: "Medical records retrieved successfully",
        data: medicalRecords.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(medicalRecords.count / parseInt(limit, 10)),
          totalRecords: medicalRecords.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = MedicalRecordController;
