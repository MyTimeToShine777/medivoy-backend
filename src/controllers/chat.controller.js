/**
 * Chat Controller
 * Handles chat conversations and messaging
 */

const { Op } = require('sequelize');
const { ChatConversation, ChatMessage, User, Booking, Appointment } = require('../models');

/**
 * Create a new conversation
 */
exports.createConversation = async (req, res) => {
  try {
    const {
      conversation_type,
      participant_1_id,
      participant_1_type,
      participant_2_id,
      participant_2_type,
      booking_id,
      appointment_id,
      title
    } = req.body;

    // Check if conversation already exists between these participants
    const existingConversation = await ChatConversation.findOne({
      where: {
        [Op.or]: [
          {
            participant_1_id,
            participant_2_id
          },
          {
            participant_1_id: participant_2_id,
            participant_2_id: participant_1_id
          }
        ],
        is_active: true
      }
    });

    if (existingConversation) {
      return res.json({
        success: true,
        message: 'Conversation already exists',
        data: existingConversation
      });
    }

    const conversation = await ChatConversation.create({
      conversation_type: conversation_type || 'patient_doctor',
      participant_1_id,
      participant_1_type,
      participant_2_id,
      participant_2_type,
      booking_id,
      appointment_id,
      title,
      is_active: true
    });

    const conversationWithDetails = await ChatConversation.findByPk(conversation.id, {
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'participant2', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Booking, as: 'booking', attributes: ['id', 'booking_number', 'status'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date', 'status'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: conversationWithDetails
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: error.message
    });
  }
};

/**
 * Get all conversations for a user
 */
exports.getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, isArchived = false } = req.query;

    const offset = (page - 1) * limit;

    const conversations = await ChatConversation.findAndCountAll({
      where: {
        [Op.or]: [
          { participant_1_id: userId },
          { participant_2_id: userId }
        ],
        is_active: true,
        [Op.or]: [
          { is_archived_participant_1: isArchived === 'true', participant_1_id: userId },
          { is_archived_participant_2: isArchived === 'true', participant_2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'participant2', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Booking, as: 'booking', attributes: ['id', 'booking_number', 'status'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date', 'status'] }
      ],
      order: [['last_message_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: conversations.rows,
      pagination: {
        total: conversations.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(conversations.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};

/**
 * Get conversation by ID
 */
exports.getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await ChatConversation.findByPk(id, {
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'participant2', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Booking, as: 'booking', attributes: ['id', 'booking_number', 'status'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date', 'status'] }
      ]
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

/**
 * Send a message
 */
exports.sendMessage = async (req, res) => {
  try {
    const {
      conversation_id,
      sender_id,
      sender_type,
      message_type,
      message_content,
      file_url,
      file_name,
      file_size,
      file_type,
      thumbnail_url,
      reply_to_message_id,
      metadata
    } = req.body;

    // Validate conversation exists
    const conversation = await ChatConversation.findByPk(conversation_id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Validate sender is part of conversation
    if (sender_id !== conversation.participant_1_id && sender_id !== conversation.participant_2_id) {
      return res.status(403).json({
        success: false,
        message: 'Sender is not part of this conversation'
      });
    }

    const message = await ChatMessage.create({
      conversation_id,
      sender_id,
      sender_type: sender_type || 'patient',
      message_type: message_type || 'text',
      message_content,
      file_url,
      file_name,
      file_size,
      file_type,
      thumbnail_url,
      reply_to_message_id,
      metadata,
      is_delivered: true,
      delivered_at: new Date()
    });

    // Update conversation last message
    await conversation.update({
      last_message: message_content || 'File attachment',
      last_message_at: new Date(),
      last_message_by: sender_id,
      // Increment unread count for the other participant
      ...(sender_id === conversation.participant_1_id
        ? { unread_count_participant_2: conversation.unread_count_participant_2 + 1 }
        : { unread_count_participant_1: conversation.unread_count_participant_1 + 1 })
    });

    const messageWithDetails = await ChatMessage.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: ChatMessage, as: 'replyToMessage', attributes: ['id', 'message_content', 'sender_id'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: messageWithDetails
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Get messages for a conversation
 */
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50, before } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { conversation_id: conversationId, is_deleted: false };

    if (before) {
      whereClause.created_at = { [Op.lt]: new Date(before) };
    }

    const messages = await ChatMessage.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: ChatMessage, as: 'replyToMessage', attributes: ['id', 'message_content', 'sender_id'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: messages.rows.reverse(), // Reverse to show oldest first
      pagination: {
        total: messages.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

/**
 * Mark messages as read
 */
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    const conversation = await ChatConversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Mark all unread messages as read
    await ChatMessage.update(
      { is_read: true, read_at: new Date() },
      {
        where: {
          conversation_id: conversationId,
          sender_id: { [Op.ne]: userId },
          is_read: false
        }
      }
    );

    // Reset unread count for this user
    if (userId === conversation.participant_1_id) {
      await conversation.update({ unread_count_participant_1: 0 });
    } else if (userId === conversation.participant_2_id) {
      await conversation.update({ unread_count_participant_2: 0 });
    }

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

/**
 * Delete a message
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const message = await ChatMessage.findByPk(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete their message
    if (message.sender_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    await message.update({
      is_deleted: true,
      deleted_at: new Date(),
      message_content: 'This message has been deleted'
    });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
};

/**
 * Archive/Unarchive conversation
 */
exports.toggleArchiveConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, archive } = req.body;

    const conversation = await ChatConversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Update archive status for the user
    if (userId === conversation.participant_1_id) {
      await conversation.update({ is_archived_participant_1: archive });
    } else if (userId === conversation.participant_2_id) {
      await conversation.update({ is_archived_participant_2: archive });
    } else {
      return res.status(403).json({
        success: false,
        message: 'User is not part of this conversation'
      });
    }

    res.json({
      success: true,
      message: archive ? 'Conversation archived' : 'Conversation unarchived'
    });
  } catch (error) {
    console.error('Error toggling archive:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling archive status',
      error: error.message
    });
  }
};

/**
 * Get unread message count for user
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await ChatConversation.findAll({
      where: {
        [Op.or]: [
          { participant_1_id: userId },
          { participant_2_id: userId }
        ],
        is_active: true
      },
      attributes: ['id', 'participant_1_id', 'participant_2_id', 'unread_count_participant_1', 'unread_count_participant_2']
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      if (conv.participant_1_id === parseInt(userId)) {
        totalUnread += conv.unread_count_participant_1;
      } else if (conv.participant_2_id === parseInt(userId)) {
        totalUnread += conv.unread_count_participant_2;
      }
    });

    res.json({
      success: true,
      data: {
        totalUnread,
        conversationsWithUnread: conversations.filter(conv => {
          if (conv.participant_1_id === parseInt(userId)) {
            return conv.unread_count_participant_1 > 0;
          } else if (conv.participant_2_id === parseInt(userId)) {
            return conv.unread_count_participant_2 > 0;
          }
          return false;
        }).length
      }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
};