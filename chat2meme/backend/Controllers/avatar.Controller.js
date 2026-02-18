const Avatar = require("../Model/avatar.Model");

/**
 * Create a new avatar with previewUrl and optional emotions
 * POST /api/avatar/create
 */
const createAvatar = async (req, res) => {
    try {
        const { name, previewUrl, emotions, createdBy } = req.body;

        if (!name || !previewUrl) {
            return res.status(400).json({
                success: false,
                message: "name and previewUrl are required"
            });
        }

        const avatar = new Avatar({ name, previewUrl, emotions: emotions || [], createdBy: createdBy || null });
        await avatar.save();

        res.status(201).json({
            success: true,
            message: "Avatar created successfully",
            data: avatar
        });
    } catch (error) {
        console.error("Create Avatar Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create avatar",
            error: error.message
        });
    }
};

/**
 * Get all avatars (for selection UI — returns name + previewUrl)
 * GET /api/avatar/all
 */
const getAllAvatars = async (req, res) => {
    try {
        const avatars = await Avatar.find().select("name previewUrl emotions createdAt");

        res.status(200).json({
            success: true,
            data: avatars
        });
    } catch (error) {
        console.error("Get All Avatars Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch avatars",
            error: error.message
        });
    }
};

/**
 * Get a single avatar by ID (includes all emotions)
 * GET /api/avatar/:id
 */
const getAvatarById = async (req, res) => {
    try {
        const avatar = await Avatar.findById(req.params.id);

        if (!avatar) {
            return res.status(404).json({
                success: false,
                message: "Avatar not found"
            });
        }

        res.status(200).json({
            success: true,
            data: avatar
        });
    } catch (error) {
        console.error("Get Avatar By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch avatar",
            error: error.message
        });
    }
};

/**
 * Add or update an emotion for an avatar
 * POST /api/avatar/:id/emotion
 * Body: { emotion: "happy", url: "https://cloudinary.com/..." }
 */
const addEmotion = async (req, res) => {
    try {
        const { emotion, url } = req.body;

        if (!emotion || !url) {
            return res.status(400).json({
                success: false,
                message: "emotion and url are required"
            });
        }

        const avatar = await Avatar.findById(req.params.id);
        if (!avatar) {
            return res.status(404).json({ success: false, message: "Avatar not found" });
        }

        // If emotion already exists, update it; otherwise push new
        const existing = avatar.emotions.find((e) => e.emotion === emotion);
        if (existing) {
            existing.url = url;
        } else {
            avatar.emotions.push({ emotion, url });
        }

        await avatar.save();

        res.status(200).json({
            success: true,
            message: `Emotion '${emotion}' saved successfully`,
            data: avatar
        });
    } catch (error) {
        console.error("Add Emotion Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add emotion",
            error: error.message
        });
    }
};

/**
 * Remove a specific emotion from an avatar
 * DELETE /api/avatar/:id/emotion/:emotion
 */
const removeEmotion = async (req, res) => {
    try {
        const avatar = await Avatar.findById(req.params.id);
        if (!avatar) {
            return res.status(404).json({ success: false, message: "Avatar not found" });
        }

        avatar.emotions = avatar.emotions.filter((e) => e.emotion !== req.params.emotion);
        await avatar.save();

        res.status(200).json({
            success: true,
            message: `Emotion '${req.params.emotion}' removed`,
            data: avatar
        });
    } catch (error) {
        console.error("Remove Emotion Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove emotion",
            error: error.message
        });
    }
};

/**
 * Delete an avatar entirely
 * DELETE /api/avatar/:id
 */
const deleteAvatar = async (req, res) => {
    try {
        const avatar = await Avatar.findByIdAndDelete(req.params.id);

        if (!avatar) {
            return res.status(404).json({ success: false, message: "Avatar not found" });
        }

        res.status(200).json({
            success: true,
            message: "Avatar deleted successfully"
        });
    } catch (error) {
        console.error("Delete Avatar Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete avatar",
            error: error.message
        });
    }
};

/**
 * Get available emotion labels for a specific avatar
 * Used when building the AI prompt
 * GET /api/avatar/:id/emotions
 */
const getAvailableEmotions = async (req, res) => {
    try {
        const avatar = await Avatar.findById(req.params.id).select("emotions name");

        if (!avatar) {
            return res.status(404).json({ success: false, message: "Avatar not found" });
        }

        const emotions = avatar.getAvailableEmotions();

        res.status(200).json({
            success: true,
            data: {
                avatarId: avatar._id,
                name: avatar.name,
                availableEmotions: emotions
            }
        });
    } catch (error) {
        console.error("Get Available Emotions Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch emotions",
            error: error.message
        });
    }
};

module.exports = {
    createAvatar,
    getAllAvatars,
    getAvatarById,
    addEmotion,
    removeEmotion,
    deleteAvatar,
    getAvailableEmotions
};
