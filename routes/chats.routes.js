const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.Controller");

// -------------------------
// GET ALL CHATS
// Optional query: ?status=Active&search=John
// -------------------------
router.get("/", chatController.getChats);

// -------------------------
// GET MESSAGES FOR A SPECIFIC CHAT
// -------------------------
router.get("/:chatId/messages", chatController.getChatMessages);

// -------------------------
// SEND A MESSAGE (USER OR ADMIN)
// -------------------------
router.post("/:chatId/messages", chatController.sendMessage);

// -------------------------
// UPDATE CHAT STATUS OR ASSIGN AGENT
// -------------------------
router.put("/:chatId", chatController.updateChat);

// -------------------------
// CREATE NEW CHAT (USER STARTS)
// -------------------------
router.post("/", chatController.createChat);

// -------------------------
// MARK ALL MESSAGES AS READ
// -------------------------
router.post("/:chatId/mark-read", chatController.markMessagesRead);

// -------------------------
// DELETE CHAT (ADMIN ONLY, optional)
// -------------------------
router.delete("/:chatId", chatController.deleteChat);

module.exports = router;
