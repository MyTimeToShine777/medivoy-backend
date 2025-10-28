const { Laboratory, LabTest } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class LaboratoryService {
  async createLaboratory(data) {
    try {
      const laboratory = await Laboratory.create(data);
      logger.info(`Laboratory created: ${laboratory.id}`);
      return laboratory;
    } catch (error) {
      logger.error('Error creating laboratory:', error);
      throw new AppError('Failed to create laboratory', 500);
    }
  }

  async getLaboratoryById(id) {
    const laboratory = await Laboratory.findByPk(id, {
      include: [{ model: LabTest, as: 'lab_tests' }]
    });
    if (!laboratory) throw new AppError('Laboratory not found', 404);
    return laboratory;
  }

  async getAllLaboratories(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Laboratory.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    return { laboratories: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateLaboratory(id, data) {
    const laboratory = await this.getLaboratoryById(id);
    await laboratory.update(data);
    logger.info(`Laboratory updated: ${id}`);
    return laboratory;
  }

  async deleteLaboratory(id) {
    const laboratory = await this.getLaboratoryById(id);
    await laboratory.destroy();
    logger.info(`Laboratory deleted: ${id}`);
    return { message: 'Laboratory deleted successfully' };
  }
}

module.exports = new LaboratoryService();
