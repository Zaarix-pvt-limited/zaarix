const express = require("express");
const router = express.Router();
const VideoController = require("../Controllers/video.Controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Analyze chat content using Gemini
router.post("/analyze", upload.single("image"), VideoController.analyzeChat);

// Use createVideo controller for the demo route
router.post("/create", VideoController.createVideo);

// Get background images from Cloudinary
router.get("/backgrounds", VideoController.getBackgroundImages);

// Get avatar images from Cloudinary
router.get("/avatars", VideoController.getAvatarImages);

// Get available voices from ElevenLabs
router.get("/voices", VideoController.getVoices);

// Download rendered video
router.get("/download", VideoController.downloadVideo);

// Render with Remotion and download MP4
router.post("/render-download", VideoController.renderAndDownloadVideo);

// List all generated videos (for the dashboard)
router.get("/list", VideoController.listVideos);

module.exports = router;
