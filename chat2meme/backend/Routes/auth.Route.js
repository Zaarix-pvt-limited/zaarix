const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/auth.Controller");
const { authenticate } = require("../Middleware/auth.Middleware");

// Registration & Verification
router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOTP);
router.post("/resend-otp", AuthController.resendOTP);

// Login & Token Management
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.post("/logout-all", authenticate, AuthController.logoutAll);

// Current user
router.get("/me", authenticate, AuthController.getCurrentUser);

// Password Reset
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Session Management
router.get("/sessions", authenticate, AuthController.getSessions);
router.delete("/sessions/:sessionId", authenticate, AuthController.revokeSession);

module.exports = router;