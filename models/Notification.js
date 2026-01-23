const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    channels: [{ type: String, enum: ["InApp", "SMS", "Email"] }],
    target: {
      type: String,
      enum: [
        "All Users",
        "Verified Users",
        "KYC Pending Users",
        "Inactive Users",
        "Specific User",
      ],
      default: "All Users",
    },
    specificUserId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Failed"],
      default: "Pending",
    },
    sentToCount: { type: Number, default: 0 },
    deliveryTime: { type: Date },
    createdBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
