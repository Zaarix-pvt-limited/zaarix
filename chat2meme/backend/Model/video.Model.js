const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: "Chat2Meme Video",
            trim: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileSizeBytes: {
            type: Number,
            default: 0,
        },
        messageCount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["rendering", "completed", "failed"],
            default: "completed",
        },
        backgroundImage: {
            type: String,
            default: "",
        },
        // Cloudinary-hosted video fields
        cloudinaryUrl: {
            type: String,
            default: "",
        },
        cloudinaryPublicId: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
