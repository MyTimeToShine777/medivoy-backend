'use strict';

import { chatConversationService } from '../services/ChatConversationService.js';
import { ResponseFormatter } from '../utils/helpers/responseFormatter.js';

export class ChatConversationController {
    async createConversation(req, res, next) {
        try {
            const participants = req.body.participants;
            const name = req.body.conversationName || '';
            const result = await chatConversationService.createConversation(participants, name);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async list(req, res, next) {
        try {
            const result = await chatConversationService.getUserConversations(req.user.userId);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async addMessage(req, res, next) {
        try {
            const result = await chatConversationService.addMessage(
                req.params.conversationId,
                req.user.userId,
                req.body.message,
                req.body.attachments || []
            );
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(201).json(ResponseFormatter.created(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async getMessages(req, res, next) {
        try {
            const result = await chatConversationService.getMessages(req.params.conversationId, req.query.limit);
            return res.status(200).json(ResponseFormatter.success(result.data));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }

    async markAsRead(req, res, next) {
        try {
            const result = await chatConversationService.markAsRead(req.params.conversationId, req.user.userId);
            if (!result.success) return res.status(400).json(ResponseFormatter.error(result.error, 400));
            return res.status(200).json(ResponseFormatter.success({}));
        } catch (err) {
            return res.status(500).json(ResponseFormatter.error(err.message, 500));
        }
    }
}

export default new ChatConversationController();