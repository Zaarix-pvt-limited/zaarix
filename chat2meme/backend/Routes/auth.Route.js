const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/auth.Controller");
const { authenticate } = require("../Middleware/auth.Middleware");
const {
    authLimiter,
    otpLimiter,
    passwordResetLimiter
} = require("../Middleware/rateLimiter.Middleware");

// Registration & Verification
router.post("/register", authLimiter, AuthController.register);
router.post("/verify-otp", otpLimiter, AuthController.verifyOTP);
router.post("/resend-otp", otpLimiter, AuthController.resendOTP);

// Login & Token Management
router.post("/login", authLimiter, AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.post("/logout-all", authenticate, AuthController.logoutAll);

// Current user
router.get("/me", authenticate, AuthController.getCurrentUser);

// Password Reset
router.post("/forgot-password", passwordResetLimiter, AuthController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, AuthController.resetPassword);

// Session Management
router.get("/sessions", authenticate, AuthController.getSessions);
router.delete("/sessions/:sessionId", authenticate, AuthController.revokeSession);

module.exports = router;