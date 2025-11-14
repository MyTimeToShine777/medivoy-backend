'use strict';

import chatService from '../services/ChatService.js';

export class ChatController {
    constructor() {
        this.chatService = chatService;
    }

    async createChatRoom(req, res) {
        try {
            const userId1 = req.user.userId;
            const userId2 = req.body.userId2;
            const chatData = req.body;

            const result = await this.chatService.createChatRoom(userId1, userId2, chatData);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Chat room created',
                data: result.chat
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getChatRoom(req, res) {
        try {
            const chatId = req.params.chatId;
            const userId = req.user.userId;

            const result = await this.chatService.getChatRoom(chatId, userId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.chat
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getUserChats(req, res) {
        try {
            const userId = req.user.userId;
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.chatService.getUserChats(userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.chats,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async sendMessage(req, res) {
        try {
            const chatId = req.params.chatId;
            const userId = req.user.userId;
            const messageContent = req.body.message;

            const result = await this.chatService.sendMessage(chatId, userId, messageContent);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(201).json({
                success: true,
                message: 'Message sent',
                data: result.data
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getChatMessages(req, res) {
        try {
            const chatId = req.params.chatId;
            const userId = req.user.userId;
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0
            };

            const result = await this.chatService.getChatMessages(chatId, userId, filters);

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.status(200).json({
                success: true,
                data: result.messages,
                pagination: result.pagination
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default new ChatController();