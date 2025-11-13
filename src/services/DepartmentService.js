// Department Service - Hospital department management
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';

class DepartmentService {
    // ========== CREATE DEPARTMENT ==========
    async createDepartment(departmentData) {
        try {
            const department = await prisma.department.create({
                data: {
                    ...departmentData,
                    isActive: true,
                }
            });

            return { success: true, data: department };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GET DEPARTMENT ==========
    async getDepartmentById(departmentId) {
        try {
            const department = await prisma.department.findUnique({
                where: { departmentId },
                include: {
                    hospital: true,
                    doctors: true
                }
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
            const departments = await prisma.department.findMany({
                where: { hospitalId, isActive: true },
                include: { doctors: true },
                orderBy: { name: 'asc' }
            });

            return { success: true, data: departments };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== UPDATE DEPARTMENT ==========
    async updateDepartment(departmentId, updateData) {
        try {
            const department = await prisma.department.findUnique({
                where: { departmentId }
            });
            if (!department) return { success: false, error: 'Not found' };

            const updated = await prisma.department.update({
                where: { departmentId },
                data: updateData
            });
            return { success: true, data: updated };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new DepartmentService();