// Department Service - Hospital department management
// NO optional chaining - Production Ready
import { Op } from 'sequelize';
import { Department, Hospital, Doctor } from '../models/index.js';

class DepartmentService {
    // ========== CREATE DEPARTMENT ==========
    async createDepartment(departmentData) {
        try {
            const department = await Department.create({
                ...departmentData,
                isActive: true,
            });

            return { success: true, data: department };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET DEPARTMENT ==========
    async getDepartmentById(departmentId) {
        try {
            const department = await Department.findByPk(departmentId, {
                include: [
                    { model: Hospital, as: 'hospital' },
                    { model: Doctor, as: 'doctors' },
                ],
            });

            if (!department) return { success: false, error: 'Not found' };
            return { success: true, data: department };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET HOSPITAL DEPARTMENTS ==========
    async getHospitalDepartments(hospitalId) {
        try {
            const departments = await Department.findAll({
                where: { hospitalId, isActive: true },
                include: [{ model: Doctor, as: 'doctors' }],
                order: [
                    ['name', 'ASC']
                ],
            });

            return { success: true, data: departments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE DEPARTMENT ==========
    async updateDepartment(departmentId, updateData) {
        try {
            const department = await Department.findByPk(departmentId);
            if (!department) return { success: false, error: 'Not found' };

            const updated = await department.update(updateData);
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new DepartmentService();