/**
 * Video Call Controller
 * Handles video call sessions and management
 */

const { Op } = require('sequelize');
const {
  VideoCall, Appointment, ChatConversation, User,
} = require('../models');

/**
 * Initiate a video call
 */
exports.initiateCall = async (req, res) => {
  try {
    const {
      appointment_id,
      conversation_id,
      host_id,
      host_type,
      participant_id,
      participant_type,
      call_type,
      scheduled_at,
      provider,
    } = req.body;

    // Validate appointment or conversation exists
    if (appointment_id) {
      const appointment = await Appointment.findByPk(appointment_id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }
    }

    if (conversation_id) {
      const conversation = await ChatConversation.findByPk(conversation_id);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found',
        });
      }
    }

    // Generate room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create video call record
    const videoCall = await VideoCall.create({
      appointment_id,
      conversation_id,
      host_id,
      host_type: host_type || 'doctor',
      participant_id,
      participant_type: participant_type || 'patient',
      call_type: call_type || 'consultation',
      call_status: scheduled_at ? 'scheduled' : 'initiated',
      scheduled_at,
      room_id: roomId,
      provider: provider || 'agora',
      recording_enabled: false,
    });

    // In production, generate actual tokens from video provider (Agora, Twilio, etc.)
    // For now, we'll use placeholder tokens
    const hostToken = `host_token_${roomId}`;
    const participantToken = `participant_token_${roomId}`;

    await videoCall.update({
      host_token: hostToken,
      participant_token: participantToken,
    });

    const callWithDetails = await VideoCall.findByPk(videoCall.id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'participant', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date', 'status'] },
        { model: ChatConversation, as: 'conversation', attributes: ['id', 'conversation_type'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Video call initiated successfully',
      data: {
        ...callWithDetails.toJSON(),
        joinUrl: `/video-call/${roomId}`,
      },
    });
  } catch (error) {
    console.error('Error initiating video call:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating video call',
      error: error.message,
    });
  }
};

/**
 * Join a video call
 */
exports.joinCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const videoCall = await VideoCall.findByPk(id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'participant', attributes: ['id', 'first_name', 'last_name'] },
      ],
    });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found',
      });
    }

    // Validate user is part of the call
    if (userId !== videoCall.host_id && userId !== videoCall.participant_id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to join this call',
      });
    }

    // Update call status
    if (videoCall.call_status === 'initiated' || videoCall.call_status === 'scheduled') {
      await videoCall.update({
        call_status: 'ringing',
      });
    }

    // Return call details and token
    const token = userId === videoCall.host_id ? videoCall.host_token : videoCall.participant_token;

    res.json({
      success: true,
      message: 'Joined call successfully',
      data: {
        call_id: videoCall.id,
        room_id: videoCall.room_id,
        token,
        provider: videoCall.provider,
        call_status: videoCall.call_status,
        host: videoCall.host,
        participant: videoCall.participant,
      },
    });
  } catch (error) {
    console.error('Error joining video call:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining video call',
      error: error.message,
    });
  }
};

/**
 * Start a video call (when both parties are ready)
 */
exports.startCall = async (req, res) => {
  try {
    const { id } = req.params;

    const videoCall = await VideoCall.findByPk(id);
    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found',
      });
    }

    await videoCall.update({
      call_status: 'connected',
      started_at: new Date(),
    });

    res.json({
      success: true,
      message: 'Call started successfully',
      data: videoCall,
    });
  } catch (error) {
    console.error('Error starting video call:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting video call',
      error: error.message,
    });
  }
};

/**
 * End a video call
 */
