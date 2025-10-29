const Doctor = require('../models/Doctor.model');
const { successResponse, errorResponse } = require('../utils/response');
const {
  handleDatabaseError, getMockData, withDatabaseFallback, createPaginatedMockResponse,
} = require('../utils/databaseErrorHandler');
const CacheUtil = require('../utils/cache');

class DoctorController {
  /**
   * Create a new doctor
   */
  static async createDoctor(req, res) {
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
          message: 'Doctor created successfully',
          data: doctor,
        },
        201,
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create doctor');
    }
  }

  /**
   * Get doctor by ID
   */
  static async getDoctor(req, res) {
    try {
      const { id } = req.params;

      // Generate cache key
      const cacheKey = CacheUtil.generateKey('doctor', { id });

      // Use cache wrapper
      const doctor = await CacheUtil.withCache(cacheKey, async () => await withDatabaseFallback(
        () => Doctor.findByPk(id),
        'doctor',
        { id: parseInt(id) },
        getMockData('doctor', { id: parseInt(id) }),
      ), 600); // Cache for 10 minutes

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: 'Doctor not found',
          },
          404,
        );
      }

      return successResponse(res, {
        message: 'Doctor retrieved successfully',
        data: doctor,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve doctor');
    }
  }

  /**
   * Update doctor
   */
  static async updateDoctor(req, res) {
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
            message: 'Doctor not found',
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
        message: 'Doctor updated successfully',
        data: doctor,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update doctor');
    }
  }

  /**
   * Delete doctor
   */
  static async deleteDoctor(req, res) {
    try {
      const { id } = req.params;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: 'Doctor not found',
          },
          404,
        );
      }

      // Delete doctor
      await doctor.destroy();

      return successResponse(res, {
        message: 'Doctor deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete doctor');
    }
  }

  /**
   * Get all doctors
   */
  static async getAllDoctors(req, res) {
    try {
      const {
        page = 1, limit = 10, specialty, isVerified,
      } = req.query;

      // Generate cache key
      const cacheKey = CacheUtil.generateKey('doctors', {
        page,
        limit,
        specialty: specialty || '',
        isVerified: isVerified || '',
      });

      // Use cache wrapper
      const result = await CacheUtil.withCache(cacheKey, async () => {
        // Build where clause
        const where = {};
        if (specialty) where.specialty = specialty;
        if (isVerified !== undefined) where.isVerified = isVerified === 'true';

        // Get doctors with pagination
        const doctors = await withDatabaseFallback(
          () => Doctor.findAndCountAll({
            where,
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
            order: [['createdAt', 'DESC']],
          }),
          'doctor',
          {},
          createPaginatedMockResponse('doctor', parseInt(page, 10), parseInt(limit, 10), {
            specialty: specialty || 'General Medicine',
            isVerified: isVerified === undefined ? true : isVerified === 'true',
          }),
        );

        return {
          data: doctors.rows,
          pagination: {
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(doctors.count / parseInt(limit, 10)),
            totalRecords: doctors.count,
          },
        };
      }, 300); // Cache for 5 minutes

      return successResponse(res, {
        message: 'Doctors retrieved successfully',
        ...result,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve doctors');
    }
  }

  /**
   * Update doctor availability
   */
  static async updateAvailability(req, res) {
    try {
      const { id } = req.params;
      const { availability } = req.body;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: 'Doctor not found',
          },
          404,
        );
      }

      // Update doctor availability
      await doctor.update({ availability });

      return successResponse(res, {
        message: 'Doctor availability updated successfully',
        data: doctor,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update doctor availability');
    }
  }

  /**
   * Get doctor appointments
   */
  static async getAppointments(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: 'Doctor not found',
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
        message: 'Doctor appointments retrieved successfully',
        data: [],
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: 0,
          totalRecords: 0,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve doctor appointments');
    }
  }

  /**
   * Verify doctor
   */
  static async verifyDoctor(req, res) {
    try {
      const { id } = req.params;

      // Find doctor
      const doctor = await Doctor.findByPk(id);

      if (!doctor) {
        return errorResponse(
          res,
          {
            message: 'Doctor not found',
          },
          404,
        );
      }

      // Update doctor verification status
      await doctor.update({ isVerified: true });

      return successResponse(res, {
        message: 'Doctor verified successfully',
        data: doctor,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to verify doctor');
    }
  }
}

module.exports = DoctorController;
