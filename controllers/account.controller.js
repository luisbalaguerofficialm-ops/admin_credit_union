const Wallet = require("../models/AdminWallet");
const Transaction = require("../models/Transaction");

const Account = require("../models/Account");

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch accounts" });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(account);
  } catch (err) {
    res.status(500).json({ message: "Unable to update status" });
  }
};

/**
 * GET /api/accounts/stats
 */
exports.getAccountStats = async (req, res) => {
  const wallets = await Wallet.find();

  const stats = {
    totalBalance: wallets.reduce((a, w) => a + w.totalBalance, 0),
    active: wallets.filter((w) => w.status === "Active").length,
    frozen: wallets.filter((w) => w.status === "Frozen").length,
    suspended: wallets.filter((w) => w.status === "Suspended").length,
  };

  res.json(stats);
};

/**
 * POST /api/accounts/:id/freeze
 */
exports.freezeAccount = async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  wallet.status = "Frozen";
  wallet.frozenAmount = wallet.availableBalance;
  wallet.availableBalance = 0;
  await wallet.save();

  await Transaction.create({
    wallet: wallet._id,
    type: "freeze",
    balanceAfter: wallet.totalBalance,
  });

  res.json({ message: "Wallet frozen", wallet });
};

/**
 * POST /api/accounts/:id/unfreeze
 */
exports.unfreezeAccount = async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  wallet.availableBalance += wallet.frozenAmount;
  wallet.frozenAmount = 0;
  wallet.status = "Active";
  await wallet.save();

  await Transaction.create({
    wallet: wallet._id,
    type: "unfreeze",
    balanceAfter: wallet.totalBalance,
  });

  res.json({ message: "Wallet unfrozen", wallet });
};

/**
 * POST /api/accounts/:id/adjust
 */
