const Notification = require("../models/Notification");
const dashboardController = require("./dashboardController"); // imported for dashboard refresh

/* =========================
   SEND NOTIFICATION
========================= */
exports.sendNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      channels,
      target,
      specificUserId,
      createdBy,
      deliveryTime,
    } = req.body;

    // Example logic for sentToCount
    const sentToCount = target === "Specific User" && specificUserId ? 1 : 1000;

    const notification = new Notification({
      title,
      message,
      channels,
      target,
      specificUserId,
      status: "Delivered",
      sentToCount,
      deliveryTime: deliveryTime || new Date(),
      createdBy,
    });

    await notification.save();

    // Emit notification via Socket.IO
    const io = req.app.get("io");
    if (!io) return;

    if (target === "Specific User" && specificUserId) {
      io.to(`user_${specificUserId}`).emit("notification:new", notification);
    } else {
      io.to("admin-room").emit("notification:new", notification);
      io.emit("notification:new", notification);
    }

    // Refresh dashboard stats after sending notification
    dashboardController.emitDashboardUpdate(req);

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (err) {
    console.error("Send notification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};

/* =========================
   GET NOTIFICATION HISTORY
========================= */
exports.getNotifications = async (req, res) => {
  try {
    const { status, dateRange } = req.query;
    const filter = {};

    if (status && status !== "All Status") filter.status = status;

    if (dateRange) {
      const [start, end] = dateRange.split(",");
      filter.createdAt = { $gte: new Date(start), $lte: new Date(end) };
    }

    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

/* =========================
   SUBSCRIBE USER TO SOCKET ROOM
========================= */
exports.subscribeUser = (socket, userId) => {
  socket.join(`user_${userId}`);
};

/* =========================
   SUBSCRIBE ADMIN TO NOTIFICATIONS
========================= */
exports.subscribeAdmin = (socket) => {
  socket.join("admin-room");
};
