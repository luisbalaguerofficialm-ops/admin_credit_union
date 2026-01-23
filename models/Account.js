const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema(
  {
    userId: String,
    fullName: String,
    email: String,

    totalBalance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    frozenBalance: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Active", "Frozen", "Suspended"],
      default: "Active",
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", AccountSchema);
