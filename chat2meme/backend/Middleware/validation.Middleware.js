/**
 * Validate email format
 */

const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Registration validation middleware
 */

const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

/**
 * Login validation middleware
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

/**
 * OTP validation middleware
 */
const validateOTP = (req, res, next) => {
  const { email, otp } = req.body;

  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    errors.push("OTP must be 6 digits");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

/**
 * Password reset validation middleware
 */
const validatePasswordReset = (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const errors = [];

  if (!email || !validateEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!otp || !/^\d{6}$/.test(otp)) {
    errors.push("OTP must be 6 digits");
  }

  if (!newPassword || newPassword.length < 8) {
    errors.push("New password must be at least 8 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  next();
};

/**
 * Email validation middleware
 */
const validateEmailOnly = (req, res, next) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Valid email is required"
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateOTP,
  validatePasswordReset,
  validateEmailOnly,
  validateEmail,
  validatePassword
};