'use strict';

import { ChatConversation, ChatMessage, User } from '../models/index.js';
import { cacheService } from '../config/redis.js';

export class ChatConversationService {
    async createConversation(participantIds, name) {
        if (!Array.isArray(participantIds) || participantIds.length < 2) {
            return { success: false, error: 'At least two participants required' };
        }
        try {
            const conv = await ChatConversation.create({
                participants: participantIds,
                conversationName: name,
                updatedAt: new Date()
            });
            return { success: true, data: conv };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserConversations(userId) {
        try {
            const cacheKey = `user_chats_${userId}`;
            let cached = await cacheService.get(cacheKey);
            if (cached) return { success: true, data: JSON.parse(cached) };

            const cons = await ChatConversation.findAll({
                where: { participants: {
                        [require('sequelize').Op.contains]: [userId] } },
                order: [
                    ['updatedAt', 'DESC']
                ],
                include: [{ model: User, as: 'participantsInfo', attributes: ['userId', 'firstName', 'lastName'] }]
            });

            await cacheService.set(cacheKey, JSON.stringify(cons), 3600);
            return { success: true, data: cons };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async addMessage(conversationId, senderId, message, attachments) {
        if (!conversationId || !senderId || !message) {
            return { success: false, error: 'Missing fields' };
        }
        try {
            const msg = await ChatMessage.create({
                conversationId,
                senderId,
                message,
                attachments,
                isRead: false,
                createdAt: new Date()
            });
            await ChatConversation.update({ updatedAt: new Date() }, { where: { conversationId } });
            return { success: true, data: msg };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getMessages(conversationId, limit) {
        try {
            const msgs = await ChatMessage.findAll({
                where: { conversationId },
                order: [
                    ['createdAt', 'ASC']
                ],
                limit: limit || 50
            });
            return { success: true, data: msgs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async markAsRead(conversationId, readerId) {
        try {
            await ChatMessage.update({ isRead: true }, { where: { conversationId, senderId: {
                        [require('sequelize').Op.ne]: readerId } } });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const chatConversationService = new ChatConversationService();
export default chatConversationService;