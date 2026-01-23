const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },

    transactionId: { type: String, required: true, unique: true },
    user: {
      userId: String,
      name: String,
    },
    type: {
      type: String,
      enum: ["Transfer", "Deposit", "Withdrawal"],
      required: true,
    },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Flagged", "Failed"],
      default: "Pending",
    },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },

    type: {
      type: String,
      enum: ["credit", "debit", "freeze", "unfreeze"],
      required: true,
    },

    amount: Number,
    balanceAfter: Number,
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
