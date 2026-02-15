const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["verify", "reset"],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Compound index for faster queries
otpSchema.index({ email: 1, type: 1 });

// TTL index to auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to increment attempts
otpSchema.methods.incrementAttempts = async function () {
  this.attempts += 1;
  await this.save();
  return this.attempts;
};

// Method to check if OTP is expired
otpSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Method to check if max attempts reached
otpSchema.methods.maxAttemptsReached = function () {
  return this.attempts >= 5;
};

// Static method to find active OTP
otpSchema.statics.findActiveOTP = function (email, type) {
  return this.findOne({
    email,
    type,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to clean up old OTPs for email
otpSchema.statics.cleanupForEmail = function (email, type) {
  return this.deleteMany({ email, type });
};

module.exports = mongoose.model("Otp", otpSchema);