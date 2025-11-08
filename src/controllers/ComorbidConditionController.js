'use strict';

import ComorbidConditionService from '../services/ComorbidConditionService.js';

// ═══════════════════════════════════════════════════════════════════════════════
// COMORBID CONDITION CONTROLLER - ULTRA-COMPREHENSIVE
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

export class ComorbidConditionController {
    constructor() {
        this.comorbidConditionService = new ComorbidConditionService();
    }

    /**
     * ADD CONDITION
     * @route POST /api/conditions/add
     * @access Patient, Doctor
     */
    async addCondition(req, res) {
        try {
            const conditionData = req.body;

            if (!conditionData) {
                return res.status(400).json({
                    success: false,
                    error: 'Condition data is required'
                });
            }

            const result = await this.comorbidConditionService.addCondition(conditionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error('Error in addCondition:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET PATIENT CONDITIONS
     * @route GET /api/conditions/patient/:patientId
     * @access Patient, Doctor, Admin
     */
    async getPatientConditions(req, res) {
        try {
            const patientId = req.params.patientId || req.user.userId;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.comorbidConditionService.getPatientConditions(patientId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getPatientConditions:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET CONDITION BY ID
     * @route GET /api/conditions/:conditionId
     * @access Patient, Doctor, Admin
     */
    async getConditionById(req, res) {
        try {
            const conditionId = req.params.conditionId;

            if (!conditionId) {
                return res.status(400).json({
                    success: false,
                    error: 'Condition ID is required'
                });
            }

            const result = await this.comorbidConditionService.getConditionById(conditionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getConditionById:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * UPDATE CONDITION
     * @route PUT /api/conditions/:conditionId/update
     * @access Patient, Doctor
     */
    async updateCondition(req, res) {
        try {
            const conditionId = req.params.conditionId;
            const updateData = req.body;

            if (!conditionId) {
                return res.status(400).json({
                    success: false,
                    error: 'Condition ID is required'
                });
            }

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Update data is required'
                });
            }

            const result = await this.comorbidConditionService.updateCondition(conditionId, updateData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error('Error in updateCondition:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * UPDATE CONDITION STATUS
     * @route PUT /api/conditions/:conditionId/status
     * @access Doctor
     */
    async updateConditionStatus(req, res) {
        try {
            const conditionId = req.params.conditionId;
            const { status } = req.body;

            if (!conditionId) {
                return res.status(400).json({
                    success: false,
                    error: 'Condition ID is required'
                });
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'Status is required'
                });
            }

            const result = await this.comorbidConditionService.updateConditionStatus(conditionId, status);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            console.error('Error in updateConditionStatus:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * DELETE CONDITION
     * @route DELETE /api/conditions/:conditionId/delete
     * @access Patient, Doctor, Admin
     */
    async deleteCondition(req, res) {
        try {
            const conditionId = req.params.conditionId;

            if (!conditionId) {
                return res.status(400).json({
                    success: false,
                    error: 'Condition ID is required'
                });
            }

            const result = await this.comorbidConditionService.deleteCondition(conditionId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Error in deleteCondition:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET ACTIVE CONDITIONS COUNT
     * @route GET /api/conditions/count
     * @access Patient, Doctor, Admin
     */
    async getActiveConditionsCount(req, res) {
        try {
            const patientId = req.params.patientId || req.user.userId;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.comorbidConditionService.getActiveConditionsCount(patientId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getActiveConditionsCount:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET ALL CONDITIONS (ADMIN)
     * @route GET /api/conditions
     * @access Admin, SuperAdmin
     */
    async getAllConditions(req, res) {
        try {
            const { page, limit } = req.query;

            const result = await this.comorbidConditionService.getAllConditions({ page, limit });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Error in getAllConditions:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    /**
     * GET CONDITION STATISTICS
     * @route GET /api/conditions/statistics
     * @access Admin, SuperAdmin
     */
    async getConditionStatistics(req, res) {
        try {
            const result = await this.comorbidConditionService.getConditionStatistics();

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getConditionStatistics:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }
}

export default new ComorbidConditionController();