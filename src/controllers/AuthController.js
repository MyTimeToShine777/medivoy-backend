// Authentication Controller - Email/Password + OAuth - NO optional chaining
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import AuthService from '../services/AuthService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';

class AuthController {
    // Register
    register = asyncHandler(async(req, res) => {
        try {
            const { email, password, firstName, lastName, phone, role } = req.body;

            const result = await AuthService.register({
                email,
                password,
                firstName,
                lastName,
                phone,
                role,
            });

            logger.info(`Registration successful for: ${email}`);
            return sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.BOOKING_CREATED, result);
        } catch (error) {
            logger.error('Registration error:', error.message);
            throw error;
        }
    });

    // Login with email/password
    login = asyncHandler(async(req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Email and password are required');
            }

            const result = await AuthService.login(email, password);

            logger.info(`Login successful for: ${email}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Login successful', result);
        } catch (error) {
            logger.error('Login error:', error.message);
            throw error;
        }
    });

    // Google OAuth callback
    googleOAuthCallback = asyncHandler(async(req, res) => {
        try {
            const googleData = req.user;

            if (!googleData) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Google authentication failed');
            }

            const result = await AuthService.googleOAuthLogin(googleData);

            logger.info(`Google OAuth login successful for: ${googleData.email}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Google login successful', result);
        } catch (error) {
            logger.error('Google OAuth error:', error.message);
            throw error;
        }
    });

    // Facebook OAuth callback
    facebookOAuthCallback = asyncHandler(async(req, res) => {
        try {
            const facebookData = req.user;

            if (!facebookData) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Facebook authentication failed');
            }

            const result = await AuthService.facebookOAuthLogin(facebookData);

            logger.info(`Facebook OAuth login successful for: ${facebookData.email}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Facebook login successful', result);
        } catch (error) {
            logger.error('Facebook OAuth error:', error.message);
            throw error;
        }
    });

    // Refresh token
    refreshToken = asyncHandler(async(req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Refresh token is required');
            }

            const result = await AuthService.refreshToken(refreshToken);

            logger.info('Token refresh successful');
            return sendSuccess(res, HTTP_STATUS.OK, 'Token refreshed', result);
        } catch (error) {
            logger.error('Token refresh error:', error.message);
            throw error;
        }
    });

    // Logout
    logout = asyncHandler(async(req, res) => {
        try {
            const userId = req.user ? req.user.userId : null;

            if (!userId) {
                return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'User not authenticated');
            }

            const result = await AuthService.logout(userId);

            logger.info(`Logout successful for user: ${userId}`);
            return sendSuccess(res, HTTP_STATUS.OK, 'Logout successful', result);
        } catch (error) {
            logger.error('Logout error:', error.message);
            throw error;
        }
    });
}

export default new AuthController();