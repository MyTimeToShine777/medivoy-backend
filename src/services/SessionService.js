'use strict';

import { Session, User } from '../models/index.js';
import { cacheService } from '../config/redis.js';

export class SessionService {
    // ═══════════════════════════════════════════════════════════════════════════════
    // CREATE SESSION
    // ═══════════════════════════════════════════════════════════════════════════════

    async createSession(userId, deviceInfo, ipAddress) {
        try {
            const sessionId = `session_${userId}_${Date.now()}`;

            const session = await Session.create({
                sessionId,
                userId,
                deviceName: deviceInfo.name,
                deviceType: deviceInfo.type,
                userAgent: deviceInfo.userAgent,
                ipAddress,
                isActive: true,
                createdAt: new Date()
            });

            // Cache session for quick lookup
            await cacheService.set(`session_${sessionId}`, JSON.stringify(session), 7 * 24 * 60 * 60);

            console.log(`✅ Session created: ${sessionId}`);

            return session;
        } catch (error) {
            console.error('❌ Create session error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // GET USER SESSIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    async getUserSessions(userId) {
        try {
            const sessions = await Session.findAll({
                where: { userId, isActive: true },
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            return sessions;
        } catch (error) {
            console.error('❌ Get sessions error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // END SESSION
    // ═══════════════════════════════════════════════════════════════════════════════

    async endSession(sessionId) {
        try {
            await Session.update({ isActive: false, endedAt: new Date() }, { where: { sessionId } });

            // Remove from cache
            await cacheService.delete(`session_${sessionId}`);

            console.log(`✅ Session ended: ${sessionId}`);

            return true;
        } catch (error) {
            console.error('❌ End session error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // END ALL OTHER SESSIONS (Logout from all devices)
    // ═══════════════════════════════════════════════════════════════════════════════

    async endAllOtherSessions(userId, currentSessionId) {
        try {
            const sessions = await Session.findAll({
                where: { userId, sessionId: {
                        [require('sequelize').Op.ne]: currentSessionId } }
            });

            for (const session of sessions) {
                await this.endSession(session.sessionId);
            }

            console.log(`✅ All other sessions ended for user: ${userId}`);

            return sessions.length;
        } catch (error) {
            console.error('❌ End all sessions error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VERIFY SESSION
    // ═══════════════════════════════════════════════════════════════════════════════

    async verifySession(sessionId) {
        try {
            const session = await Session.findOne({
                where: { sessionId, isActive: true }
            });

            if (!session) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('❌ Verify session error:', error.message);
            return false;
        }
    }
}

export const sessionService = new SessionService();
export default sessionService;