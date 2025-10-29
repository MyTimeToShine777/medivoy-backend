const Doctor = require("../models/Doctor.model");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

class DoctorController {
  /**
   * Create a new doctor
   */
  async createDoctor(req, res) {
    try {
      const {
        userId,
        specialty,
        licenseNumber,
        yearsOfExperience,
        bio,
        education,
        certifications,
      } = req.body;

      // Create doctor
      const doctor = await Doctor.create({
        userId,
        specialty,
        licenseNumber,
        yearsOfExperience,
        bio,
        education,
        certifications,
      });

      return successResponse(
        res,
        {
          message: "Doctor created successfully",
          data: doctor,
        },
        201,
      );
    } catch (error) {
      logger.error("Create doctor error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to create doctor",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get doctor by ID
   */
  async getDoctor(req, res) {
    try {
      const { id } = req.params;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: "Doctor not found",
          },
          404,
        );
      }

      return successResponse(res, {
        message: "Doctor retrieved successfully",
        data: doctor,
      });
    } catch (error) {
      logger.error("Get doctor error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve doctor",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Update doctor
   */
  async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const {
        specialty,
        licenseNumber,
        yearsOfExperience,
        bio,
        education,
        certifications,
        availability,
      } = req.body;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: "Doctor not found",
          },
          404,
        );
      }

      // Update doctor
      await doctor.update({
        specialty,
        licenseNumber,
        yearsOfExperience,
        bio,
        education,
        certifications,
        availability,
      });

      return successResponse(res, {
        message: "Doctor updated successfully",
        data: doctor,
      });
    } catch (error) {
      logger.error("Update doctor error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to update doctor",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Delete doctor
   */
  async deleteDoctor(req, res) {
    try {
      const { id } = req.params;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: "Doctor not found",
          },
          404,
        );
      }

      // Delete doctor
      await doctor.destroy();

      return successResponse(res, {
        message: "Doctor deleted successfully",
      });
    } catch (error) {
      logger.error("Delete doctor error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to delete doctor",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get all doctors
   */
  async getAllDoctors(req, res) {
    try {
      const { page = 1, limit = 10, specialty, isVerified } = req.query;

      // Build where clause
      const where = {};
      if (specialty) where.specialty = specialty;
      if (isVerified !== undefined) where.isVerified = isVerified === "true";

      // Get doctors with pagination
      const doctors = await Doctor.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [["createdAt", "DESC"]],
      });

      return successResponse(res, {
        message: "Doctors retrieved successfully",
        data: doctors.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(doctors.count / parseInt(limit, 10)),
          totalRecords: doctors.count,
        },
      });
    } catch (error) {
      logger.error("Get all doctors error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve doctors",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Update doctor availability
   */
  async updateAvailability(req, res) {
    try {
      const { id } = req.params;
      const { availability } = req.body;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: "Doctor not found",
          },
          404,
        );
      }

      // Update doctor availability
      await doctor.update({ availability });

      return successResponse(res, {
        message: "Doctor availability updated successfully",
        data: doctor,
      });
    } catch (error) {
      logger.error("Update doctor availability error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to update doctor availability",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Get doctor appointments
   */
  async getAppointments(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: "Doctor not found",
          },
          404,
        );
      }

      // Build where clause for appointments
      const where = { doctorId: id };
      if (status) where.status = status;

      // Get doctor appointments with pagination
      // Note: This would require importing the Appointment model
      // const appointments = await Appointment.findAndCountAll({
      //   where,
      //   limit: parseInt(limit, 10),
      //   offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      //   order: [['scheduledAt', 'ASC']],
      // });

      return successResponse(res, {
        message: "Doctor appointments retrieved successfully",
        data: [],
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: 0,
          totalRecords: 0,
        },
      });
    } catch (error) {
      logger.error("Get doctor appointments error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to retrieve doctor appointments",
          error: error.message,
        },
        500,
      );
    }
  }

  /**
   * Verify doctor
   */
  async verifyDoctor(req, res) {
    try {
      const { id } = req.params;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: "Doctor not found",
          },
          404,
        );
      }

      // Update doctor verification status
      await doctor.update({ isVerified: true });

      return successResponse(res, {
        message: "Doctor verified successfully",
        data: doctor,
      });
    } catch (error) {
      logger.error("Verify doctor error:", error);
      return errorResponse(
        res,
        {
          message: "Failed to verify doctor",
          error: error.message,
        },
        500,
      );
    }
  }
}

module.exports = new DoctorController();
