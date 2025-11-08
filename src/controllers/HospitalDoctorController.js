'use strict';

import { hospitalDoctorService } from '../services/HospitalDoctorService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

export class HospitalDoctorController {
    async assignDoctorToHospital(req, res, next) {
        try {
            if (!req.body.doctorId) return res.status(400).json(ResponseFormatter.error('Doctor ID required', 400));
            const result = await hospitalDoctorService.assignDoctorToHospital(req.params.hospitalId, req.body.doctorId, req.body);
            if (!result.success) return res.status(409).json(ResponseFormatter.error(result.error, 409));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }

    async getHospitalDoctors(req, res, next) {
        try {
            const result = await hospitalDoctorService.getHospitalDoctors(req.params.hospitalId);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }

    async removeDoctorFromHospital(req, res, next) {
        try {
            const result = await hospitalDoctorService.removeDoctorFromHospital(req.params.hospitalDoctorId);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success({}));
        } catch (error) {
            return res.status(500).json(ResponseFormatter.error(error.message, 500));
        }
    }
}

export default new HospitalDoctorController();