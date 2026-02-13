const mongoose = require("mongoose");

const FeeTierSchema = new mongoose.Schema({
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
});

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
      enum: ["Tiered", "Fixed", "Percentage"],
      required: true,
    },

    tiers: [FeeTierSchema], // 🔥 This handles your ranges

    status: {
      type: String,
      enum: ["Active", "Disabled"],
      default: "Active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("FeeRule", FeeRuleSchema);
