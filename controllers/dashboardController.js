const User = require("../models/User");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const KYC = require("../models/Kyc");

/* =====================================================
   DASHBOARD STATS (INITIAL LOAD)
===================================================== */
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      accounts,
      todayTransactions,
      todayDeposits,
      pendingKYC,
      flaggedTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      Account.find({}, { totalBalance: 1 }),
      Transaction.countDocuments({ createdAt: { $gte: today } }),
      Transaction.countDocuments({
        type: "deposit",
        createdAt: { $gte: today },
      }),
      KYC.countDocuments({ status: "pending" }),
      Transaction.countDocuments({ status: "failed" }),
    ]);

    const totalBalance = accounts.reduce(
      (sum, acc) => sum + (acc.totalBalance || 0),
      0,
    );

    res.json({
      totalUsers,
      totalBalance,
      todayTransactions,
      todayDeposits,
      pendingKYC,
      flaggedTransactions,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};

/* =====================================================
   REALTIME DASHBOARD EMITTER
   Call this after ANY relevant action
===================================================== */
exports.emitDashboardUpdate = async (req) => {
  try {
    const io = req.app.get("io");
    if (!io) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      accounts,
      todayTransactions,
      todayDeposits,
      pendingKYC,
      flaggedTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      Account.find({}, { totalBalance: 1 }),
      Transaction.countDocuments({ createdAt: { $gte: today } }),
      Transaction.countDocuments({
        type: "deposit",
        createdAt: { $gte: today },
      }),
      KYC.countDocuments({ status: "pending" }),
      Transaction.countDocuments({ status: "failed" }),
    ]);

    const totalBalance = accounts.reduce(
      (sum, acc) => sum + (acc.totalBalance || 0),
      0,
    );

    /* Emit real-time dashboard update to all connected clients */
    io.emit("dashboard:update", {
      totalUsers,
      totalBalance,
      todayTransactions,
      todayDeposits,
      pendingKYC,
      flaggedTransactions,
    });
  } catch (err) {
    console.error("Dashboard socket emit error:", err);
  }
};
