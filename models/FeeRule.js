const mongoose = require("mongoose");

const FeeRuleSchema = new mongoose.Schema(
  {
    ruleName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Transfer", "Withdrawal", "Service"],
      required: true,
    },

    structure: {
      type: String,
      enum: ["Fixed", "Percentage", "Hybrid"],
      required: true,
    },

    amount: {
      type: String, // supports ₦50, 1.5%, ₦100 + 0.5%
      required: true,
    },

    minLimit: {
      type: Number,
      required: true,
    },

    maxLimit: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Disabled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeRule", FeeRuleSchema);
