const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
    {
        originalInput: {
            text: { type: String },
            hasImage: { type: Boolean, default: false }, // Don't store full base64 in DB usually, just flag or URL if uploaded
        },
        conversation: [
            {
                speaker: { type: String, enum: ["A", "B"], required: true },
                text: { type: String, required: true },
                emotion: {
                    type: String,
                    enum: ["normal", "angry", "sad", "happy", "cute", "sarcastic"],
                    default: "normal",
                },
                audioUrl: { type: String }, // URL to local static file
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChatFlow", ChatSchema);
