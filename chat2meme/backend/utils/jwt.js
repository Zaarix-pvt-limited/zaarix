const jwt = require("jsonwebtoken");

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN = "15m", // 15 minutes (short-lived)
  JWT_REFRESH_EXPIRES_IN = "7d"  // 7 days
} = require("../Config/index");

/**
 * Sign Access Token (JWT)
 * @param {Object} payload - Token payload { userId, role }
 * @returns {string} JWT access token
 */
const signAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      type: "access"
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
      issuer: "your-app-name",
      audience: "your-app-users"
    }
  );
};

/**
 * Sign Refresh Token (JWT with JTI for revocation tracking)
 * @param {Object} payload - Token payload { jti }
 * @returns {string} JWT refresh token
 */
const signRefreshToken = (payload) => {
  return jwt.sign(
    {
      jti: payload.jti, // JWT ID for tracking and revocation
      type: "refresh"
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: "your-app-name",
      audience: "your-app-users"
    }
  );
};

/**
 * Verify Access Token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET, {
      issuer: "your-app-name",
      audience: "your-app-users"
    });

    // Ensure it's an access token
    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Access token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid access token");
    }
    throw error;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: "your-app-name",
      audience: "your-app-users"
    });

    // Ensure it's a refresh token
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    throw error;
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  // Check for "Bearer <token>" format
  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  
  return null;
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  extractTokenFromHeader
};