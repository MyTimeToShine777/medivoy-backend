'use strict';

import prisma from '../config/prisma.js';
import { ValidationService } from './ValidationService.js';
import { ErrorHandlingService } from './ErrorHandlingService.js';
import { AuditLogService } from './AuditLogService.js';
import { NotificationService } from './NotificationService.js';
import { AppError } from '../utils/errors/AppError.js';

export class ChatService {
    constructor() {
        this.validationService = new ValidationService();
        this.errorHandlingService = new ErrorHandlingService();
        this.auditLogService = new AuditLogService();
        this.notificationService = new NotificationService();
    }

    async createChatRoom(userId1, userId2, chatData = {}) {
        const transaction = await prisma.$transaction(async (tx) => {
        try {
            if (!userId1 || !userId2) {
                throw new AppError('Both user IDs required', 400);
            }

            const existingChat = await tx.chat.findFirst({
                where: {
                    OR: [
                        { userId1: userId1, userId2: userId2 },
                        { userId1: userId2, userId2: userId1 }
                    ]
                },
                transaction: transaction
            });

            if (existingChat) {
                return { success: true, message: 'Chat room already exists', chat: existingChat };
            }

            const chat = await tx.chat.create({
                data: {
                chatId: this._generateChatId(),
                userId1: userId1,
                userId2: userId2,
                subject: chatData.subject || null,
                createdAt: new Date()
            });

            await this.auditLogService.logAction({
                action: 'CHAT_ROOM_CREATED',
                entityType: 'Chat',
                entityId: chat.chatId,
                userId: userId1,
                details: { otherUserId: userId2 }
            }, transaction);


            return { success: true, message: 'Chat room created', chat: chat };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getChatRoom(chatId, userId) {
        try {
            if (!chatId || !userId) {
                return { success: false, error: 'Chat ID and User ID required' };
            }

            const chat = await prisma.chat.findUnique({
                where: { chatId }, {
                include: [
                    { model: User, as: 'User1', attributes: ['userId', 'firstName', 'lastName'] },
                    { model: User, as: 'User2', attributes: ['userId', 'firstName', 'lastName'] }
                ]
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

            const chats = await Chat.findAll({
                where: {
                    OR: [
                        { userId1: userId },
                        { userId2: userId }
                    ]
                },
                include: [
                    { model: User, as: 'User1', attributes: ['userId', 'firstName', 'lastName'] },
                    { model: User, as: 'User2', attributes: ['userId', 'firstName', 'lastName'] }
                ],
                order: [
                    ['updatedAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await Chat.count({
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
        const transaction = await prisma.$transaction(async (tx) => {
        try {
            if (!chatId || !userId || !messageContent) {
                throw new AppError('All parameters required', 400);
            }

            const chat = await prisma.chat.findUnique({
                where: { chatId });
            if (!chat) {
                return { success: false, error: 'Chat room not found' };
            }

            if (chat.userId1 !== userId && chat.userId2 !== userId) {
                return { success: false, error: 'Unauthorized' };
            }

            const message = await ChatMessage.create({
                messageId: this._generateMessageId(),
                chatId: chatId,
                senderId: userId,
                content: messageContent,
                isRead: false,
                createdAt: new Date()
            });

            chat.updatedAt = new Date();
            await chat.save();

            const recipientId = chat.userId1 === userId ? chat.userId2 : chat.userId1;
            await this.notificationService.sendNotification(recipientId, 'NEW_MESSAGE', {
                chatId: chatId,
                senderName: 'A user'
            });


            return { success: true, message: 'Message sent', data: message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getChatMessages(chatId, userId, filters = {}) {
        try {
            if (!chatId || !userId) {
                return { success: false, error: 'Chat ID and User ID required' };
            }

            const chat = await prisma.chat.findUnique({ where: { chatId: chatId } });
            if (!chat || (chat.userId1 !== userId && chat.userId2 !== userId)) {
                return { success: false, error: 'Unauthorized' };
            }

            const limit = filters.limit ? Math.min(filters.limit, 100) : 20;
            const offset = filters.offset || 0;

            const messages = await ChatMessage.findAll({
                where: { chatId: chatId },
                include: [{ model: User, as: 'Sender', attributes: ['userId', 'firstName', 'lastName'] }],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: limit,
                offset: offset
            });

            const total = await ChatMessage.count({ where: { chatId: chatId } });

            // Mark as read
            await ChatMessage.update({ isRead: true }, { where: { chatId: chatId, senderId: {
                        not: userId } } });

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