'use strict';

import { Router } from 'express';
import passport from 'passport';
import AuthController from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.middleware.js';
import { validateLogin, validateRegister } from '../middleware/validation.middleware.js';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES - ULTRA-COMPREHENSIVE
// NO optional chaining - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL/PASSWORD AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/register',
    authRateLimiter,
    validateRegister,
    AuthController.register.bind(AuthController)
);

router.post(
    '/login',
    authRateLimiter,
    validateLogin,
    AuthController.login.bind(AuthController)
);

router.post(
    '/logout',
    authenticateToken,
    AuthController.logout.bind(AuthController)
);

router.post(
    '/refresh-token',
    AuthController.refreshToken.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/verify-email',
    AuthController.verifyEmail.bind(AuthController)
);

router.post(
    '/resend-verification-email',
    authRateLimiter,
    AuthController.resendVerificationEmail.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/forgot-password',
    authRateLimiter,
    AuthController.forgotPassword.bind(AuthController)
);

router.post(
    '/reset-password',
    AuthController.resetPassword.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE/EMAIL OTP AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/send-otp',
    authRateLimiter,
    AuthController.sendOTP.bind(AuthController)
);

router.post(
    '/verify-otp',
    authRateLimiter,
    AuthController.verifyOTP.bind(AuthController)
);

router.post(
    '/resend-otp',
    authRateLimiter,
    AuthController.resendOTP.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// OAUTH - GOOGLE
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    AuthController.oauthCallback.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// OAUTH - FACEBOOK
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    AuthController.oauthCallback.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// OAUTH - APPLE
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/apple',
    passport.authenticate('apple')
);

router.post(
    '/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/login' }),
    AuthController.oauthCallback.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// SESSION MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/sessions',
    authenticateToken,
    AuthController.getUserSessions.bind(AuthController)
);

router.post(
    '/sessions/:sessionId/end',
    authenticateToken,
    AuthController.endSession.bind(AuthController)
);

router.post(
    '/sessions/end-all-others',
    authenticateToken,
    AuthController.endAllOtherSessions.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/devices',
    authenticateToken,
    AuthController.getUserDevices.bind(AuthController)
);

router.delete(
    '/devices/:deviceId',
    authenticateToken,
    AuthController.removeDevice.bind(AuthController)
);

router.delete(
    '/devices',
    authenticateToken,
    AuthController.removeAllDevices.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY - TWO FACTOR AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/2fa/enable',
    authenticateToken,
    AuthController.enable2FA.bind(AuthController)
);

router.post(
    '/2fa/verify',
    AuthController.verify2FA.bind(AuthController)
);

router.post(
    '/2fa/disable',
    authenticateToken,
    AuthController.disable2FA.bind(AuthController)
);

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/audit-logs',
    authenticateToken,
    AuthController.getUserAuditLogs.bind(AuthController)
);

export default router;