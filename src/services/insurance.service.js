const { Insurance } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class InsuranceService {
  async createInsurance(insuranceData) {
    try {
      const insurance = await Insurance.create(insuranceData);
      logger.info(`Insurance created: ${insurance.id}`);
      return insurance;
    } catch (error) {
      logger.error('Error creating insurance:', error);
      throw new AppError('Failed to create insurance', 500);
    }
  }

  async getInsuranceById(insuranceId) {
    const insurance = await Insurance.findByPk(insuranceId);
    
    if (!insurance) {
      throw new AppError('Insurance not found', 404);
    }
    
    return insurance;
  }

  async updateInsurance(insuranceId, updateData) {
    const insurance = await this.getInsuranceById(insuranceId);
    await insurance.update(updateData);
    logger.info(`Insurance updated: ${insuranceId}`);
    return insurance;
  }

  async deleteInsurance(insuranceId) {
    const insurance = await this.getInsuranceById(insuranceId);
    await insurance.destroy();
    logger.info(`Insurance deleted: ${insuranceId}`);
    return { message: 'Insurance deleted successfully' };
  }

  async getAllInsurance(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Insurance.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      insurance: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async verifyInsurance(insuranceId, verificationData) {
    const insurance = await this.getInsuranceById(insuranceId);
    await insurance.update({
      is_verified: true,
      verification_data: verificationData,
      verified_at: new Date()
    });
    logger.info(`Insurance verified: ${insuranceId}`);
    return insurance;
  }

  async checkCoverage(insuranceId, treatmentId) {
    const insurance = await this.getInsuranceById(insuranceId);
    
    // TODO: Implement actual coverage checking logic
    const coverage = {
      is_covered: true,
      coverage_percentage: 80,
      max_coverage_amount: insurance.coverage_limit
    };
    
    return coverage;
  }
}

module.exports = new InsuranceService();