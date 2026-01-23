const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one wallet per user
    },

    totalBalance: { type: Number, default: 0 }, // Total balance including frozen
    availableBalance: { type: Number, default: 0 }, // Usable balance
    frozenAmount: { type: Number, default: 0 }, // Frozen funds (e.g., pending transactions)

    currency: { type: String, default: "USD" }, // Flexible currency
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

    lastTransactionAt: Date, // Tracks last transaction date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", WalletSchema);
