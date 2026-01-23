const Transaction = require("../models/Transaction");
const Settlement = require("../models/Settlement");
const User = require("../models/User");
const ReportDownload = require("../models/ReportDownload");

/* ================================
   REVENUE REPORT
================================ */
exports.getRevenueReport = async (req, res) => {
  const data = await Transaction.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data.map((d) => ({ name: d._id, revenue: d.revenue })));
};

/* ================================
   TRANSACTION REPORT
================================ */
exports.getTransactionReport = async (req, res) => {
  const data = await Transaction.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          type: "$type",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {};
  data.forEach((d) => {
    if (!result[d._id.date]) {
      result[d._id.date] = {
        name: d._id.date,
        transfer: 0,
        deposit: 0,
        withdraw: 0,
      };
    }
    result[d._id.date][d._id.type] = d.count;
  });

  res.json(Object.values(result));
};

/* ================================
   SETTLEMENT REPORT
================================ */
exports.getSettlementReport = async (req, res) => {
  const data = await Settlement.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          status: "$status",
        },
        total: { $sum: "$amount" },
      },
    },
  ]);

  const result = {};
  data.forEach((d) => {
    if (!result[d._id.date]) {
      result[d._id.date] = {
        name: d._id.date,
        completed: 0,
        pending: 0,
      };
    }
    result[d._id.date][d._id.status] = d.total;
  });

  res.json(Object.values(result));
};

/* ================================
   USER ACTIVITY REPORT
================================ */
exports.getUserActivityReport = async (req, res) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
        newUser: { $sum: 1 },
      },
    },
  ]);

  res.json(
    users.map((u) => ({
      name: u._id,
      login: Math.floor(Math.random() * 500), // replace with login logs
      newUser: u.newUser,
    }))
  );
};

/* ================================
   DOWNLOAD HISTORY
================================ */
exports.getDownloadHistory = async (req, res) => {
  const history = await ReportDownload.find().sort({ createdAt: -1 }).limit(10);

  res.json(history);
};
