// Auth Service - Complete authentication with OAuth + Email
// NO optional chaining - Production Ready
import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

class AuthService {
    constructor() {
        // Email transporter
        this.emailTransporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        this.initializePassport();
    }

    // ========== INITIALIZE PASSPORT ==========
    initializePassport() {
        // Google Strategy
        passport.use(
            new GoogleStrategy.Strategy({
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
                },
                async(accessToken, refreshToken, profile, done) => {
                    try {
                        let user = await prisma.user.findFirst({
                            where: { email: profile.emails[0].value },
                        });

                        if (!user) {
                            user = await prisma.user.create({ data: {
                                firstName: profile.name.givenName || '',
                                lastName: profile.name.familyName || '',
                                email: profile.emails[0].value,
                                password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
                                authProvider: 'google',
                                authProviderId: profile.id,
                                profilePicture: profile.photos[0].value || null,
                                emailVerified: true,
                                status: 'active',
                            });
                        } else if (!user.authProviderId) {
                            user.authProvider = 'google';
                            user.authProviderId = profile.id;
                            await prisma.user.update({
                                where: { userId: user.userId },
                                data: { authProvider: 'google', authProviderId: profile.id }
                            });
                        }

                        return done(null, user);
                    } catch (error) {
                        return done(error, null);
                    }
                }
            )
        );

        // Facebook Strategy
        passport.use(
            new FacebookStrategy.Strategy({
                    clientID: process.env.FACEBOOK_APP_ID,
                    clientSecret: process.env.FACEBOOK_APP_SECRET,
                    callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/auth/facebook/callback',
                    profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
                },
                async(accessToken, refreshToken, profile, done) => {
                    try {
                        let user = await prisma.user.findFirst({
                            where: { email: profile.emails[0].value },
                        });

                        if (!user) {
                            user = await prisma.user.create({ data: {
                                firstName: profile.name.givenName || '',
                                lastName: profile.name.familyName || '',
                                email: profile.emails[0].value,
                                password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
                                authProvider: 'facebook',
                                authProviderId: profile.id,
                                profilePicture: profile.photos[0].value || null,
                                emailVerified: true,
                                status: 'active',
                            });
                        } else if (!user.authProviderId) {
                            user.authProvider = 'facebook';
                            user.authProviderId = profile.id;
                            await prisma.user.update({
                                where: { userId: user.userId },
                                data: { authProvider: 'facebook', authProviderId: profile.id }
                            });
                        }

                        return done(null, user);
                    } catch (error) {
                        return done(error, null);
                    }
                }
            )
        );

        // Serialize user
        passport.serializeUser((user, done) => {
            done(null, user.userId);
        });

        // Deserialize user
        passport.deserializeUser(async(userId, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        });
    }

    // ========== TRADITIONAL EMAIL/PASSWORD SIGNUP ==========
    async signupWithEmail(signupData) {
        try {
            const existingUser = await prisma.user.findFirst({
                where: { email: signupData.email },
            });

            if (existingUser) {
                return {
                    success: false,
                    error: 'Email already registered',
                };
            }

            if (!this.validatePassword(signupData.password)) {
                return {
                    success: false,
                    error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
                };
            }

            const hashedPassword = await bcrypt.hash(signupData.password, 10);

            const user = await prisma.user.create({ data: {
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                email: signupData.email,
                password: hashedPassword,
                authProvider: 'email',
                status: 'active',
            });

            // Send verification email
            await this.sendVerificationEmail(user.email);

            return {
                success: true,
                data: {
                    userId: user.userId,
                    email: user.email,
                    message: 'Signup successful. Please verify your email.',
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== TRADITIONAL EMAIL/PASSWORD LOGIN ==========
    async loginWithEmail(email, password) {
        try {
            const user = await prisma.user.findFirst({ where: { email } });

            if (!user) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return {
                    success: false,
                    error: 'Invalid email or password',
                };
            }

            if (user.status === 'inactive') {
                return {
                    success: false,
                    error: 'Account is inactive',
                };
            }

            const accessToken = this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            return {
                success: true,
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== GOOGLE OAUTH LOGIN ==========
    async handleGoogleCallback(profile) {
        try {
            let user = await prisma.user.findFirst({
                where: { email: profile.emails[0].value },
            });

            if (!user) {
                user = await prisma.user.create({ data: {
                    firstName: profile.name.givenName || '',
                    lastName: profile.name.familyName || '',
                    email: profile.emails[0].value,
                    password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
                    authProvider: 'google',
                    authProviderId: profile.id,
                    profilePicture: profile.photos[0].value || null,
                    emailVerified: true,
                    status: 'active',
                });
            } else if (!user.authProviderId) {
                user.authProvider = 'google';
                user.authProviderId = profile.id;
                await prisma.user.update({
                    where: { userId: user.userId },
                    data: { authProvider: 'google', authProviderId: profile.id }
                });
            }

            const accessToken = this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            return {
                success: true,
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== FACEBOOK OAUTH LOGIN ==========
    async handleFacebookCallback(profile) {
        try {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

            if (!email) {
                return {
                    success: false,
                    error: 'Facebook email not provided',
                };
            }

            let user = await prisma.user.findFirst({ where: { email } });

            if (!user) {
                user = await prisma.user.create({ data: {
                    firstName: profile.name.givenName || '',
                    lastName: profile.name.familyName || '',
                    email,
                    password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
                    authProvider: 'facebook',
                    authProviderId: profile.id,
                    profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                    emailVerified: true,
                    status: 'active',
                });
            } else if (!user.authProviderId) {
                user.authProvider = 'facebook';
                user.authProviderId = profile.id;
                await prisma.user.update({
                    where: { userId: user.userId },
                    data: { authProvider: 'facebook', authProviderId: profile.id }
                });
            }

            const accessToken = this.generateAccessToken(user);
            const refreshToken = await this.generateRefreshToken(user);

            return {
                success: true,
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== REFRESH TOKEN ==========
    async refreshAccessToken(refreshToken) {
        try {
            const token = await prisma.refreshToken.findFirst({
                where: { token: refreshToken, isRevoked: false },
            });

            if (!token) {
                return { success: false, error: 'Invalid refresh token' };
            }

            if (token.isExpired()) {
                return { success: false, error: 'Refresh token expired' };
            }

            const user = await prisma.user.findUnique({ where: { id: token.userId } });

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            const newAccessToken = this.generateAccessToken(user);

            return {
                success: true,
                data: { accessToken: newAccessToken },
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== LOGOUT ==========
    async logout(refreshToken) {
        try {
            const token = await prisma.refreshToken.findFirst({
                where: { token: refreshToken },
            });

            if (token) {
                await token.revoke('User logout');
            }

            return { success: true, message: 'Logged out successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== SEND VERIFICATION EMAIL ==========
    async sendVerificationEmail(email) {
        try {
            const verificationLink = `${process.env.APP_URL}/auth/verify-email?email=${email}`;

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Email Verification - Medivoy',
                html: `
                    <h2>Welcome to Medivoy</h2>
                    <p>Please verify your email by clicking the link below:</p>
                    <a href="${verificationLink}">Verify Email</a>
                    <p>This link expires in 24 hours.</p>
                `,
            };

            await this.emailTransporter.sendMail(mailOptions);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== VERIFY EMAIL ==========
    async verifyEmail(email) {
        try {
            const user = await prisma.user.findFirst({ where: { email } });

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            user.emailVerified = true;
            user.emailVerifiedAt = new Date();
            await prisma.user.update({
                where: { userId: user.userId },
                data: { emailVerified: true, emailVerifiedAt: new Date() }
            });

            return { success: true, message: 'Email verified successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== REQUEST PASSWORD RESET ==========
    async requestPasswordReset(email) {
        try {
            const user = await prisma.user.findFirst({ where: { email } });

            if (!user) {
                return {
                    success: false,
                    error: 'If email exists, reset link has been sent',
                };
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = await bcrypt.hash(resetToken, 10);

            await prisma.passwordReset.create({ data: {
                userId: user.userId,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });

            const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Password Reset - Medivoy',
                html: `
                    <h2>Password Reset Request</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="${resetLink}">Reset Password</a>
                    <p>This link expires in 24 hours.</p>
                    <p>If you didn't request this, ignore this email.</p>
                `,
            };

            await this.emailTransporter.sendMail(mailOptions);

            return {
                success: true,
                message: 'Password reset link sent to email',
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== RESET PASSWORD ==========
    async resetPassword(token, newPassword) {
        try {
            const resetRecord = await prisma.passwordReset.findFirst({
                where: { used: false },
            });

            if (!resetRecord) {
                return { success: false, error: 'Invalid or expired reset token' };
            }

            if (new Date(resetRecord.expiresAt) < new Date()) {
                return { success: false, error: 'Reset token has expired' };
            }

            const isTokenValid = await bcrypt.compare(token, resetRecord.token);

            if (!isTokenValid) {
                return { success: false, error: 'Invalid reset token' };
            }

            if (!this.validatePassword(newPassword)) {
                return {
                    success: false,
                    error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
                };
            }

            const user = await prisma.user.findUnique({ where: { id: resetRecord.userId } });

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await prisma.user.update({
                where: { userId: user.userId },
                data: { password: hashedPassword }
            });

            resetRecord.used = true;
            resetRecord.usedAt = new Date();
            await prisma.resetRecord.update({
                where: { resetRecordId: resetRecord.resetRecordId },
                data: { used: true, usedAt: new Date() }
            });

            return { success: true, message: 'Password reset successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== CHANGE PASSWORD ==========
    async changePassword(userId, oldPassword, newPassword) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordValid) {
                return { success: false, error: 'Old password is incorrect' };
            }

            if (!this.validatePassword(newPassword)) {
                return {
                    success: false,
                    error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
                };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await prisma.user.update({
                where: { userId: user.userId },
                data: { password: hashedPassword }
            });

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ========== TOKEN VERIFICATION ==========
    verifyToken(token) {
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-secret-key'
            );
            return { valid: true, decoded };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    // ========== HELPER METHODS ==========
    generateAccessToken(user) {
        return jwt.sign({
                userId: user.userId,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' }
        );
    }

    async generateRefreshToken(user) {
        const token = jwt.sign({ userId: user.userId },
            process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', { expiresIn: '7d' }
        );

        await prisma.refreshToken.create({ data: {
            userId: user.userId,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'active',
        });

        return token;
    }

    validatePassword(password) {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);

        return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers;
    }
}

export default new AuthService();