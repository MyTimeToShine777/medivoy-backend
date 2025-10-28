const { LabTest, Laboratory, Patient } = require('../models');
const { AppError } = require('../utils/error-handler');
const logger = require('../utils/logger');

class LabTestService {
  async createLabTest(data) {
    try {
      const labTest = await LabTest.create(data);
      logger.info(`Lab test created: ${labTest.id}`);
      return labTest;
    } catch (error) {
      logger.error('Error creating lab test:', error);
      throw new AppError('Failed to create lab test', 500);
    }
  }

  async getLabTestById(id) {
    const labTest = await LabTest.findByPk(id, {
      include: [
        { model: Laboratory, as: 'laboratory' },
        { model: Patient, as: 'patient' }
      ]
    });
    if (!labTest) throw new AppError('Lab test not found', 404);
    return labTest;
  }

  async getAllLabTests(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await LabTest.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Laboratory, as: 'laboratory' },
        { model: Patient, as: 'patient' }
      ],
      order: [['created_at', 'DESC']]
    });
    return { labTests: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateLabTest(id, data) {
    const labTest = await this.getLabTestById(id);
    await labTest.update(data);
    logger.info(`Lab test updated: ${id}`);
    return labTest;
  }

  async updateLabTestResults(id, results) {
    const labTest = await this.getLabTestById(id);
    await labTest.update({ 
      results, 
      status: 'completed',
      completed_at: new Date()
    });
    logger.info(`Lab test results updated: ${id}`);
    return labTest;
  }

  async deleteLabTest(id) {
    const labTest = await this.getLabTestById(id);
    await labTest.destroy();
    logger.info(`Lab test deleted: ${id}`);
    return { message: 'Lab test deleted successfully' };
  }
}

module.exports = new LabTestService();
