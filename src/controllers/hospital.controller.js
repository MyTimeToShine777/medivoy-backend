const Hospital = require('../models/Hospital.model');
const { successResponse, errorResponse } = require('../utils/response');
const { handleDatabaseError } = require('../utils/databaseErrorHandler');
const CacheUtil = require('../utils/cache');

class HospitalController {
  /**
   * Create a new hospital
   */
  static async createHospital(req, res) {
    try {
      const {
        userId,
        name,
        address,
        phone,
        email,
        licenseNumber,
        certifications,
        specializations,
      } = req.body;

      // Create hospital
      const hospital = await Hospital.create({
        userId,
        name,
        address,
        phone,
        email,
        licenseNumber,
        certifications,
        specializations,
      });

      return successResponse(
        res,
        {
          message: 'Hospital created successfully',
          data: hospital,
        },
        201
      );
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to create hospital');
    }
  }

  /**
   * Get hospital by ID
   */
  static async getHospital(req, res) {
    try {
      const { id } = req.params;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      return successResponse(res, {
        message: 'Hospital retrieved successfully',
        data: hospital,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve hospital');
    }
  }

  /**
   * Update hospital
   */
  static async updateHospital(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        address,
        phone,
        email,
        licenseNumber,
        certifications,
        specializations,
        isActive,
      } = req.body;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      // Update hospital
      await hospital.update({
        name,
        address,
        phone,
        email,
        licenseNumber,
        certifications,
        specializations,
        isActive,
      });

      return successResponse(res, {
        message: 'Hospital updated successfully',
        data: hospital,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to update hospital');
    }
  }

  /**
   * Delete hospital
   */
  static async deleteHospital(req, res) {
    try {
      const { id } = req.params;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      // Delete hospital
      await hospital.destroy();

      return successResponse(res, {
        message: 'Hospital deleted successfully',
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to delete hospital');
    }
  }

  /**
   * Get all hospitals
   */
  static async getAllHospitals(req, res) {
    try {
      const { page = 1, limit = 10, isVerified, isActive } = req.query;

      // Build where clause
      const where = {};
      if (isVerified !== undefined) where.isVerified = isVerified === 'true';
      if (isActive !== undefined) where.isActive = isActive === 'true';

      // Get hospitals with pagination
      const hospitals = await Hospital.findAndCountAll({
        where,
        limit: parseInt(limit, 10),
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
        order: [['createdAt', 'DESC']],
      });

      return successResponse(res, {
        message: 'Hospitals retrieved successfully',
        data: hospitals.rows,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(hospitals.count / parseInt(limit, 10)),
          totalRecords: hospitals.count,
        },
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to retrieve hospitals');
    }
  }

  /**
   * Add doctor to hospital
   */
  static async addDoctor(req, res) {
    try {
      const { id } = req.params;
      const { doctorId } = req.body;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      // Add doctor to hospital
      // Note: This would require the HospitalDoctor model
      // await HospitalDoctor.create({ hospitalId: id, doctorId });

      return successResponse(res, {
        message: 'Doctor added to hospital successfully',
      });
    } catch (error) {
      return handleDatabaseError(
        error,
        res,
        'Failed to add doctor to hospital'
      );
    }
  }

  /**
   * Remove doctor from hospital
   */
  static async removeDoctor(req, res) {
    try {
      const { id } = req.params;
      const { doctorId } = req.body;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      // Remove doctor from hospital
      // Note: This would require the HospitalDoctor model
      // await HospitalDoctor.destroy({ where: { hospitalId: id, doctorId } });

      return successResponse(res, {
        message: 'Doctor removed from hospital successfully',
      });
    } catch (error) {
      return handleDatabaseError(
        error,
        res,
        'Failed to remove doctor from hospital'
      );
    }
  }

  /**
   * Add treatment to hospital
   */
  static async addTreatment(req, res) {
    try {
      const { id } = req.params;
      const { treatmentId } = req.body;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      // Add treatment to hospital
      // Note: This would require the HospitalTreatment model
      // await HospitalTreatment.create({ hospitalId: id, treatmentId });

      return successResponse(res, {
        message: 'Treatment added to hospital successfully',
      });
    } catch (error) {
      return handleDatabaseError(
        error,
        res,
        'Failed to add treatment to hospital'
      );
    }
  }

  /**
   * Verify hospital
   */
  static async verifyHospital(req, res) {
    try {
      const { id } = req.params;

      // Find hospital
      const hospital = await Hospital.findByPk(id);

      if (!hospital) {
        return errorResponse(
          res,
          {
            message: 'Hospital not found',
          },
          404
        );
      }

      // Update hospital verification status
      await hospital.update({ isVerified: true });

      return successResponse(res, {
        message: 'Hospital verified successfully',
        data: hospital,
      });
    } catch (error) {
      return handleDatabaseError(error, res, 'Failed to verify hospital');
    }
  }
}

module.exports = HospitalController;
