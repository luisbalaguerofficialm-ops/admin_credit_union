const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Send Notification
router.post("/", notificationController.sendNotification);

// Get Notification History
router.get("/", notificationController.getNotifications);

module.exports = router;
