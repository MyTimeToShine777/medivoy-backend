const { Treatment, TreatmentCategory, TreatmentSubcategory, Hospital } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class TreatmentService {
  async createTreatment(treatmentData) {
    try {
      const slug = generateSlug(treatmentData.name);
      const treatment = await Treatment.create({ ...treatmentData, slug });
      logger.info(`Treatment created: ${treatment.id}`);
      return treatment;
    } catch (error) {
      logger.error('Error creating treatment:', error);
      throw new AppError('Failed to create treatment', 500);
    }
  }

  async getTreatmentById(treatmentId) {
    const treatment = await Treatment.findByPk(treatmentId, {
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' },
        { model: Hospital, as: 'hospitals', through: { attributes: [] } }
      ]
    });
    
    if (!treatment) {
      throw new AppError('Treatment not found', 404);
    }
    
    return treatment;
  }

  async updateTreatment(treatmentId, updateData) {
    const treatment = await this.getTreatmentById(treatmentId);
    
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }
    
    await treatment.update(updateData);
    logger.info(`Treatment updated: ${treatmentId}`);
    return treatment;
  }

  async deleteTreatment(treatmentId) {
    const treatment = await this.getTreatmentById(treatmentId);
    await treatment.destroy();
    logger.info(`Treatment deleted: ${treatmentId}`);
    return { message: 'Treatment deleted successfully' };
  }

  async getAllTreatments(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Treatment.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' }
      ],
      order: [['created_at', 'DESC']]
    });

    return {
      treatments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getTreatmentsByCategory(categoryId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Treatment.findAndCountAll({
      where: { category_id: categoryId },
      limit,
      offset,
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' }
      ],
      order: [['name', 'ASC']]
    });

    return {
      treatments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getTreatmentsBySubcategory(subcategoryId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const { count, rows } = await Treatment.findAndCountAll({
      where: { subcategory_id: subcategoryId },
      limit,
      offset,
      include: [
        { model: TreatmentCategory, as: 'category' },
        { model: TreatmentSubcategory, as: 'subcategory' }
      ],
      order: [['name', 'ASC']]
    });

    return {
      treatments: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = new TreatmentService();
