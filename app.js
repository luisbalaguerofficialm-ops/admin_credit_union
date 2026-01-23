const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   ROUTES
========================= */
const accountRoutes = require("./routes/account.routes");
const feeRoutes = require("./routes/fee.routes");
const roleRoutes = require("./routes/roles.routes");
const transactionRoutes = require("./routes/transactions.routes");
const userRoutes = require("./routes/users.routes");
const notificationRoutes = require("./routes/notifications.routes");
const templateRoutes = require("./routes/templates.routes");
const chatRoutes = require("./routes/chats.routes");
const settingsRoutes = require("./routes/settings.routes");
const userProfileRoutes = require("./routes/userProfile.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const reportRoutes = require("./routes/report.routes");
const kycRoutes = require("./routes/kyc.routes");
const FundingRequest = require("./routes/fundingRequest.routes");

const { protectAdmin } = require("./middlewares/auth.middleware");

/* =========================
   PUBLIC ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/admin", protectAdmin, FundingRequest);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   SOCKET.IO SETUP
========================= */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

/* =========================
   JWT SOCKET AUTH
========================= */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Make io accessible inside controllers
app.set("io", io);

/* =========================
   SOCKET EVENTS
========================= */
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id} | Role: ${socket.user.role}`);

  const Chat = require("./models/Chat");

  // Admin-only room
  if (socket.user.role === "Admin" || socket.user.role === "SuperAdmin") {
    socket.join("admin-room");
    console.log(`Socket ${socket.id} joined admin-room`);
  }

  /* -------- JOIN SPECIFIC CHAT ROOM -------- */
  socket.on("chat:subscribe", (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`Socket ${socket.id} joined chat_${chatId}`);
  });

  /* -------- SEND MESSAGE -------- */
  socket.on("chat:send", async (data) => {
    try {
      const { chatId, sender, content } = data;
      if (!chatId || !sender || !content) return;

      // Validate sender
      if (!["user", "admin"].includes(sender)) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      const message = { sender, content, timestamp: new Date(), read: false };
      chat.messages.push(message);
      chat.lastMessageAt = new Date();
      await chat.save();

      // Emit to the specific chat room
      io.to(`chat_${chatId}`).emit("chat:receive", { chatId, message });

      // Notify admins
      io.to("admin-room").emit("chat:update", { chatId, lastMessage: message });
    } catch (err) {
      console.error("Chat send error:", err.message);
    }
  });

  /* -------- MARK MESSAGES AS READ -------- */
  socket.on("chat:mark-read", async ({ chatId }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      chat.messages.forEach((msg) => (msg.read = true));
      await chat.save();

      io.to("admin-room").emit("chat:update", { chatId, messagesRead: true });
    } catch (err) {
      console.error("Mark read error:", err.message);
    }
  });

  /* -------- KYC REALTIME -------- */
  socket.on("kyc:update", (data) => {
    io.to("admin-room").emit("kyc:update", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

/* =========================
   SERVER START
========================= */
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected");

    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log("📡 Socket.IO active");
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

startServer();

module.exports = app;
