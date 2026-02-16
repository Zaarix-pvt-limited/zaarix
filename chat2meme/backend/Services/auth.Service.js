const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const User = require("../Model/user.Model");
const TokenModel = require("../Model/token");
const OtpModel = require("../Model/otp.Model");

const {
  BCRYPT_SALT_ROUNDS,
  REFRESH_TOKEN_EXPIRES_DAYS,
  OTP_EXPIRY_MINUTES
} = require("../Config/index");

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require("../Utils/jwt");

const { addDaysFromNow, addMinutesFromNow } = require("../Utils/helper");
const { sendEmail } = require("../utils/mail");

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Register user - creates user and sends OTP for verification
 */
const registerUser = async (name, email, password) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verified: false
  });

  const otp = generateOTP();
  const expiresAt = addMinutesFromNow(OTP_EXPIRY_MINUTES);

  await OtpModel.deleteMany({ email, type: "verify" });

  const hashedOtp = await bcrypt.hash(otp, 10);
  await OtpModel.create({
    email,
    otp: hashedOtp,
    type: "verify",
    expiresAt,
    attempts: 0
  });

  await sendEmail(
    user.email,
    "Verify your email",
    `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>`
  );

  return {
    message: "OTP sent to your email",
    email: user.email
  };
};

/**
 * Verify OTP and complete registration
 */
const verifyOTP = async (email, otp) => {
  const otpRecord = await OtpModel.findOne({
    email,
    type: "verify"
  });

  if (!otpRecord) {
    throw new Error("No OTP found. Please request a new one.");
  }

  if (otpRecord.expiresAt < new Date()) {
    await OtpModel.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (otpRecord.attempts >= 3) {
    await OtpModel.deleteOne({ _id: otpRecord._id });
    throw new Error("Too many failed attempts. Please request a new OTP.");
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otp);

  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new Error(`Invalid OTP`);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.verified = true;
  await user.save();

  await OtpModel.deleteOne({ _id: otpRecord._id });

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = uuidv4();
  const refreshJwt = signRefreshToken({ jti: refreshToken });

  await TokenModel.create({
    user: user._id,
    type: "refresh",
    token: refreshJwt,
    expiresAt: addDaysFromNow(REFRESH_TOKEN_EXPIRES_DAYS)
  });

  return {
    message: "Email verified successfully",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified
    },
    accessToken,
    refreshToken: refreshJwt
  };
};

/**
 * Resend OTP for verification
 */
const resendOTP = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.verified) {
    throw new Error("Email already verified");
  }

  const otp = generateOTP();
  const expiresAt = addMinutesFromNow(OTP_EXPIRY_MINUTES);

  await OtpModel.deleteMany({ email, type: "verify" });

  const hashedOtp = await bcrypt.hash(otp, 10);
  await OtpModel.create({
    email,
    otp: hashedOtp,
    type: "verify",
    expiresAt,
    attempts: 0
  });

  await sendEmail(
    email,
    "Verify your email",
    `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
    </div>`
  );

  return {
    message: "OTP resent successfully",
    email
  };
};

/**
 * Login user - only allows verified users
 */
