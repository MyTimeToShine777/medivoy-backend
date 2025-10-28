const packageService = require('../services/package.service');
const { successResponse } = require('../utils/response');

class PackageController {
  async createPackage(req, res, next) {
    try {
      const pkg = await packageService.createPackage(req.body);
      return successResponse(res, pkg, 'Package created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getPackage(req, res, next) {
    try {
      const pkg = await packageService.getPackageById(req.params.id);
      return successResponse(res, pkg, 'Package retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllPackages(req, res, next) {
    try {
      const { page, limit, ...filters } = req.query;
      const result = await packageService.getAllPackages(filters, { page, limit });
      return successResponse(res, result, 'Packages retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updatePackage(req, res, next) {
    try {
      const pkg = await packageService.updatePackage(req.params.id, req.body);
      return successResponse(res, pkg, 'Package updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deletePackage(req, res, next) {
    try {
      const result = await packageService.deletePackage(req.params.id);
      return successResponse(res, result, 'Package deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PackageController();
