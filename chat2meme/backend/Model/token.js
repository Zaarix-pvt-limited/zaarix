const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["refresh"],
      required: true,
      default: "refresh"
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    revoked: {
      type: Boolean,
      default: false,
      index: true
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
      deviceName: String
    },
    lastUsedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for efficient queries
tokenSchema.index({ user: 1, type: 1, revoked: 1 });
tokenSchema.index({ token: 1, type: 1, revoked: 1 });

// TTL index to auto-delete expired tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to update last used timestamp
tokenSchema.methods.updateLastUsed = async function () {
  this.lastUsedAt = new Date();
  await this.save();
};

// Static method to find active token
tokenSchema.statics.findActiveToken = function (token) {
  return this.findOne({
    token,
    type: "refresh",
    revoked: false,
    expiresAt: { $gt: new Date() }
  });
};

// Static method to revoke all user tokens
tokenSchema.statics.revokeAllUserTokens = async function (userId) {
  return this.updateMany(
    { user: userId, type: "refresh", revoked: false },
    { revoked: true }
  );
};

module.exports = mongoose.model("Token", tokenSchema);