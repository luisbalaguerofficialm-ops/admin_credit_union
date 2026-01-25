const mongoose = require("mongoose");

const DisputeSchema = new mongoose.Schema(
  {
    disputeId: { type: String, required: true, unique: true },
    user: {
      userId: String,
      name: String,
      email: String,
    },
    type: {
      type: String,
      enum: ["Chargeback", "Refund Request", "Transaction Error", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    description: { type: String, required: true },
    notes: { type: String },
    transactionId: { type: String },
    amount: { type: Number },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
    assignedTo: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Dispute", DisputeSchema);
