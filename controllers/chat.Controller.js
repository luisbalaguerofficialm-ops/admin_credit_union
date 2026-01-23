const Chat = require("../models/Chat");

/* =========================
   GET ALL CHATS
   Optional filters: status, search
========================= */
exports.getChats = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== "All Status") filter.status = status;
    if (search) filter["user.name"] = { $regex: search, $options: "i" };

    const chats = await Chat.find(filter).sort({ lastMessageAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET CHAT MESSAGES BY CHAT ID
========================= */
exports.getChatMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.json(chat.messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   SEND MESSAGE (USER OR ADMIN)
========================= */
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, content } = req.body;

    if (!["user", "admin"].includes(sender))
      return res.status(400).json({ message: "Invalid sender" });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const message = { sender, content, timestamp: new Date(), read: false };
    chat.messages.push(message);
    chat.lastMessageAt = new Date();
    await chat.save();

    // Emit message to chat room for real-time updates
    const io = req.app.get("io");
    io.to(`chat_${chatId}`).emit("chat:receive", { chatId, message });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE CHAT STATUS OR ASSIGN AGENT
========================= */
exports.updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { status, assignedTo } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (status) chat.status = status;
    if (assignedTo) chat.assignedTo = assignedTo;

    await chat.save();

    // Emit chat update to admin room
    const io = req.app.get("io");
    io.to("admin-room").emit("chat:update", { chatId, status, assignedTo });

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE NEW CHAT (USER STARTS)
========================= */
exports.createChat = async (req, res) => {
  try {
    const { user } = req.body;

    const chat = await Chat.create({
      user,
      messages: [],
      status: "Waiting",
      lastMessageAt: new Date(),
    });

    // Emit new chat to admin room
    const io = req.app.get("io");
    io.to("admin-room").emit("chat:new", chat);

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   MARK MESSAGE AS READ
========================= */
exports.markMessagesRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.forEach((msg) => {
      msg.read = true;
    });

    await chat.save();
    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   SUBSCRIBE TO CHAT ROOM (SOCKET.IO)
========================= */
exports.subscribeToChatRoom = (socket, chatId) => {
  socket.join(`chat_${chatId}`);
};

/* =========================
   SUBSCRIBE ADMIN TO ALL CHATS
========================= */
exports.subscribeAdminRoom = (socket) => {
  socket.join("admin-room");
};

/* =========================
   DELETE CHAT
========================= */
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    await Chat.findByIdAndDelete(chatId);

    // Emit event to admin room
    const io = req.app.get("io");
    io.to("admin-room").emit("chat:deleted", { chatId });

    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
