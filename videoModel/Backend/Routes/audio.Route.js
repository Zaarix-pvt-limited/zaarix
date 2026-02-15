const express = require("express");
const router = express.Router();
const { generateAudio, generateConversationAudio } = require("../Controller/audio.Controller");
const { apiLimiter } = require("../Middleware/rateLimiter.Middleware");

// POST /api/audio/generate
router.post("/generate", apiLimiter, generateAudio);

// POST /api/audio/conversation (Batch)
router.post("/conversation", apiLimiter, generateConversationAudio);

module.exports = router;
