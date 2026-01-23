const mongoose = require("mongoose");

const TransactionLimitSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String,
      enum: ["transfer", "withdrawal", "deposit"],
      required: true,
    },
    daily: {
      type: Number,
      required: true,
    },
    monthly: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
    },
    setBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransactionLimit", TransactionLimitSchema);
