'use strict';

import prisma from '../config/prisma.js';

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

            // Validate conversation exists
            const conversation = await prisma.chatConversation.findUnique({
                where: { conversationId }
            });
            if (!conversation) {
                return { success: false, error: 'Conversation not found' };
            }

            const message = await prisma.chatMessage.create({
                data: {
                    conversationId,
                    senderId,
                    messageType: 'text',
                    isDelivered: true,
                    deliveredAt: new Date(),
                    ...messageData
                }
            });

            // Update conversation last message timestamp
            await prisma.chatConversation.update({
                where: { conversationId },
                data: {
                    lastMessageAt: new Date()
                }
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

            const { page = 1, limit = 50 } = options;
            const skip = (page - 1) * limit;

            const [messages, total] = await Promise.all([
                prisma.chatMessage.findMany({
                    where: {
                        conversationId,
                        isDeleted: false
                    },
                    include: {
                        sender: {
                            select: { userId: true, firstName: true, lastName: true, avatar: true }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: parseInt(limit),
                    skip: parseInt(skip)
                }),
                prisma.chatMessage.count({
                    where: {
                        conversationId,
                        isDeleted: false
                    }
                })
            ]);

            return {
                success: true,
                data: messages.reverse(), // Reverse to show oldest first
                pagination: {
                    total,
                    page: parseInt(page),
                    take: parseInt(limit),
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

            const message = await prisma.chatMessage.findUnique({ where: { messageId: messageId } });

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

            const message = await prisma.chatMessage.findUnique({ where: { messageId: messageId } });

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

            const count = await prisma.chatMessage.count({
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