// Support Ticket Model - Customer support and issue tracking
// NO optional chaining - Production Ready
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const SupportTicket = sequelize.define('SupportTicket', {
        ticketId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            comment: 'Unique ticket identifier',
        },

        // ========== RELATIONSHIPS ==========
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
            index: true,
            comment: 'User who created ticket',
        },
        assignedToId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'userId',
            },
            comment: 'Support staff assigned',
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'bookingId',
            },
        },

        // ========== TICKET DETAILS ==========
        ticketNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 200],
                    msg: 'Subject must be between 5 and 200 characters',
                },
            },
            comment: 'Ticket subject',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [10, 5000],
                    msg: 'Description must be between 10 and 5000 characters',
                },
            },
            comment: 'Detailed issue description',
        },

        // ========== CATEGORIZATION ==========
        category: {
            type: DataTypes.ENUM(
                'booking_issue',
                'payment_issue',
                'appointment_issue',
                'medical_inquiry',
                'travel_assistance',
                'accommodation_issue',
                'document_issue',
                'technical_issue',
                'complaint',
                'feedback',
                'general_inquiry',
                'other'
            ),
            allowNull: false,
            index: true,
            comment: 'Ticket category',
        },
        subCategory: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        issueType: {
            type: DataTypes.ENUM(
                'bug',
                'feature_request',
                'general_question',
                'complaint',
                'suggestion',
                'urgent_issue',
                'other'
            ),
            defaultValue: 'general_question',
        },

        // ========== PRIORITY & URGENCY ==========
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high', 'urgent', 'critical'),
            defaultValue: 'medium',
            index: true,
        },
        urgency: {
            type: DataTypes.ENUM('routine', 'normal', 'high', 'emergency'),
            defaultValue: 'normal',
        },
        estimatedResolutionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'In hours',
        },

        // ========== STATUS & LIFECYCLE ==========
        status: {
            type: DataTypes.ENUM(
                'new',
                'open',
                'in_progress',
                'waiting_customer',
                'waiting_internal',
                'on_hold',
                'resolved',
                'closed',
                'reopened'
            ),
            defaultValue: 'new',
            index: true,
        },
        statusHistory: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== RESOLUTION ==========
        resolutionNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        resolution: {
            type: DataTypes.ENUM('resolved', 'unresolved', 'workaround', 'not_applicable'),
            allowNull: true,
        },
        resolvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        closedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        closedBy: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        // ========== COMMUNICATION ==========
        totalMessages: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastMessage: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        lastMessageAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastMessageBy: {
            type: DataTypes.ENUM('customer', 'support'),
            allowNull: true,
        },
        responseTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Time to first response in hours',
        },
        resolutionTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Time to resolution in hours',
        },

        // ========== ATTACHMENTS ==========
        attachmentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        attachments: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== ESCALATION ==========
        isEscalated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        escalatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        escalatedTo: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        escalationReason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        // ========== SATISFACTION ==========
        satisfactionRating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true,
            validate: { min: 0, max: 5 },
        },
        satisfactionFeedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        wouldRecommend: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        ratedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // ========== KNOWLEDGEBASE ==========
        relatedArticles: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        sentKBArticles: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // ========== AUTOMATION ==========
        automationRuleApplied: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },

        // ========== METADATA & NOTES ==========
        internalNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tags: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        customFields: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        // ========== STATUS ==========
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        timestamps: true,
        tableName: 'support_tickets',
        indexes: [
            { fields: ['userId'] },
            { fields: ['assignedToId'] },
            { fields: ['status'] },
            { fields: ['priority'] },
            { unique: true, fields: ['ticketNumber'] },
            { fields: ['createdAt'] },
        ],
    });

    SupportTicket.prototype.isOpen = function() {
        return ['new', 'open', 'in_progress', 'waiting_customer', 'waiting_internal'].includes(this.status);
    };

    SupportTicket.prototype.needsAttention = function() {
        if (this.priority === 'critical' || this.priority === 'urgent') return true;
        if (this.status === 'waiting_customer') {
            const waitTime = (new Date() - new Date(this.lastMessageAt)) / (1000 * 60 * 60);
            return waitTime > 24;
        }
        return false;
    };

    SupportTicket.prototype.getTicketNumber = function() {
        return this.ticketNumber;
    };

    SupportTicket.prototype.canBeClosed = function() {
        return this.resolution !== null && (this.status === 'resolved' || this.status === 'on_hold');
    };

    SupportTicket.associate = (models) => {
        SupportTicket.belongsTo(models.User, { foreignKey: 'userId', as: 'customer' });
        SupportTicket.belongsTo(models.User, { foreignKey: 'assignedToId', as: 'assignedTo' });
        SupportTicket.belongsTo(models.Booking, { foreignKey: 'bookingId', as: 'booking' });
    };

    return SupportTicket;
};