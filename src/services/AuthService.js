// Authentication Service - Email/Password + OAuth - NO optional chaining
import { sequelize } from '../config/database.js';
import logger from '../utils/logger.js';
import passwordUtil from '../utils/password.js';
import jwtUtil from '../utils/jwt.js';
import cacheUtil from '../utils/cache.js';
import helpers from '../utils/helpers.js';
import {
    AuthenticationError,
    ValidationError,
    ConflictError,
    NotFoundError,
} from '../exceptions/index.js';
import validators from '../utils/validators.js';

class AuthService {
    // Register new user
    async register(userData) {
        try {
            if (!userData || typeof userData !== 'object') {
                throw new ValidationError('User data is required');
            }

            // Validate required fields
            const requiredFields = ['email', 'password', 'firstName', 'lastName', 'phone', 'role'];
            if (!validators.hasRequiredFields(userData, requiredFields)) {
                throw new ValidationError('Missing required fields: email, password, firstName, lastName, phone, role');
            }

            // Validate email format
            if (!validators.isValidEmail(userData.email)) {
                throw new ValidationError('Invalid email format');
            }

            // Validate password strength
            if (!validators.isValidPassword(userData.password)) {
                throw new ValidationError('Password must be at least 8 characters with uppercase, lowercase, number and special character');
            }

            // Validate phone format
            if (!validators.isValidPhone(userData.phone)) {
                throw new ValidationError('Invalid phone number format');
            }

            // Check if user already exists
            const User = sequelize.models.User;
            const existingUser = await User.findOne({
                where: {
                    email: userData.email,
                },
            });

            if (existingUser) {
                throw new ConflictError('Email already registered');
            }

            // Hash password
            const hashedPassword = await passwordUtil.hashPassword(userData.password);

            // Create user
            const user = await User.create({
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phone: userData.phone,
                role: userData.role,
                isActive: true,
                emailVerified: false,
            });

            logger.info(`User registered: ${userData.email}`);

            // Generate tokens
            const accessToken = jwtUtil.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const refreshToken = jwtUtil.generateRefreshToken({
                userId: user.id,
                email: user.email,
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            logger.error('User registration failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Login with email and password
    async login(email, password) {
        try {
            if (!email || !password) {
                throw new ValidationError('Email and password are required');
            }

            if (!validators.isValidEmail(email)) {
                throw new ValidationError('Invalid email format');
            }

            // Find user
            const User = sequelize.models.User;
            const user = await User.findOne({
                where: {
                    email: email,
                },
            });

            if (!user) {
                throw new AuthenticationError('Invalid email or password');
            }

            // Check if user is active
            if (!user.isActive) {
                throw new AuthenticationError('User account is inactive');
            }

            // Verify password
            const isPasswordValid = await passwordUtil.verifyPassword(password, user.password);

            if (!isPasswordValid) {
                throw new AuthenticationError('Invalid email or password');
            }

            logger.info(`User logged in: ${email}`);

            // Generate tokens
            const accessToken = jwtUtil.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const refreshToken = jwtUtil.generateRefreshToken({
                userId: user.id,
                email: user.email,
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            logger.error('Login failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Google OAuth login/register
    async googleOAuthLogin(googleData) {
        try {
            if (!googleData || !googleData.email || !googleData.sub) {
                throw new ValidationError('Invalid Google data');
            }

            const User = sequelize.models.User;

            // Find user by email
            let user = await User.findOne({
                where: {
                    email: googleData.email,
                },
            });

            // If user doesn't exist, create new user
            if (!user) {
                const randomPassword = helpers.generateRandomString(16);
                const hashedPassword = await passwordUtil.hashPassword(randomPassword);

                user = await User.create({
                    email: googleData.email,
                    password: hashedPassword,
                    firstName: googleData.given_name || 'Google',
                    lastName: googleData.family_name || 'User',
                    phone: '', // Empty for OAuth
                    role: 'patient', // Default role
                    isActive: true,
                    emailVerified: true, // Google email is verified
                    googleId: googleData.sub,
                    avatar: googleData.picture || null,
                });

                logger.info(`New user created via Google OAuth: ${googleData.email}`);
            } else {
                // Update Google ID if not set
                if (!user.googleId) {
                    user.googleId = googleData.sub;
                    await user.save();
                }
            }

            // Check if user is active
            if (!user.isActive) {
                throw new AuthenticationError('User account is inactive');
            }

            logger.info(`User logged in via Google: ${googleData.email}`);

            // Generate tokens
            const accessToken = jwtUtil.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const refreshToken = jwtUtil.generateRefreshToken({
                userId: user.id,
                email: user.email,
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatar: user.avatar,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            logger.error('Google OAuth login failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Facebook OAuth login/register
    async facebookOAuthLogin(facebookData) {
        try {
            if (!facebookData || !facebookData.email || !facebookData.id) {
                throw new ValidationError('Invalid Facebook data');
            }

            const User = sequelize.models.User;

            // Find user by email
            let user = await User.findOne({
                where: {
                    email: facebookData.email,
                },
            });

            // If user doesn't exist, create new user
            if (!user) {
                const randomPassword = helpers.generateRandomString(16);
                const hashedPassword = await passwordUtil.hashPassword(randomPassword);

                user = await User.create({
                    email: facebookData.email,
                    password: hashedPassword,
                    firstName: facebookData.first_name || 'Facebook',
                    lastName: facebookData.last_name || 'User',
                    phone: '', // Empty for OAuth
                    role: 'patient', // Default role
                    isActive: true,
                    emailVerified: true, // Facebook email is verified
                    facebookId: facebookData.id,
                    avatar: facebookData.picture && facebookData.picture.data ?
                        facebookData.picture.data.url :
                        null,
                });

                logger.info(`New user created via Facebook OAuth: ${facebookData.email}`);
            } else {
                // Update Facebook ID if not set
                if (!user.facebookId) {
                    user.facebookId = facebookData.id;
                    await user.save();
                }
            }

            // Check if user is active
            if (!user.isActive) {
                throw new AuthenticationError('User account is inactive');
            }

            logger.info(`User logged in via Facebook: ${facebookData.email}`);

            // Generate tokens
            const accessToken = jwtUtil.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const refreshToken = jwtUtil.generateRefreshToken({
                userId: user.id,
                email: user.email,
            });

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatar: user.avatar,
                },
                accessToken,
                refreshToken,
            };
        } catch (error) {
            logger.error('Facebook OAuth login failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Refresh token
    async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new ValidationError('Refresh token is required');
            }

            // Verify refresh token
            const decoded = jwtUtil.verifyRefreshToken(refreshToken);

            const User = sequelize.models.User;
            const user = await User.findByPk(decoded.userId);

            if (!user) {
                throw new NotFoundError('User', 'not found');
            }

            if (!user.isActive) {
                throw new AuthenticationError('User account is inactive');
            }

            logger.info(`Token refreshed for user: ${user.email}`);

            // Generate new access token
            const newAccessToken = jwtUtil.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                accessToken: newAccessToken,
            };
        } catch (error) {
            logger.error('Token refresh failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }

    // Logout
    async logout(userId) {
        try {
            if (!userId) {
                throw new ValidationError('User ID is required');
            }

            logger.info(`User logged out: ${userId}`);
            return {
                message: 'Logout successful',
            };
        } catch (error) {
            logger.error('Logout failed');
            logger.error('Error details:', error.message);
            throw error;
        }
    }
}

export default new AuthService();