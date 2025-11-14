'use strict';

import prisma from '../config/prisma.js';
import validationService from './ValidationService.js';
import errorHandlingService from './ErrorHandlingService.js';
import auditLogService from './AuditLogService.js';
import notificationService from './NotificationService.js';
import { AppError } from '../utils/errors/AppError.js';

export class ChatService {
    constructor() {
        this.validationService = validationService;
        this.errorHandlingService = errorHandlingService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    async createChatRoom(userId1, userId2, chatData = {}) {
        try {
            if (!userId1 || !userId2) {
                throw new AppError('Both user IDs required', 400);
            }

            return await prisma.$transaction(async(tx) => {
                const existingChat = await tx.chatConversation.findFirst({
                    where: {
                        OR: [
                            { userId1: userId1, userId2: userId2 },
                            { userId1: userId2, userId2: userId1 }
                        ]
                    }
                });

                if (existingChat) {
                    return { success: true, message: 'Chat room already exists', chat: existingChat };
                }

                const chat = await tx.chatConversation.create({
                    data: {
                        chatId: this._generateChatId(),
                        userId1: userId1,
                        userId2: userId2,
                        subject: chatData.subject || null,
                        createdAt: new Date()
                    }
                });

                await this.auditLogService.logAction({
                    action: 'CHAT_ROOM_CREATED',
                    entityType: 'Chat',
                    entityId: chat.chatId,
                    userId: userId1,
                    details: { otherUserId: userId2 }
                }, tx);

                return { success: true, message: 'Chat room created', chat: chat };
            });
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getChatRoom(chatId, userId) {
        try {
            if (!chatId || !userId) {
                return { success: false, error: 'Chat ID and User ID required' };
            }

            const chat = await prisma.chatConversation.findUnique({
                where: { chatId },
                include: {
                    User1: {
                        select: { userId: true, firstName: true, lastName: true }
                    },
                    User2: {
                        select: { userId: true, firstName: true, lastName: true }
                    }
                }
            });

            if (!chat) {
                return { success: false, error: 'Chat room not found' };
            }

            if (chat.userId1 !== userId && chat.userId2 !== userId) {
                return { success: false, error: 'Unauthorized access' };
            }

            return { success: true, chat: chat };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserChats(userId, filters = {}) {
        try {
            if (!userId) {
                return { success: false, error: 'User ID required' };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const chats = await prisma.chatConversation.findMany({
                where: {
                    OR: [
                        { userId1: userId },
                        { userId2: userId }
                    ]
                },
                include: {
                    User1: {
                        select: { userId: true, firstName: true, lastName: true }
                    },
                    User2: {
                        select: { userId: true, firstName: true, lastName: true }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.chatConversation.count({
                where: {
                    OR: [
                        { userId1: userId },
                        { userId2: userId }
                    ]
                }
            });

            return {
                success: true,
                chats: chats,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async sendMessage(chatId, userId, messageContent) {
        try {
            if (!chatId || !userId || !messageContent) {
                throw new AppError('All parameters required', 400);
            }

            return await prisma.$transaction(async(tx) => {
                const chat = await tx.chatConversation.findUnique({
                    where: { chatId }
                });

                if (!chat) {
                    return { success: false, error: 'Chat room not found' };
                }

                if (chat.userId1 !== userId && chat.userId2 !== userId) {
                    return { success: false, error: 'Unauthorized' };
                }

                const message = await tx.chatMessage.create({
                    data: {
                        messageId: this._generateMessageId(),
                        chatId: chatId,
                        senderId: userId,
                        content: messageContent,
                        isRead: false,
                        createdAt: new Date()
                    }
                });

                await tx.chatConversation.update({
                    where: { chatId },
                    data: { updatedAt: new Date() }
                });

                const recipientId = chat.userId1 === userId ? chat.userId2 : chat.userId1;
                await this.notificationService.sendNotification(recipientId, 'NEW_MESSAGE', {
                    chatId: chatId,
                    senderName: 'A user'
                });

                return { success: true, message: 'Message sent', data: message };
            });
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getChatMessages(chatId, userId, filters = {}) {
        try {
            if (!chatId || !userId) {
                return { success: false, error: 'Chat ID and User ID required' };
            }

            const chat = await prisma.chatConversation.findUnique({
                where: { chatId }
            });

            if (!chat || (chat.userId1 !== userId && chat.userId2 !== userId)) {
                return { success: false, error: 'Unauthorized' };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const messages = await prisma.chatMessage.findMany({
                where: { chatId: chatId },
                include: {
                    Sender: {
                        select: { userId: true, firstName: true, lastName: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                skip: offset
            });

            const total = await prisma.chatMessage.count({
                where: { chatId: chatId }
            });

            // Mark as read
            await prisma.chatMessage.updateMany({
                where: {
                    chatId: chatId,
                    senderId: { not: userId }
                },
                data: { isRead: true }
            });

            return {
                success: true,
                messages: messages,
                pagination: { total: total, page: Math.floor(offset / limit) + 1, limit: limit }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    _generateChatId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'CHAT-' + ts + rnd;
    }

    _generateMessageId() {
        const ts = Date.now().toString(36).toUpperCase();
        const rnd = Math.floor(Math.random() * 1000).toString(36).toUpperCase();
        return 'MSG-' + ts + rnd;
    }
}

export default new ChatService();