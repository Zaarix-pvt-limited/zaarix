const { sendVideoReadyEmail } = require("../utils/mail");
const geminiService = require("../Services/gemini.Service");

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

        // 1. Immediate response to user
        res.status(200).json({
            success: true,
            message: "Video generation started. You will receive an email when it is ready.",
            data: {
                status: "processing",
                estimatedTime: "10 seconds"
            }
        });

        // 2. Simulate background processing (10 seconds)
        console.log(`[Video Demo] Starting video generation for ${email}...`);

        setTimeout(async () => {
            try {
                console.log(`[Video Demo] Video generation complete for ${email}`);

                // Mock video link (replace with real link in future)
                const videoLink = "https://www.w3schools.com/html/mov_bbb.mp4";
                const name = email.split("@")[0]; // Simple name extraction

                // 3. Send email notification
                await sendVideoReadyEmail(email, name, videoLink);

                console.log(`[Video Demo] Notification email sent to ${email}`);
            } catch (error) {
                console.error(`[Video Demo] Failed to send email: ${error.message}`);
            }
        }, 10000); // 10 seconds delay

    } catch (error) {
        console.error("Video controller error:", error);
        // Note: Can't send response here if already sent above, but good for logging
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
};

module.exports = {
    createVideo,
    analyzeChat
};
