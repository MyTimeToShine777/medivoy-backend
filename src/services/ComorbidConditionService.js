'use strict';

import ComorbidConditionService from '../services/ComorbidConditionService.js';

export class ComorbidConditionController {
    constructor() {
        this.comorbidConditionService = new ComorbidConditionService();
    }

    /**
     * ADD CONDITION
     */
    async addCondition(req, res) {
        try {
            const patientId = req.body.patientId || req.user.patientId;
            const conditionData = req.body;

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.comorbidConditionService.addCondition(patientId, conditionData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET PATIENT CONDITIONS
     */
    async getPatientConditions(req, res) {
        try {
            const patientId = req.params.patientId || req.user.patientId;
            const includeResolved = req.query.includeResolved === 'true';

            if (!patientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Patient ID is required'
                });
            }

            const result = await this.comorbidConditionService.getPatientConditions(patientId, includeResolved);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                total: result.total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET CONDITION BY ID
     */
    async getConditionById(req, res) {
        try {
            const conditionId = req.params.conditionId;

            const result = await this.comorbidConditionService.getConditionById(conditionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE CONDITION
     */
    async updateCondition(req, res) {
        try {
            const conditionId = req.params.conditionId;
            const updateData = req.body;

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
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * UPDATE CONDITION STATUS
     */
    async updateConditionStatus(req, res) {
        try {
            const conditionId = req.params.conditionId;
            const { status } = req.body;

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
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * DELETE CONDITION
     */
    async deleteCondition(req, res) {
        try {
            const conditionId = req.params.conditionId;

            const result = await this.comorbidConditionService.deleteCondition(conditionId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * GET ACTIVE CONDITIONS COUNT
     */
    async getActiveConditionsCount(req, res) {
        try {
            const patientId = req.params.patientId || req.user.patientId;

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
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new ComorbidConditionController();