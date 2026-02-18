const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema(
    {
        emotion: {
            type: String,
            required: true,
            enum: ["neutral", "happy", "angry", "sad", "surprised", "excited", "confused"],
        },
        url: {
            type: String,
            required: true, // Cloudinary URL for this emotion image
        },
    },
    { _id: false }
);

const avatarSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Display name e.g. "Alex", "Sam"
        },
        previewUrl: {
            type: String,
            required: true, // Shown in avatar selection UI (default/normal look)
        },
        emotions: {
            type: [emotionSchema],
            default: [],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null, // null = global avatar, ObjectId = user-uploaded avatar
        },
    },
    { timestamps: true }
);

// Helper: get URL for a specific emotion, fallback to neutral
avatarSchema.methods.getEmotionUrl = function (emotion) {
    const match = this.emotions.find((e) => e.emotion === emotion);
    if (match) return match.url;
    const neutral = this.emotions.find((e) => e.emotion === "neutral");
    return neutral ? neutral.url : this.previewUrl;
};

// Helper: get all available emotion labels for this avatar
avatarSchema.methods.getAvailableEmotions = function () {
    return this.emotions.map((e) => e.emotion);
};

const Avatar = mongoose.model("Avatar", avatarSchema);

module.exports = Avatar;
