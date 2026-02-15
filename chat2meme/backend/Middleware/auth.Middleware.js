const { verifyAccessToken, extractTokenFromHeader } = require("../Utils/jwt");
const User = require("../Model/user.Model");

/**
 * Authenticate middleware - Validates JWT access token
 * Attaches user info to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required"
      });
    }

    const decoded = verifyAccessToken(token);

    // Optional: Fetch user from database for additional validation
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid or expired access token"
    });
  }
};

/**
 * Authorize middleware - Checks user role
 * Usage: authorize('admin', 'moderator')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions"
      });
    }

    next();
  };
};

/**
 * Optional authenticate - Attaches user if token is valid, but doesn't block
 * Useful for public endpoints that behave differently for authenticated users
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.verified && user.isActive) {
        req.user = {
          userId: decoded.userId,
          role: decoded.role,
          email: user.email,
          name: user.name
        };
      }
    }
  } catch (error) {
    // Silently fail - user remains unauthenticated
  }

  next();
};

/**
 * Check if user owns resource
 * Usage: checkOwnership('userId', 'params') or checkOwnership('authorId', 'body')
 */
const checkOwnership = (field, location = "params") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const resourceOwnerId = req[location][field];

    // Allow if user is admin or owns the resource
    if (req.user.role === "admin" || req.user.userId.toString() === resourceOwnerId.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. You don't have permission to access this resource."
    });
  };
};

module.exports = {
  authenticate,
  authorize,
  optionalAuthenticate,
  checkOwnership
};