const loginUser = async (email, password, deviceInfo = {}) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.verified) {
    throw new Error("Please verify your email before logging in");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = uuidv4();
  const refreshJwt = signRefreshToken({ jti: refreshToken });

  await TokenModel.create({
    user: user._id,
    type: "refresh",
    token: refreshJwt,
    expiresAt: addDaysFromNow(REFRESH_TOKEN_EXPIRES_DAYS),
    revoked: false,
    deviceInfo
  });

  return {
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified
    },
    accessToken,
    refreshToken: refreshJwt
  };
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (refreshJwt) => {
  try {
    const payload = verifyRefreshToken(refreshJwt);

    const dbToken = await TokenModel.findOne({
      token: refreshJwt,
      type: "refresh",
      revoked: false
    });

    if (!dbToken) {
      throw new Error("Invalid refresh token");
    }

    if (dbToken.expiresAt < new Date()) {
      await TokenModel.updateOne({ _id: dbToken._id }, { revoked: true });
      throw new Error("Refresh token expired");
    }

    const user = await User.findById(dbToken.user);
    if (!user) {
      throw new Error("User not found");
    }

    // Update last used timestamp
    dbToken.lastUsedAt = new Date();
    await dbToken.save();

    const accessToken = signAccessToken({ userId: user._id, role: user.role });

    return { accessToken };
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Revoke a specific refresh token (logout from one device)
 */
const revokeRefreshToken = async (refreshJwt) => {
  await TokenModel.updateMany(
    { token: refreshJwt, type: "refresh" },
    { revoked: true }
  );

  return { message: "Logged out successfully" };
};

/**
 * Revoke all refresh tokens for a user (logout from all devices)
 */
const revokeAllRefreshTokens = async (userId) => {
  await TokenModel.updateMany(
    { user: userId, type: "refresh", revoked: false },
    { revoked: true }
  );

  return { message: "Logged out from all devices" };
};

/**
 * Request password reset - sends OTP
 */
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { message: "If the email exists, a reset code has been sent" };
  }

  const otp = generateOTP();
  const expiresAt = addMinutesFromNow(OTP_EXPIRY_MINUTES);

  await OtpModel.deleteMany({ email, type: "reset" });

  const hashedOtp = await bcrypt.hash(otp, 10);
  await OtpModel.create({
    email,
    otp: hashedOtp,
    type: "reset",
    expiresAt,
    attempts: 0
  });

  await sendEmail(
    email,
    "Password Reset Code",
    `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>
      <h1 style="color: #FF5722; letter-spacing: 5px;">${otp}</h1>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>`
  );

  return {
    message: "If the email exists, a reset code has been sent",
    email
  };
};

/**
 * Reset password with OTP
 */
const resetPassword = async (email, otp, newPassword) => {
  const otpRecord = await OtpModel.findOne({
    email,
    type: "reset"
  });

  if (!otpRecord) {
    throw new Error("No reset code found. Please request a new one.");
  }

  if (otpRecord.expiresAt < new Date()) {
    await OtpModel.deleteOne({ _id: otpRecord._id });
    throw new Error("Reset code has expired. Please request a new one.");
  }

  if (otpRecord.attempts >= 5) {
    await OtpModel.deleteOne({ _id: otpRecord._id });
    throw new Error("Too many failed attempts. Please request a new code.");
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otp);

  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw new Error(`Invalid code. ${5 - otpRecord.attempts} attempts remaining.`);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.password = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await user.save();

  await OtpModel.deleteOne({ _id: otpRecord._id });

  await TokenModel.updateMany(
    { user: user._id, type: "refresh", revoked: false },
    { revoked: true }
  );

  return {
    message: "Password reset successfully. Please login with your new password."
  };
};

/**
 * Get user's active sessions
 */
const getUserSessions = async (userId) => {
  const sessions = await TokenModel.find({
    user: userId,
    type: "refresh",
    revoked: false,
    expiresAt: { $gt: new Date() }
  }).select("deviceInfo lastUsedAt createdAt");

  return sessions;
};

/**
 * Revoke specific session
 */
const revokeSession = async (userId, sessionId) => {
  const result = await TokenModel.updateOne(
    {
      _id: sessionId,
      user: userId,
      type: "refresh"
    },
    { revoked: true }
  );

  if (result.matchedCount === 0) {
    throw new Error("Session not found");
  }

  return { message: "Session revoked successfully" };
};

/**
 * Clean up expired OTPs (run as cron job)
 */
const cleanupExpiredOTPs = async () => {
  const result = await OtpModel.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return { deletedCount: result.deletedCount };
};

/**
 * Clean up expired tokens (run as cron job)
 */
const cleanupExpiredTokens = async () => {
  const result = await TokenModel.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return { deletedCount: result.deletedCount };
};

/**
 * Get current user profile
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
    isActive: user.isActive,
    lastLogin: user.lastLogin
  };
};

module.exports = {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  requestPasswordReset,
  resetPassword,
  getUserSessions,
  revokeSession,
  cleanupExpiredOTPs,
  cleanupExpiredTokens,
  getCurrentUser
};