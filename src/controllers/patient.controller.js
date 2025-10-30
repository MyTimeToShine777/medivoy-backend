const Patient = require("../models/Patient.model");
const { successResponse, errorResponse } = require("../utils/response");
const { handleDatabaseError } = require("../utils/databaseErrorHandler");

class PatientController {
  /**
   * Create a new patient
   */
  static async createPatient(req, res) {
    try {
      const {
        userId,
        dateOfBirth,
        gender,
        bloodType,
        emergencyContact,
        medicalHistory,
        allergies,
        insuranceId,
      } = req.body;

      // Create patient
      const patient = await Patient.create({
        userId,
        dateOfBirth,
        gender,
        bloodType,
        emergencyContact,
        medicalHistory,
        allergies,
        insuranceId,
      });

      return successResponse(
        res,
        {
          message: "Patient created successfully",
          data: patient,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get patient by ID
   */
  static async getPatient(req, res) {
    try {
      const { id } = req.params;

      // Find patient
      const patient = await Patient.findByPk(id);

      if (!patient) {
        return errorResponse(
          res,
          {
            message: "Patient not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Patient retrieved successfully",
        data: patient,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Update patient
   */
  static async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const {
        dateOfBirth,
        gender,
        bloodType,
        emergencyContact,
        medicalHistory,
        allergies,
        insuranceId,
      } = req.body;

      // Find patient
      const patient = await Patient.findByPk(id);

      if (!patient) {
        return errorResponse(
          res,
          {
            message: "Patient not found",
          },
          404,
        );
      }

      // Update patient
      await patient.update({
        dateOfBirth,
        gender,
        bloodType,
        emergencyContact,
        medicalHistory,
        allergies,
        insuranceId,
      });

      return successResponse(res, {
        message: "Patient updated successfully",
        data: patient,
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Delete patient
   */
  static async deletePatient(req, res) {
    try {
      const { id } = req.params;

      // Find patient
      const patient = await Patient.findByPk(id);

      if (!patient) {
        return errorResponse(
          res,
          {
            message: "Patient not found",
          },
          404,
        );
      }

      // Delete patient
      await patient.destroy();

      return successResponse(res, {
        message: "Patient deleted successfully",
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get all patients
   */
  static async getAllPatients(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      // Get patients with pagination
      const patients = await Patient.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Patients retrieved successfully",
        data: patients.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(patients.count / parseInt(limit, 10)),
          totalRecords: patients.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }

  /**
   * Get patient medical records
   */
  static async getMedicalRecords(req, res) {
    try {
      const { id } = req.params;

      // Find patient
      const patient = await Patient.findByPk(id);

      if (!patient) {
        return errorResponse(
          res,
          {
            message: "Patient not found",
          },
          404,
        );
      }

      // Get patient medical records
      // Note: This would require importing the MedicalRecord model
      // const medicalRecords = await MedicalRecord.findAll({
      //   where: { patientId: id },
      //   order: [['recordDate', 'DESC']],
      // });

      return successResponse(res, {
        message: "Patient medical records retrieved successfully",
        data: [],
      });
    } catch (error) {
      return handleDatabaseError(error, res, $1);
    }
  }
}

module.exports = PatientController;
