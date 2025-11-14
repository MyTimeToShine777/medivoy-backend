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
    (req, res) => AuthController.register(req, res)
);

router.post(
    '/login',
    authRateLimiter,
    validateLogin,
    (req, res) => AuthController.login(req, res)
);

router.post(
    '/logout',
    authenticateToken,
    (req, res) => AuthController.logout(req, res)
);

router.post(
    '/refresh-token',
    (req, res) => AuthController.refreshToken(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/verify-email',
    (req, res) => AuthController.verifyEmail(req, res)
);

router.post(
    '/resend-verification-email',
    authRateLimiter,
    (req, res) => AuthController.resendVerificationEmail(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD RESET
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/forgot-password',
    authRateLimiter,
    (req, res) => AuthController.forgotPassword(req, res)
);

router.post(
    '/reset-password',
    (req, res) => AuthController.resetPassword(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE/EMAIL OTP AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/send-otp',
    authRateLimiter,
    (req, res) => AuthController.sendOTP(req, res)
);

router.post(
    '/verify-otp',
    authRateLimiter,
    (req, res) => AuthController.verifyOTP(req, res)
);

router.post(
    '/resend-otp',
    authRateLimiter,
    (req, res) => AuthController.resendOTP(req, res)
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
    (req, res) => AuthController.oauthCallback(req, res)
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
    (req, res) => AuthController.oauthCallback(req, res)
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
    (req, res) => AuthController.oauthCallback(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// SESSION MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/sessions',
    authenticateToken,
    (req, res) => AuthController.getUserSessions(req, res)
);

router.post(
    '/sessions/:sessionId/end',
    authenticateToken,
    (req, res) => AuthController.endSession(req, res)
);

router.post(
    '/sessions/end-all-others',
    authenticateToken,
    (req, res) => AuthController.endAllOtherSessions(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/devices',
    authenticateToken,
    (req, res) => AuthController.getUserDevices(req, res)
);

router.delete(
    '/devices/:deviceId',
    authenticateToken,
    (req, res) => AuthController.removeDevice(req, res)
);

router.delete(
    '/devices',
    authenticateToken,
    (req, res) => AuthController.removeAllDevices(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY - TWO FACTOR AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/2fa/enable',
    authenticateToken,
    (req, res) => AuthController.enable2FA(req, res)
);

router.post(
    '/2fa/verify',
    (req, res) => AuthController.verify2FA(req, res)
);

router.post(
    '/2fa/disable',
    authenticateToken,
    (req, res) => AuthController.disable2FA(req, res)
);

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/audit-logs',
    authenticateToken,
    (req, res) => AuthController.getUserAuditLogs(req, res)
);

export default router;
