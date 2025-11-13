'use strict';

import prisma from '../config/prisma.js';
import { cacheService } from '../config/redis.js';

export class ChatConversationService {
    async createConversation(participantIds, name) {
        if (!Array.isArray(participantIds) || participantIds.length < 2) {
            return { success: false, error: 'At least two participants required' };
        }
        try {
            const conv = await prisma.chatConversation.create({
                data: {
                    participants: participantIds,
                    conversationName: name,
                    updatedAt: new Date()
                }
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

            const cons = await prisma.chatConversation.findMany({
                where: {
                    participants: { has: userId }
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                include: {
                    participantsInfo: {
                        select: { userId: true, firstName: true, lastName: true }
                    }
                }
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
            const msg = await prisma.chatMessage.create({
                data: {
                    conversationId,
                    senderId,
                    message,
                    attachments,
                    isRead: false,
                    createdAt: new Date()
                }
            });
            await prisma.chatConversation.updateMany({
                where: { conversationId },
                data: { updatedAt: new Date() }
            });
            return { success: true, data: msg };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getMessages(conversationId, limit) {
        try {
            const msgs = await prisma.chatMessage.findMany({
                where: { conversationId },
                orderBy: {
                    createdAt: 'asc'
                },
                take: limit || 50
            });
            return { success: true, data: msgs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async markAsRead(conversationId, readerId) {
        try {
            await prisma.chatMessage.updateMany({
                where: {
                    conversationId,
                    senderId: { not: readerId }
                },
                data: { isRead: true }
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export const chatConversationService = new ChatConversationService();
export default chatConversationService;