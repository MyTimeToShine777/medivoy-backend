'use strict';

import crypto from 'crypto';
import { User } from '../models/index.js';
import { cacheService } from '../config/redis.js';

export class EmailConfirmationService {
    // ═══════════════════════════════════════════════════════════════════════════════
    // GENERATE VERIFICATION TOKEN
    // ═══════════════════════════════════════════════════════════════════════════════

    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SEND VERIFICATION EMAIL (Placeholder)
    // ═══════════════════════════════════════════════════════════════════════════════

    async sendVerificationEmail(email, token) {
        try {
            // TODO: Integrate with email service (SendGrid, AWS SES, etc)
            const verificationUrl = `${process.env.API_BASE_URL}/api/auth/verify-email?token=${token}`;

            console.log(`📧 Verification email sent to: ${email}`);
            console.log(`   Verification URL: ${verificationUrl}`);

            return true;
        } catch (error) {
            console.error('❌ Send verification email error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // RESEND VERIFICATION EMAIL
    // ═══════════════════════════════════════════════════════════════════════════════

    async resendVerificationEmail(email) {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            if (user.emailVerified) {
                return { success: false, error: 'Email already verified' };
            }

            // Check if recently sent (prevent spam)
            const recentSend = await cacheService.get(`resend_verification_${email}`);
            if (recentSend) {
                return { success: false, error: 'Please wait before requesting another email' };
            }

            // Generate new token
            const verificationToken = this.generateVerificationToken();
            const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await user.update({
                verificationToken,
                verificationTokenExpiry
            });

            // Send email
            await this.sendVerificationEmail(email, verificationToken);

            // Cache to prevent spam (1 hour cooldown)
            await cacheService.set(`resend_verification_${email}`, 'true', 60 * 60);

            console.log(`✅ Verification email resent to: ${email}`);

            return { success: true, message: 'Verification email sent' };
        } catch (error) {
            console.error('❌ Resend verification error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // VERIFY EMAIL TOKEN
    // ═══════════════════════════════════════════════════════════════════════════════

    async verifyEmailToken(token) {
        try {
            const user = await User.findOne({
                where: {
                    verificationToken: token,
                    verificationTokenExpiry: {
                        [require('sequelize').Op.gt]: new Date() }
                }
            });

            if (!user) {
                return { success: false, error: 'Invalid or expired token' };
            }

            await user.update({
                emailVerified: true,
                verificationToken: null,
                verificationTokenExpiry: null
            });

            console.log(`✅ Email verified for: ${user.email}`);

            return { success: true, message: 'Email verified successfully' };
        } catch (error) {
            console.error('❌ Verify email token error:', error.message);
            throw error;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CHECK TOKEN EXPIRY
    // ═══════════════════════════════════════════════════════════════════════════════

    async checkTokenExpiry(token) {
        try {
            const user = await User.findOne({
                where: { verificationToken: token }
            });

            if (!user) {
                return { exists: false };
            }

            const isExpired = user.verificationTokenExpiry < new Date();

            return {
                exists: true,
                isExpired,
                email: user.email,
                expiresAt: user.verificationTokenExpiry
            };
        } catch (error) {
            console.error('❌ Check token expiry error:', error.message);
            throw error;
        }
    }
}

export const emailConfirmationService = new EmailConfirmationService();
export default emailConfirmationService;