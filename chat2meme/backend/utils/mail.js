const nodemailer = require("nodemailer");

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM
} = require("../Config/index");

/**
 * Create transporter for sending emails
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
};

/**
 * Send email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Your App" <${EMAIL_FROM}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send OTP email (verification)
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {number} expiryMinutes - OTP expiry time in minutes
 */
const sendVerificationOTP = async (to, otp, expiryMinutes = 2) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p style="color: #666; font-size: 16px;">Your verification code is:</p>
        <div style="background-color: #4CAF50; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 5px; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in <strong>${expiryMinutes} minutes</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this verification, please ignore this email.</p>
      </div>
    </div>
  `;

  return sendEmail(to, "Verify Your Email - Your App", html);
};

/**
 * Send password reset OTP email
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {number} expiryMinutes - OTP expiry time in minutes
 */
const sendPasswordResetOTP = async (to, otp, expiryMinutes = 2) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="color: #666; font-size: 16px;">Your password reset code is:</p>
        <div style="background-color: #FF5722; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 5px; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in <strong>${expiryMinutes} minutes</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      </div>
    </div>
  `;

  return sendEmail(to, "Password Reset Code - Your App", html);
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 */
const sendWelcomeEmail = async (to, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Welcome to Your App! 🎉</h2>
        <p style="color: #666; font-size: 16px;">Hi ${name},</p>
        <p style="color: #666; font-size: 16px;">Thank you for verifying your email. Your account is now active!</p>
        <p style="color: #666; font-size: 16px;">You can now enjoy all the features of our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
      </div>
    </div>
  `;

  return sendEmail(to, "Welcome to Your App!", html);
};

module.exports = {
  sendEmail,
  sendVerificationOTP,
  sendPasswordResetOTP,
  sendWelcomeEmail,
  sendVideoReadyEmail: async (to, name, videoLink) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">Your Video is Ready! 🎬</h2>
          <p style="color: #666; font-size: 16px;">Hi ${name},</p>
          <p style="color: #666; font-size: 16px;">Great news! The video you requested has been successfully generated.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${videoLink}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Watch Video</a>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center;">Or copy this link:</p>
          <p style="color: #4CAF50; font-size: 12px; text-align: center; word-break: break-all;">${videoLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">Thank you for using our service!</p>
        </div>
      </div>
    `;
    return sendEmail(to, "Your AI Video is Ready!", html);
  }
};