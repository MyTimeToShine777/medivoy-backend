'use strict';

import { insuranceDocumentService } from '../services/InsuranceDocumentService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

export class InsuranceDocumentController {
    async upload(req, res, next) {
        try {
            const { insuranceId, documentType } = req.body;
            if (!insuranceId || !documentType || !req.file) {
                return res.status(400).json(ResponseFormatter.error('Missing required fields', 400));
            }
            const result = await insuranceDocumentService.upload(req.user.userId, insuranceId, req.file, documentType, req.body.meta);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async list(req, res, next) {
        try {
            const result = await insuranceDocumentService.getUserDocuments(req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async verify(req, res, next) {
        try {
            if (!req.body.status) {
                return res.status(400).json(ResponseFormatter.error('Status required', 400));
            }
            const result = await insuranceDocumentService.verify(req.params.documentId, req.body.status);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async adminDelete(req, res, next) {
        try {
            const result = await insuranceDocumentService.adminDelete(req.params.documentId);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success({}));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }
}

export default new InsuranceDocumentController();