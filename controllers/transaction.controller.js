const Transaction = require("../models/Transaction");
const dashboardController = require("./dashboard.controller");

/* =====================================================
   TRANSACTION CHART (READ ONLY)
===================================================== */
exports.getTransactionChart = async (req, res) => {
  try {
    const days = 7;
    const data = [];

    for (let i = days; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const [transfer, deposit, withdraw] = await Promise.all([
        Transaction.countDocuments({
          type: "transfer",
          createdAt: { $gte: start, $lte: end },
        }),
        Transaction.countDocuments({
          type: "deposit",
          createdAt: { $gte: start, $lte: end },
        }),
        Transaction.countDocuments({
          type: "withdrawal",
          createdAt: { $gte: start, $lte: end },
        }),
      ]);

      data.push({
        date: start.toISOString().split("T")[0],
        transfer,
        deposit,
        withdraw,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Transaction chart error" });
  }
};

/* =====================================================
   RECENT TRANSACTIONS
===================================================== */
exports.getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(9);

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET ALL TRANSACTIONS (FILTERS)
===================================================== */
exports.getTransactions = async (req, res) => {
  try {
    const { search, type, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
      ];
    }

    if (type && type !== "All Types") filter.type = type;
    if (status && status !== "All Status") filter.status = status;

    const transactions = await Transaction.find(filter).sort({
      createdAt: -1,
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET SINGLE TRANSACTION
===================================================== */
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   UPDATE TRANSACTION STATUS (REALTIME + DASHBOARD)
===================================================== */
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (status) transaction.status = status;
    if (notes) transaction.notes = notes;

    await transaction.save();

    const io = req.app.get("io");

    /* Emit real-time transaction update */
    io.emit("transaction:update", transaction);

    /* Emit live dashboard refresh */
    await dashboardController.emitDashboardUpdate(req);

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
