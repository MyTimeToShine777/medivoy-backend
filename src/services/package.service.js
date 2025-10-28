const { Package, Treatment, Hospital } = require('../models');
const { AppError } = require('../utils/error-handler');
const { generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

class PackageService {
  async createPackage(data) {
    try {
      const slug = generateSlug(data.name);
      const pkg = await Package.create({ ...data, slug });
      logger.info(`Package created: ${pkg.id}`);
      return pkg;
    } catch (error) {
      logger.error('Error creating package:', error);
      throw new AppError('Failed to create package', 500);
    }
  }

  async getPackageById(id) {
    const pkg = await Package.findByPk(id, {
      include: [
        { model: Treatment, as: 'treatments' },
        { model: Hospital, as: 'hospital' }
      ]
    });
    if (!pkg) throw new AppError('Package not found', 404);
    return pkg;
  }

  async getAllPackages(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;
    const { count, rows } = await Package.findAndCountAll({
      where: filters,
      limit,
      offset,
      include: [
        { model: Treatment, as: 'treatments' },
        { model: Hospital, as: 'hospital' }
      ],
      order: [['created_at', 'DESC']]
    });
    return { packages: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updatePackage(id, data) {
    const pkg = await this.getPackageById(id);
    if (data.name) {
      data.slug = generateSlug(data.name);
    }
    await pkg.update(data);
    logger.info(`Package updated: ${id}`);
    return pkg;
  }

  async deletePackage(id) {
    const pkg = await this.getPackageById(id);
    await pkg.destroy();
    logger.info(`Package deleted: ${id}`);
    return { message: 'Package deleted successfully' };
  }
}

module.exports = new PackageService();
