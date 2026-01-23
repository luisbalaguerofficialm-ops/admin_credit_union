const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema(
  {
    amount: Number,
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settlement", settlementSchema);
