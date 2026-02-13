// admin_credit_backend/models/Wallet.js
const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wallet per user
    },

    // Core balances
    balance: { type: Number, default: 500000000, min: 0 }, // mirrors user wallet
    availableBalance: { type: Number, default: 500000000, min: 0 }, // usable funds
    frozenAmount: { type: Number, default: 0, min: 0 }, // pending/blocked funds

    // Tracking who updated the wallet last
    lastUpdatedBy: {
      type: String,
      enum: ["user", "superadmin", "admin", "system"],
      default: "system",
    },

    // Admin controls
    currency: { type: String, enum: ["USD", "EUR", "GBP"], default: "USD" },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["Active", "Frozen", "Suspended"],
      default: "Active",
    },
    lastTransactionAt: Date, // tracks last transaction timestamp
  },
  { timestamps: true },
);

/**
 * Safely add funds
 * @param {number} amount
 * @param {string} by - who updated the wallet
 */
WalletSchema.methods.addFunds = async function (amount, by = "admin") {
  if (amount <= 0) throw new Error("Amount must be greater than zero");

  this.balance += amount;
  this.availableBalance += amount;
  this.lastUpdatedBy = by;
  this.lastTransactionAt = new Date();

  await this.save();
  return this.balance;
};

/**
 * Safely deduct funds
 * @param {number} amount
 * @param {string} by
 */
WalletSchema.methods.deductFunds = async function (amount, by = "admin") {
  if (amount <= 0) throw new Error("Amount must be greater than zero");
  if (this.availableBalance < amount)
    throw new Error("Insufficient available balance");

  this.balance -= amount;
  this.availableBalance -= amount;
  this.lastUpdatedBy = by;
  this.lastTransactionAt = new Date();

  await this.save();
  return this.balance;
};

module.exports = mongoose.model("Wallet", WalletSchema);
