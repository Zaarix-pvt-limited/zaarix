const { sendVideoReadyEmail } = require("../utils/mail");
const geminiService = require("../Services/gemini.Service");
const sanitizeEmotion = require("../Services/gemini.Service").sanitizeEmotion;
const audioService = require("../Services/audio.Service");
const imageService = require("../Services/image.Service");
const Avatar = require("../Model/avatar.Model");
const Video = require("../Model/video.Model");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

// Configure Cloudinary (reuse env vars already set for image service)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isValidHttpUrl = (value) => {
    if (!value) return false;
    try {
        const parsed = new URL(value);
        return ["http:", "https:"].includes(parsed.protocol);
    } catch {
        return false;
    }
};

const REMOTION_COMPOSITION_ID = "Chat2MemeVideo";
const REMOTION_ENTRY = path.join(__dirname, "..", "remotion", "index.jsx");
let remotionBundleUrlPromise = null;

const getRemotionBundleUrl = async () => {
    if (!remotionBundleUrlPromise) {
        remotionBundleUrlPromise = (async () => {
            const { bundle } = await import("@remotion/bundler");
            return bundle({
                entryPoint: REMOTION_ENTRY
            });
        })();
    }
    return remotionBundleUrlPromise;
};

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

        // IMPORTANT: This must come from your actual Remotion render pipeline.
        // Keep it nullable instead of using a fake placeholder URL.
        const videoLink = isValidHttpUrl(req.body.videoLink)
            ? req.body.videoLink
            : (isValidHttpUrl(process.env.DEMO_VIDEO_URL) ? process.env.DEMO_VIDEO_URL : null);
        const name = email.split("@")[0];

        if (videoLink) {
            sendVideoReadyEmail(email, name, videoLink).catch(err => console.error("Email failed", err));
        } else {
            console.log("[Video Controller] Skipping ready email: no downloadable videoLink available yet.");
        }

        res.status(200).json({
            success: true,
            message: "Audio generation complete.",
            data: {
                chatData: enrichedMessages,
                videoLink,
                downloadReady: Boolean(videoLink)
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

const getVoices = async (req, res) => {
    try {
        const voices = await audioService.getVoices();
        res.status(200).json({
            success: true,
            data: voices
        });
    } catch (error) {
        console.error("Get Voices Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch voices",
            error: error.message
        });
    }
};

/**
 * Proxy-download rendered video and force browser save dialog.
 * Helps when remote video storage blocks direct browser download due to CORS.
 */
const downloadVideo = async (req, res) => {
    try {
        const { url, filename } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Video URL is required"
            });
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid video URL"
            });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                success: false,
                message: "Only HTTP/HTTPS video URLs are supported"
            });
        }

        if (parsedUrl.hostname === "remotion-player-url.com") {
            return res.status(400).json({
                success: false,
                message: "Video URL is still a placeholder. Attach a real Remotion render URL first."
            });
        }

        let upstream;
        try {
            upstream = await fetch(parsedUrl.toString());
        } catch (fetchError) {
            const causeCode = fetchError?.cause?.code;
            return res.status(502).json({
                success: false,
                message: "Could not reach video host URL",
                error: causeCode || fetchError.message
            });
        }

        if (!upstream.ok || !upstream.body) {
            return res.status(502).json({
                success: false,
                message: "Failed to fetch video from source URL"
            });
        }

        const safeFilename = (filename || "chat2meme-video.mp4")
            .toString()
            .replace(/[^a-zA-Z0-9._-]/g, "_");

        res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
        res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);

        const nodeStream = Readable.fromWeb(upstream.body);
        await pipeline(nodeStream, res);
    } catch (error) {
        console.error("Download Video Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Failed to download video",
                error: error.message
            });
        }
    }
};

/**
 * Render MP4 with Remotion and immediately stream it as file download.
 */
const renderAndDownloadVideo = async (req, res) => {
    let outputLocation = null;
    try {
        const {
            conversation,
            avatar1 = "",
            avatar2 = "",
            backgroundImage = "",
            fileName
        } = req.body || {};

        if (!Array.isArray(conversation) || conversation.length === 0) {
            return res.status(400).json({
                success: false,
                message: "conversation array is required for rendering"
            });
        }

        const inputProps = {
            conversation,
            avatar1,
            avatar2,
            backgroundImage
        };

        const serveUrl = await getRemotionBundleUrl();
        const { selectComposition, renderMedia } = await import("@remotion/renderer");

        const composition = await selectComposition({
            serveUrl,
            id: REMOTION_COMPOSITION_ID,
            inputProps
        });

        outputLocation = path.join(
            os.tmpdir(),
            `chat2meme-${Date.now()}-${crypto.randomUUID()}.mp4`
        );

        await renderMedia({
            serveUrl,
            composition,
            codec: "h264",
            audioCodec: "aac",
            outputLocation,
            inputProps
        });

        const safeFilename = (fileName || `chat2meme-${Date.now()}.mp4`)
            .toString()
            .replace(/[^a-zA-Z0-9._-]/g, "_");

        // Get file size before uploading
        let fileSizeBytes = 0;
        try {
            const stat = await fsPromises.stat(outputLocation);
            fileSizeBytes = stat.size;
        } catch { /* non-critical */ }

        // Upload rendered MP4 to Cloudinary for permanent hosting
        let cloudinaryUrl = "";
        let cloudinaryPublicId = "";
        try {
            console.log("[Video Controller] Uploading to Cloudinary...");
            const uploadResult = await cloudinary.uploader.upload(outputLocation, {
                resource_type: "video",
                folder: "videos",
                public_id: safeFilename.replace(/\.mp4$/i, ""),
                overwrite: true,
            });
            cloudinaryUrl = uploadResult.secure_url;
            cloudinaryPublicId = uploadResult.public_id;
            console.log(`[Video Controller] Cloudinary upload success: ${cloudinaryUrl}`);
        } catch (uploadErr) {
            console.error("[Video Controller] Cloudinary upload failed:", uploadErr.message);
            // Continue — still stream the file to the user even if upload fails
        }

        // Persist video metadata + Cloudinary URL to MongoDB
        try {
            await Video.create({
                title: safeFilename.replace(/\.mp4$/i, "").replace(/_/g, " "),
                fileName: safeFilename,
                fileSizeBytes,
                messageCount: Array.isArray(conversation) ? conversation.length : 0,
                backgroundImage: backgroundImage || "",
                status: "completed",
                cloudinaryUrl,
                cloudinaryPublicId,
            });
        } catch (dbErr) {
            console.error("[Video Controller] Failed to save video record:", dbErr.message);
        }

        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);

        await pipeline(fs.createReadStream(outputLocation), res);
    } catch (error) {
        console.error("Render and Download Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Failed to render/download video",
                error: error.message
            });
        }
    } finally {
        if (outputLocation) {
            fsPromises.unlink(outputLocation).catch(() => { });
        }
    }
};

/**
 * List all previously rendered videos for the dashboard.
 */
const listVideos = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
        res.status(200).json({
            success: true,
            data: videos
        });
    } catch (error) {
        console.error("List Videos Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch video list",
            error: error.message
        });
    }
};

module.exports = {
    createVideo,
    analyzeChat,
    getBackgroundImages,
    getAvatarImages,
    getVoices,
    downloadVideo,
    renderAndDownloadVideo,
    listVideos
};
