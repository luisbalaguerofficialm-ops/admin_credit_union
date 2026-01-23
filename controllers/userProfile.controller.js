const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Device = require("../models/Device");
const AdminNote = require("../models/AdminNote");

/**
 * GET /api/users/:id/profile
 */
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};

/**
 * GET /api/users/:id/wallet
 */
exports.getUserWallet = async (req, res) => {
  const wallet = await Wallet.findOne({ user: req.params.id });
  res.json(wallet);
};

/**
 * GET /api/users/:id/transactions
 */
exports.getUserTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(transactions);
};

/**
 * GET /api/users/:id/devices
 */
exports.getUserDevices = async (req, res) => {
  const devices = await Device.find({ user: req.params.id });
  res.json(devices);
};

/**
 * GET /api/users/:id/notes
 */
exports.getUserNotes = async (req, res) => {
  const notes = await AdminNote.find({ user: req.params.id });
  res.json(notes);
};

/**
 * POST /api/users/:id/notes
 */
exports.addAdminNote = async (req, res) => {
  const note = await AdminNote.create({
    user: req.params.id,
    note: req.body.note,
    admin: req.body.admin,
  });

  res.status(201).json(note);
};
