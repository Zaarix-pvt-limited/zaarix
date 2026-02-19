const { sendVideoReadyEmail } = require("../utils/mail");
const geminiService = require("../Services/gemini.Service");
const sanitizeEmotion = require("../Services/gemini.Service").sanitizeEmotion;
const audioService = require("../Services/audio.Service");
const imageService = require("../Services/image.Service");
const Avatar = require("../Model/avatar.Model");

/**
 * Analyze chat content (text or image) using Gemini
 */
const analyzeChat = async (req, res) => {
    try {
        const { text } = req.body;
        console.log(text)
        const file = req.file;

        if (!text && !file) {
            return res.status(400).json({
                success: false,
                message: "Either text or an image file is required"
            });
        }

        let analysisResult;
        if (file) {
            const imageBase64 = file.buffer.toString("base64");
            analysisResult = await geminiService.analyzeChatContent({
                imageBase64,
                imageMimeType: file.mimetype
            });
        } else {
            analysisResult = await geminiService.analyzeChatContent({ text });
        }

        console.log("🤖 AI Analysis Result:", JSON.stringify(analysisResult, null, 2));

        res.status(200).json({
            success: true,
            data: analysisResult
        });
    } catch (error) {
        console.error("Analysis Controller Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze chat content",
            error: error.message
        });
    }
};

/**
 * Simulate video creation and send email notification
 */
const createVideo = async (req, res) => {
    try {
        const { email, prompt, imageUrl, chatData, avatarIdA, avatarIdB } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        console.log(`[Video Controller] Starting audio generation for ${email}...`);

        // 1. Generate Audio — returns a plain array of messages with audioUrl
        let enrichedMessages = await audioService.processConversationAudio(chatData);

        console.log(`[Video Controller] Audio generation complete. Messages: ${enrichedMessages.length}`);

        // 2. Always sanitize emotions to valid DB labels

        enrichedMessages = enrichedMessages.map(msg => {
            const validEmotion = sanitizeEmotion(msg.emotion);
            console.log(`[Emotion] "${msg.text.slice(0, 20)}" | ${msg.emotion} → ${validEmotion}`);
            return { ...msg, emotion: validEmotion };
        });

        // 3. Resolve avatar emotion URLs based on speaker identity (A or B)
        console.log(`[Video Controller] Resolving avatars - Speaker A: ${avatarIdA}, Speaker B: ${avatarIdB}`);

        const avatarIds = [];
        if (avatarIdA) avatarIds.push(avatarIdA);
        if (avatarIdB) avatarIds.push(avatarIdB);

        let avatarsMap = {};

        if (avatarIds.length > 0) {
            try {
                const avatars = await Avatar.find({ _id: { $in: avatarIds } });
                avatars.forEach(av => {
                    avatarsMap[av._id.toString()] = av;
                });
                console.log(`[Video Controller] Found ${avatars.length} avatar documents.`);
            } catch (avatarErr) {
                console.error("[Video Controller] Avatar lookup failed:", avatarErr.message);
            }
        }

        enrichedMessages = enrichedMessages.map(msg => {
            // Determine which avatar ID applies to this message
            let activeAvatarId = null;
            if (msg.speaker === 'A') activeAvatarId = avatarIdA;
            if (msg.speaker === 'B') activeAvatarId = avatarIdB;

            let resolvedUrl = null;

            if (activeAvatarId && avatarsMap[activeAvatarId]) {
                resolvedUrl = avatarsMap[activeAvatarId].getEmotionUrl(msg.emotion);
                console.log(`[Avatar] Speaker ${msg.speaker} ("${msg.text.slice(0, 15)}...") | ${msg.emotion} → ${resolvedUrl}`);
            } else {
                console.log(`[Avatar] No avatar found for Speaker ${msg.speaker}`);
            }

            // Only attach avatarUrl if resolved; otherwise frontend falls back to static preview
            return resolvedUrl ? { ...msg, avatarUrl: resolvedUrl } : msg;
        });

        const videoLink = "https://remotion-player-url.com/render";
        const name = email.split("@")[0];

        sendVideoReadyEmail(email, name, videoLink).catch(err => console.error("Email failed", err));

        res.status(200).json({
            success: true,
            message: "Audio generation complete.",
            data: {
                chatData: enrichedMessages,
                videoLink
            }
        });

    } catch (error) {
        console.error("Video controller error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

/**
 * Get list of background images from Cloudinary
 */
const getBackgroundImages = async (req, res) => {
    try {
        const images = await imageService.listImages('img');
        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        console.error("Get Background Images Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch background images",
            error: error.message
        });
    }
};

/**
 * Get list of avatar images from Cloudinary
 */
const getAvatarImages = async (req, res) => {
    try {
        const images = await imageService.listImages('avtar');
        res.status(200).json({
            success: true,
            data: images
        });
    } catch (error) {
        console.error("Get Avatar Images Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch avatar images",
            error: error.message
        });
    }
};

module.exports = {
    createVideo,
    analyzeChat,
    getBackgroundImages,
    getAvatarImages
};
