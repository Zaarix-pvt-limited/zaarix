const express = require("express");
const router = express.Router();
const AvatarController = require("../Controllers/avatar.Controller");

// Create a new avatar
// POST /api/avatar/create
router.post("/create", AvatarController.createAvatar);

// Get all avatars (for selection UI)
// GET /api/avatar/all
router.get("/all", AvatarController.getAllAvatars);

// Get a single avatar by ID
// GET /api/avatar/:id
router.get("/:id", AvatarController.getAvatarById);

// Get available emotion labels for an avatar (used for AI prompt)
// GET /api/avatar/:id/emotions
router.get("/:id/emotions", AvatarController.getAvailableEmotions);

// Add or update an emotion for an avatar
// POST /api/avatar/:id/emotion
router.post("/:id/emotion", AvatarController.addEmotion);

// Remove a specific emotion from an avatar
// DELETE /api/avatar/:id/emotion/:emotion
router.delete("/:id/emotion/:emotion", AvatarController.removeEmotion);

// Delete an avatar entirely
// DELETE /api/avatar/:id
router.delete("/:id", AvatarController.deleteAvatar);

module.exports = router;
