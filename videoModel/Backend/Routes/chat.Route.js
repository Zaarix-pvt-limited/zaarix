const express = require("express");
const router = express.Router();
const { generateChatFlow } = require("../Controller/chat.Controller");
const { apiLimiter } = require("../Middleware/rateLimiter.Middleware");

router.post("/generate", apiLimiter, generateChatFlow);

module.exports = router;
