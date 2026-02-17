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
   IMPORT ROUTES
========================= */
const accountRoute = require("./routes/accountRoute");
const rolesRoute = require("./routes/rolesRoute");
const transactionRoute = require("./routes/transactionsRoute");
const userRoute = require("./routes/usersRoute");
const notificationRoute = require("./routes/notificationRoute");
const chatsRoute = require("./routes/chatsRoute");
const settingsRoute = require("./routes/settingsRoute");
const userProfileRoute = require("./routes/userProfileRoute");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const reportRoute = require("./routes/reportRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const disputesRoute = require("./routes/disputesRoute");
const kycRoute = require("./routes/kycRoute");
const adminFundingRoute = require("./routes/adminFundingRoute");
const feeRoute = require("./routes/feeRoute");

/* =========================
   AUTH MIDDLEWARE
========================= */
const {
  protectAdmin,
  superAdminOnly,
} = require("./middlewares/authMiddleware");

/* =========================
   PUBLIC ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* =========================
   AUTH ROUTES (PUBLIC)
========================= */
app.use("/api/auth", authRoute);

/* =========================
   ADMIN / PROTECTED ROUTES
========================= */
app.use("/api/admin", protectAdmin, superAdminOnly, adminRoute);
app.use("/api/dashboard", protectAdmin, dashboardRoute);
app.use("/api/reports", protectAdmin, reportRoute);
app.use("/api/roles", protectAdmin, superAdminOnly, rolesRoute);
app.use("/api/settings", protectAdmin, settingsRoute);
app.use("/api/disputes", protectAdmin, disputesRoute);
app.use("/api/kyc", protectAdmin, kycRoute);
app.use("/api/accounts", protectAdmin, accountRoute);
app.use("/api/users", protectAdmin, userRoute);
app.use("/api/user-profile", protectAdmin, userProfileRoute);
app.use("/api/fees", protectAdmin, feeRoute);
app.use("/api/transactions", protectAdmin, transactionRoute);
app.use("/api/notifications", protectAdmin, notificationRoute);
app.use("/api/chat", protectAdmin, chatsRoute);
app.use("/api/adminfunding", protectAdmin, adminFundingRoute);

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
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* =========================
   SOCKET JWT AUTH
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
  console.log(`🔌 Socket connected: ${socket.id} | Role: ${socket.user.role}`);

  const Chat = require("./models/Chat");

  // Admin room
  if (["Admin", "SuperAdmin"].includes(socket.user.role)) {
    socket.join("admin-room");
    console.log(`🛡️ ${socket.id} joined admin-room`);
  }

  /* -------- CHAT SUBSCRIBE -------- */
  socket.on("chat:subscribe", (chatId) => {
    socket.join(`chat_${chatId}`);
  });

  /* -------- SEND MESSAGE -------- */
  socket.on("chat:send", async ({ chatId, sender, content }) => {
    try {
      if (!chatId || !sender || !content) return;
      if (!["user", "admin"].includes(sender)) return;

      const chat = await Chat.findById(chatId);
      if (!chat) return;

      const message = {
        sender,
        content,
        timestamp: new Date(),
        read: false,
      };

      chat.messages.push(message);
      chat.lastMessageAt = new Date();
      await chat.save();

      io.to(`chat_${chatId}`).emit("chat:receive", {
        chatId,
        message,
      });

      io.to("admin-room").emit("chat:update", {
        chatId,
        lastMessage: message,
      });
    } catch (err) {
      console.error("Chat send error:", err.message);
    }
  });

  /* -------- MARK READ -------- */
  socket.on("chat:mark-read", async ({ chatId }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      chat.messages.forEach((msg) => (msg.read = true));
      await chat.save();

      io.to("admin-room").emit("chat:update", {
        chatId,
        messagesRead: true,
      });
    } catch (err) {
      console.error("Mark read error:", err.message);
    }
  });

  /* -------- KYC REALTIME -------- */
  socket.on("kyc:update", (data) => {
    io.to("admin-room").emit("kyc:update", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
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

    const server = app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log("📡 Socket.IO active");
    });
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

startServer();

module.exports = app;
