const express = require("express");
const router = express.Router();
const VideoController = require("../Controllers/video.Controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// Analyze chat content using Gemini
router.post("/analyze", upload.single("image"), VideoController.analyzeChat);

// Use createVideo controller for the demo route
router.post("/create", VideoController.createVideo);

module.exports = router;