exports.endCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, quality_rating, feedback } = req.body;

    const videoCall = await VideoCall.findByPk(id);
    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found',
      });
    }

    const endedAt = new Date();
    const durationSeconds = videoCall.started_at
      ? Math.floor((endedAt - new Date(videoCall.started_at)) / 1000)
      : 0;

    const updateData = {
      call_status: 'ended',
      ended_at: endedAt,
      duration_seconds: durationSeconds,
    };

    // Add feedback if provided
    if (quality_rating) {
      updateData.quality_rating = quality_rating;
    }

    if (feedback) {
      if (userId === videoCall.host_id) {
        updateData.host_feedback = feedback;
      } else if (userId === videoCall.participant_id) {
        updateData.participant_feedback = feedback;
      }
    }

    await videoCall.update(updateData);

    res.json({
      success: true,
      message: 'Call ended successfully',
      data: {
        call_id: videoCall.id,
        duration_seconds: durationSeconds,
        duration_formatted: formatDuration(durationSeconds),
      },
    });
  } catch (error) {
    console.error('Error ending video call:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending video call',
      error: error.message,
    });
  }
};

/**
 * Cancel a scheduled video call
 */
exports.cancelCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, cancellation_reason } = req.body;

    const videoCall = await VideoCall.findByPk(id);
    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found',
      });
    }

    // Only allow cancellation of scheduled or initiated calls
    if (!['scheduled', 'initiated', 'ringing'].includes(videoCall.call_status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a call that is already connected or ended',
      });
    }

    await videoCall.update({
      call_status: 'cancelled',
      cancellation_reason,
      cancelled_by: userId,
    });

    res.json({
      success: true,
      message: 'Call cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling video call:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling video call',
      error: error.message,
    });
  }
};

/**
 * Get call history for a user
 */
exports.getCallHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      page = 1, limit = 20, status, callType,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      [Op.or]: [
        { host_id: userId },
        { participant_id: userId },
      ],
    };

    if (status) whereClause.call_status = status;
    if (callType) whereClause.call_type = callType;

    const { count, rows } = await VideoCall.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'host', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'participant', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date', 'status'] },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching call history',
      error: error.message,
    });
  }
};

/**
 * Get call details by ID
 */
exports.getCallById = async (req, res) => {
  try {
    const { id } = req.params;

    const videoCall = await VideoCall.findByPk(id, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'participant', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date', 'status'] },
        { model: ChatConversation, as: 'conversation', attributes: ['id', 'conversation_type'] },
      ],
    });

    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found',
      });
    }

    res.json({
      success: true,
      data: videoCall,
    });
  } catch (error) {
    console.error('Error fetching video call:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video call',
      error: error.message,
    });
  }
};

/**
 * Update call recording status
 */
exports.updateRecordingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { recording_enabled, recording_url, recording_duration } = req.body;

    const videoCall = await VideoCall.findByPk(id);
    if (!videoCall) {
      return res.status(404).json({
        success: false,
        message: 'Video call not found',
      });
    }

    await videoCall.update({
      recording_enabled,
      recording_url,
      recording_duration,
    });

    res.json({
      success: true,
      message: 'Recording status updated successfully',
      data: {
        recording_enabled: videoCall.recording_enabled,
        recording_url: videoCall.recording_url,
      },
    });
  } catch (error) {
    console.error('Error updating recording status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating recording status',
      error: error.message,
    });
  }
};

/**
 * Get upcoming scheduled calls
 */
exports.getUpcomingCalls = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const upcomingCalls = await VideoCall.findAll({
      where: {
        [Op.or]: [
          { host_id: userId },
          { participant_id: userId },
        ],
        call_status: 'scheduled',
        scheduled_at: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        { model: User, as: 'host', attributes: ['id', 'first_name', 'last_name'] },
        { model: User, as: 'participant', attributes: ['id', 'first_name', 'last_name'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'appointment_date'] },
      ],
      order: [['scheduled_at', 'ASC']],
      limit: parseInt(limit, 10),
    });

    res.json({
      success: true,
      data: upcomingCalls,
    });
  } catch (error) {
    console.error('Error fetching upcoming calls:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming calls',
      error: error.message,
    });
  }
};

/**
 * Helper function to format duration
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
