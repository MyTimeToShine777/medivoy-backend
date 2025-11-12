// Passport Configuration - PRISMA VERSION
// COMPLETE Authentication: Email/Password + OTP + Google OAuth + Apple OAuth
// NO optional chaining - Production Ready
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import prisma from './prisma.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const configurePassport = () => {
    // ═══════════════════════════════════════════════════════════════════════════════
    // GOOGLE OAUTH STRATEGY
    // ═══════════════════════════════════════════════════════════════════════════════
    passport.use(
        'google',
        new GoogleStrategy.Strategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
                scope: ['profile', 'email'],
            },
            async(accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                    if (!email) {
                        return done(null, false, { message: 'No email provided by Google' });
                    }

                    // Check if user exists
                    let user = await prisma.user.findUnique({
                        where: { email },
                        include: {
                            sessions: true,
                            devices: true
                        }
                    });

                    if (!user) {
                        // Create new user with Google OAuth
                        user = await prisma.user.create({
                            data: {
                                firstName: profile.name.givenName || 'Google',
                                lastName: profile.name.familyName || 'User',
                                email,
                                password: null,
                                authProvider: 'google',
                                authProviderId: profile.id,
                                profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                                emailVerified: true,
                                status: 'active',
                                role: 'PATIENT',
                            }
                        });

                        // Create audit log for new Google user
                        await prisma.auditLog.create({
                            data: {
                                userId: user.userId,
                                action: 'register',
                                entity: 'User',
                                entityId: user.userId,
                                status: 'success',
                                metadata: {
                                    provider: 'google',
                                    profileId: profile.id
                                }
                            }
                        });
                    } else {
                        // Update existing user with Google OAuth info
                        if (!user.authProviderId || user.authProvider !== 'google') {
                            user = await prisma.user.update({
                                where: { userId: user.userId },
                                data: {
                                    authProvider: 'google',
                                    authProviderId: profile.id,
                                    emailVerified: true
                                }
                            });
                        }

                        // Update login count and last login
                        await prisma.user.update({
                            where: { userId: user.userId },
                            data: {
                                lastLoginAt: new Date(),
                                loginCount: {
                                    increment: 1
                                }
                            }
                        });
                    }

                    // Store OAuth tokens
                    await prisma.$executeRaw `
                        INSERT INTO oauth_tokens (user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at)
                        VALUES (${user.userId}, 'google', ${accessToken}, ${refreshToken || null}, NOW() + INTERVAL '1 hour', NOW(), NOW())
                        ON CONFLICT (user_id, provider) DO UPDATE 
                        SET access_token = ${accessToken}, 
                            refresh_token = ${refreshToken || null},
                            expires_at = NOW() + INTERVAL '1 hour',
                            updated_at = NOW()
                    `;

                    return done(null, user);
                } catch (error) {
                    console.error('❌ Google OAuth Error:', error);
                    return done(error);
                }
            }
        )
    );

    // ═══════════════════════════════════════════════════════════════════════════════
    // APPLE OAUTH STRATEGY
    // ═══════════════════════════════════════════════════════════════════════════════
    passport.use(
        'apple',
        new AppleStrategy({
                clientID: process.env.APPLE_CLIENT_ID,
                teamID: process.env.APPLE_TEAM_ID,
                keyID: process.env.APPLE_KEY_ID,
                key: process.env.APPLE_PRIVATE_KEY,
                callbackURL: process.env.APPLE_CALLBACK_URL || '/api/auth/apple/callback',
                scope: ['name', 'email'],
            },
            async(accessToken, refreshToken, idToken, profile, done) => {
                try {
                    const email = profile.email || null;
                    const appleId = profile.id || profile.sub;

                    if (!email) {
                        return done(null, false, { message: 'No email provided by Apple' });
                    }

                    // Check if user exists
                    let user = await prisma.user.findUnique({
                        where: { email },
                        include: {
                            sessions: true,
                            devices: true
                        }
                    });

                    if (!user) {
                        // Create new user with Apple OAuth
                        const firstName = profile.name && profile.name.firstName ? profile.name.firstName : 'Apple';
                        const lastName = profile.name && profile.name.lastName ? profile.name.lastName : 'User';

                        user = await prisma.user.create({
                            data: {
                                firstName,
                                lastName,
                                email,
                                password: null,
                                authProvider: 'apple',
                                authProviderId: appleId,
                                profilePicture: null,
                                emailVerified: true,
                                status: 'active',
                                role: 'PATIENT',
                            }
                        });

                        // Create audit log for new Apple user
                        await prisma.auditLog.create({
                            data: {
                                userId: user.userId,
                                action: 'register',
                                entity: 'User',
                                entityId: user.userId,
                                status: 'success',
                                metadata: {
                                    provider: 'apple',
                                    appleId: appleId
                                }
                            }
                        });
                    } else {
                        // Update existing user with Apple OAuth info
                        if (!user.authProviderId || user.authProvider !== 'apple') {
                            user = await prisma.user.update({
                                where: { userId: user.userId },
                                data: {
                                    authProvider: 'apple',
                                    authProviderId: appleId,
                                    emailVerified: true
                                }
                            });
                        }

                        // Update login count and last login
                        await prisma.user.update({
                            where: { userId: user.userId },
                            data: {
                                lastLoginAt: new Date(),
                                loginCount: {
                                    increment: 1
                                }
                            }
                        });
                    }

                    // Store OAuth tokens
                    await prisma.$executeRaw `
                        INSERT INTO oauth_tokens (user_id, provider, access_token, refresh_token, id_token, expires_at, created_at, updated_at)
                        VALUES (${user.userId}, 'apple', ${accessToken}, ${refreshToken || null}, ${idToken || null}, NOW() + INTERVAL '1 hour', NOW(), NOW())
                        ON CONFLICT (user_id, provider) DO UPDATE 
                        SET access_token = ${accessToken}, 
                            refresh_token = ${refreshToken || null},
                            id_token = ${idToken || null},
                            expires_at = NOW() + INTERVAL '1 hour',
                            updated_at = NOW()
                    `;

                    return done(null, user);
                } catch (error) {
                    console.error('❌ Apple OAuth Error:', error);
                    return done(error);
                }
            }
        )
    );

    // ═══════════════════════════════════════════════════════════════════════════════
    // SERIALIZE USER
    // ═══════════════════════════════════════════════════════════════════════════════
    passport.serializeUser((user, done) => {
        done(null, user.userId);
    });

    // ═══════════════════════════════════════════════════════════════════════════════
    // DESERIALIZE USER
    // ═══════════════════════════════════════════════════════════════════════════════
    passport.deserializeUser(async(userId, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { userId },
                include: {
                    sessions: {
                        where: {
                            isActive: true,
                            expiresAt: {
                                gt: new Date()
                            }
                        }
                    }
                }
            });

            if (!user) {
                return done(null, false);
            }

            done(null, user);
        } catch (error) {
            console.error('❌ Deserialize User Error:', error);
            done(error);
        }
    });

    console.log('✅ Passport configured with Google OAuth and Apple OAuth');
};