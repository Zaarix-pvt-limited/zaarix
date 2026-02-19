const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema(
    {
        emotion: {
            type: String,
            required: true,
            enum: ["funny", "confusing", "sad", "angry", "happy", "neutral", "surprised", "excited", "confused"],
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

// Helper: get URL for a specific emotion, fallback to previewUrl
avatarSchema.methods.getEmotionUrl = function (emotion) {
    console.log(`[getEmotionUrl] Looking for "${emotion}" in [${this.emotions.map(e => e.emotion).join(', ')}]`);
    const match = this.emotions.find((e) => e.emotion === emotion);
    if (match) {
        console.log(`[getEmotionUrl] ✅ Found: ${match.url}`);
        return match.url;
    }
    // No exact match — return previewUrl as fallback
    console.log(`[getEmotionUrl] ❌ No match for "${emotion}". Falling back to previewUrl.`);
    return this.previewUrl;
};

// Helper: get all available emotion labels for this avatar
avatarSchema.methods.getAvailableEmotions = function () {
    return this.emotions.map((e) => e.emotion);
};

const Avatar = mongoose.model("Avatar", avatarSchema);

module.exports = Avatar;
