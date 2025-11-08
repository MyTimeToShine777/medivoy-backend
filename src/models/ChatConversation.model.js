// Chat Conversation Model - Customer support chat sessions
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ChatConversation = sequelize.define('ChatConversation', {
        conversationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique conversation identifier',
        },

        // ========== PARTICIPANTS ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Patient initiating chat',
        },
        staffId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'Assigned staff member',
        },
        staffName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        departmentId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'departmentId',
            },
            comment: 'Department chat is routed to',
        },

        // ========== RELATIONSHIP CONTEXT ==========
        relatedBookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
            comment: 'If chat is about specific booking',
        },
        relatedEntityType: {
            type: DataTypes.ENUM('booking', 'appointment', 'payment', 'document', 'general'),
            defaultValue: 'general',
        },
        relatedEntityId: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        // ========== CHAT METADATA ==========
        subject: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [3, 150],
                    msg: 'Subject must be between 3 and 150 characters',
                },
            },
            comment: 'Chat topic/subject',
        },
        category: {
            type: DataTypes.ENUM(
                'booking_inquiry',
                'booking_modification',
                'payment_issue',
                'refund_request',
                'appointment_issue',
                'medical_question',
                'document_issue',
                'travel_assistance',
                'accommodation_issue',
                'insurance_inquiry',
                'general_support',
                'complaint',
                'feedback',
                'urgent',
                'other'
            ),
            allowNull: true,
            comment: 'Chat category/reason',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Initial description of issue',
        },

        // ========== CHAT STATUS ==========
        status: {
            type: DataTypes.ENUM(
                'open',
                'assigned',
                'in_progress',
                'waiting_customer',
                'waiting_staff',
                'on_hold',
                'closed',
                'escalated',
                'archived'
            ),
            defaultValue: 'open',
            index: true,
            comment: 'Chat lifecycle status',
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Status change history',
        },

        // ========== PRIORITY & URGENCY ==========
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high', 'urgent', 'critical'),
            defaultValue: 'normal',
            comment: 'Chat priority level',
        },
        isUrgent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        needsEscalation: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        escalationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        escalatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        escalatedTo: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
        },

        // ========== MESSAGING DETAILS ==========
        totalMessages: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        unreadByPatient: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        unreadByStaff: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastMessageAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'When last message was sent',
        },
        lastMessageBy: {
            type: DataTypes.ENUM('patient', 'staff'),
            allowNull: true,
        },
        lastMessagePreview: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },

        // ========== RESPONSE TIME TRACKING ==========
        firstResponseAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        firstResponseTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Time to first response in minutes',
        },
        averageResponseTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        lastResponseAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== RESOLUTION ==========
        resolvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resolutionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Time to resolution in minutes',
        },
        resolutionNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isResolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== CLOSURE ==========
        closedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        closedBy: {
            type: DataTypes.ENUM('patient', 'staff', 'system'),
            allowNull: true,
        },
        closureReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        autoClosedAfterDays: {
            type: DataTypes.INTEGER,
            defaultValue: 14,
            comment: 'Auto-close inactive chats after days',
        },

        // ========== ATTACHMENTS & FILES ==========
        attachmentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Document/file URLs',
        },

        // ========== SATISFACTION & FEEDBACK ==========
        satisfactionRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        satisfactionFeedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ratedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        staffPerformanceRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
        },

        // ========== CONVERSATION SETTINGS ==========
        isPrivate: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        allowSharing: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sharedWith: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== AUTOMATION ==========
        automationRuleApplied: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: 'Automation rules triggered',
        },
        botHandled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        botTransferredToHuman: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== NOTES & METADATA ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Staff internal notes',
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== ARCHIVAL ==========
        isArchived: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        archivedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
    }, {
        timestamps: true,
        tableName: 'chat_conversations',
        indexes: [
            { fields: ['userId'] },
            { fields: ['staffId'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['createdAt'] },
            { fields: ['lastMessageAt'] },
        ],
        scopes: {
            open: {
                where: { status: 'open' },
            },
            assigned: {
                where: { staffId: {
                        [sequelize.Sequelize.Op.ne]: null } },
            },
            unresolved: {
                where: { isResolved: false },
            },
            urgent: {
                where: { priority: 'urgent' },
            },
        },
    });

    // ========== INSTANCE METHODS ==========
    ChatConversation.prototype.isOpen = function() {
        return ['open', 'assigned', 'in_progress', 'waiting_customer', 'waiting_staff'].includes(this.status);
    };

    ChatConversation.prototype.canBeClosed = function() {
        return this.status !== 'closed' && this.isResolved;
    };

    ChatConversation.prototype.getResolutionTimeInHours = function() {
        if (!this.resolvedAt) return null;
        return ((new Date(this.resolvedAt) - new Date(this.createdAt)) / (1000 * 60 * 60)).toFixed(2);
    };

    ChatConversation.prototype.needsAttention = function() {
        if (this.needsEscalation) return true;
        if (this.priority === 'urgent' && !this.staffId) return true;
        const lastMessageMinutesAgo = (new Date() - new Date(this.lastMessageAt)) / (1000 * 60);
        return lastMessageMinutesAgo > 30 && this.status !== 'closed';
    };

    ChatConversation.prototype.assignToStaff = function(staffId, staffName) {
        this.staffId = staffId;
        this.staffName = staffName;
        this.status = 'assigned';
        return this.save();
    };

    // ========== ASSOCIATIONS ==========
    ChatConversation.associate = (models) => {
        ChatConversation.belongsTo(models.User, { foreignKey: 'userId', as: 'patient' });
        ChatConversation.belongsTo(models.User, { foreignKey: 'staffId', as: 'staff' });
        ChatConversation.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
        ChatConversation.belongsTo(models.Booking, { foreignKey: 'relatedBookingId', as: 'booking' });
        ChatConversation.hasMany(models.ChatMessage, { foreignKey: 'conversationId', as: 'messages' });
    };

    return ChatConversation;
};