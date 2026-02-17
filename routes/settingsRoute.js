const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

// Profile
router.get("/:id", settingsController.getProfile);
router.put("/:id", settingsController.updateProfile);

// Notifications
router.put("/:id/notifications", settingsController.updateNotifications);

// API Keys
router.post("/:id/apikeys", settingsController.createApiKey);
router.put("/:id/apikeys/:keyId", settingsController.updateApiKey);
router.delete("/:id/apikeys/:keyId", settingsController.deleteApiKey);

// Sessions
router.get("/:id/sessions", settingsController.getSessions);
router.delete("/:id/sessions/:sessionId", settingsController.deleteSession);

module.exports = router;
