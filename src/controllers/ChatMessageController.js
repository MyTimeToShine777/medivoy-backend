'use strict';

import chatMessageService from '../services/ChatMessageService.js';

export class ChatMessageController {
    constructor() {
        this.chatMessageService = chatMessageService;
    }

    /**
     * SEND MESSAGE
     */
    async sendMessage(req, res) {
        try {
            const { conversationId } = req.body;
            const senderId = req.user.userId;
            const messageData = req.body;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            const result = await this.chatMessageService.sendMessage(conversationId, senderId, messageData);

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
     * GET CONVERSATION MESSAGES
     */
    async getConversationMessages(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const { page, limit } = req.query;

            const result = await this.chatMessageService.getConversationMessages(conversationId, { page, limit });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * MARK MESSAGE AS READ
     */
    async markAsRead(req, res) {
        try {
            const messageId = req.params.messageId;
            const userId = req.user.userId;

            const result = await this.chatMessageService.markAsRead(messageId, userId);

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
     * MARK ALL CONVERSATION MESSAGES AS READ
     */
    async markConversationAsRead(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const userId = req.user.userId;

            const result = await this.chatMessageService.markConversationAsRead(conversationId, userId);

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
     * DELETE MESSAGE
     */
    async deleteMessage(req, res) {
        try {
            const messageId = req.params.messageId;
            const userId = req.user.userId;

            const result = await this.chatMessageService.deleteMessage(messageId, userId);

            if (!result.success) {
                return res.status(400).json(result);
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
     * GET UNREAD MESSAGE COUNT
     */
    async getUnreadCount(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const userId = req.user.userId;

            const result = await this.chatMessageService.getUnreadCount(conversationId, userId);

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

export default new ChatMessageController();