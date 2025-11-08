// Passport Configuration
// NO optional chaining - Production Ready
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const configurePassport = () => {
    // Google Strategy
    passport.use(
        'google',
        new GoogleStrategy.Strategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/callback',
            },
            async(accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                    if (!email) {
                        return done(null, false, { message: 'No email provided' });
                    }

                    let user = await User.findOne({ where: { email } });

                    if (!user) {
                        user = await User.create({
                            firstName: profile.name.givenName || '',
                            lastName: profile.name.familyName || '',
                            email,
                            password: await bcrypt.hash(crypto.randomBytes(16).toString('hex'), 10),
                            authProvider: 'google',
                            authProviderId: profile.id,
                            profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                            emailVerified: true,
                            status: 'active',
                        });
                    } else {
                        if (!user.authProviderId) {
                            user.authProvider = 'google';
                            user.authProviderId = profile.id;
                            await user.save();
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Facebook Strategy
    passport.use(
        'facebook',
        new FacebookStrategy.Strategy({
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: '/api/auth/facebook/callback',
                profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
            },
            async(accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                    if (!email) {
                        return done(null, false, { message: 'No email provided' });
                    }

                    let user = await User.findOne({ where: { email } });

                    if (!user) {
                        user = await User.create({
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
                    } else {
                        if (!user.authProviderId) {
                            user.authProvider = 'facebook';
                            user.authProviderId = profile.id;
                            await user.save();
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
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
            const user = await User.findByPk(userId);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};