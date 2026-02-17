const { sendVideoReadyEmail } = require("../utils/mail");
const geminiService = require("../Services/gemini.Service");
const audioService = require("../Services/audio.Service");
const imageService = require("../Services/image.Service");

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
        const { email, prompt, imageUrl, chatData } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // 1. Immediate response to user (optional, but if we want to process in background we need a queue)
        // For now, let's keep it synchronous as per user request to "console the data" in frontend

        console.log(`[Video Controller] Starting audio generation for ${email}...`);

        // 2. Generate Audio and Upload to Cloudinary
        const enrichedChatData = await audioService.processConversationAudio(chatData);

        console.log(`[Video Controller] Audio generation complete.`);

        // 3. (Optional) Send email notification still? 
        // The user didn't explicitly ask to remove it, but the focus is on "consoling data in frontend".
        // Let's keep the email logic as a nice-to-have but non-blocking.

        // Mock video link (since we are only doing audio for now as per "half of work is done")
        // The "Video" is actually just the data for the frontend to render.
        const videoLink = "https://remotion-player-url.com/render";
        const name = email.split("@")[0];

        // Fire and forget email
        sendVideoReadyEmail(email, name, videoLink).catch(err => console.error("Email failed", err));

        // 4. Return the enriched data
        res.status(200).json({
            success: true,
            message: "Audio generation complete.",
            data: {
                chatData: enrichedChatData,
                videoLink // conceptual
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
