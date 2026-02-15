require("dotenv").config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // JWT Secrets
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ||
    "your-access-secret-change-in-production",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    "your-refresh-secret-change-in-production",

  // JWT Expiration
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Token Expiration (for DB storage)
  REFRESH_TOKEN_EXPIRES_DAYS:
    parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,

  // OTP
  OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES) || 2,

  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@yourapp.com",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100
};