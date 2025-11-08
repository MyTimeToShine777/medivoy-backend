'use strict';

import { getModels } from '../models/index.js';
import { Op } from 'sequelize';

export class ChatMessageService {
    /**
     * SEND MESSAGE
     */
    async sendMessage(conversationId, senderId, messageData) {
        try {
            if (!conversationId) {
                return { success: false, error: 'Conversation ID is required' };
            }

            if (!senderId) {
                return { success: false, error: 'Sender ID is required' };
            }

            if (!messageData.messageText || messageData.messageText.trim() === '') {
                return { success: false, error: 'Message text is required' };
            }

            const { ChatMessage, ChatConversation } = getModels();

            // Validate conversation exists
            const conversation = await ChatConversation.findByPk(conversationId);
            if (!conversation) {
                return { success: false, error: 'Conversation not found' };
            }

            const message = await ChatMessage.create({
                conversationId,
                senderId,
                messageType: 'text',
                isDelivered: true,
                deliveredAt: new Date(),
                ...messageData
            });

            // Update conversation last message timestamp
            await conversation.update({
                lastMessageAt: new Date()
            });

            return {
                success: true,
                data: message,
                message: 'Message sent successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET CONVERSATION MESSAGES
     */
    async getConversationMessages(conversationId, options = {}) {
        try {
            if (!conversationId) {
                return { success: false, error: 'Conversation ID is required' };
            }

            const { ChatMessage, User } = getModels();

            const { page = 1, limit = 50 } = options;
            const offset = (page - 1) * limit;

            const { rows: messages, count: total } = await ChatMessage.findAndCountAll({
                where: {
                    conversationId,
                    isDeleted: false
                },
                include: [
                    { model: User, as: 'sender', attributes: ['userId', 'firstName', 'lastName', 'avatar'] }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                success: true,
                data: messages.reverse(), // Reverse to show oldest first
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * MARK MESSAGE AS READ
     */
    async markAsRead(messageId, userId) {
        try {
            if (!messageId) {
                return { success: false, error: 'Message ID is required' };
            }

            const { ChatMessage } = getModels();

            const message = await ChatMessage.findByPk(messageId);

            if (!message) {
                return { success: false, error: 'Message not found' };
            }

            // Only receiver can mark as read
            if (message.receiverId && message.receiverId !== userId) {
                return { success: false, error: 'Unauthorized to mark this message as read' };
            }

            if (message.isRead) {
                return { success: true, data: message, message: 'Message already marked as read' };
            }

            await message.update({
                isRead: true,
                readAt: new Date()
            });

            return {
                success: true,
                data: message,
                message: 'Message marked as read'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * MARK ALL CONVERSATION MESSAGES AS READ
     */
    async markConversationAsRead(conversationId, userId) {
        try {
            if (!conversationId) {
                return { success: false, error: 'Conversation ID is required' };
            }

            const { ChatMessage } = getModels();

            const updated = await ChatMessage.update({ isRead: true, readAt: new Date() }, {
                where: {
                    conversationId,
                    receiverId: userId,
                    isRead: false
                }
            });

            return {
                success: true,
                data: { updatedCount: updated[0] },
                message: 'All messages marked as read'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * DELETE MESSAGE
     */
    async deleteMessage(messageId, userId) {
        try {
            if (!messageId) {
                return { success: false, error: 'Message ID is required' };
            }

            const { ChatMessage } = getModels();

            const message = await ChatMessage.findByPk(messageId);

            if (!message) {
                return { success: false, error: 'Message not found' };
            }

            // Only sender can delete
            if (message.senderId !== userId) {
                return { success: false, error: 'Unauthorized to delete this message' };
            }

            await message.update({
                isDeleted: true,
                deletedAt: new Date(),
                deletedBy: userId
            });

            return {
                success: true,
                message: 'Message deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GET UNREAD MESSAGE COUNT
     */
    async getUnreadCount(conversationId, userId) {
        try {
            if (!conversationId) {
                return { success: false, error: 'Conversation ID is required' };
            }

            const { ChatMessage } = getModels();

            const count = await ChatMessage.count({
                where: {
                    conversationId,
                    receiverId: userId,
                    isRead: false,
                    isDeleted: false
                }
            });

            return {
                success: true,
                data: { unreadCount: count }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new ChatMessageService();