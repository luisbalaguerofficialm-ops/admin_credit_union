// models/AdminKyc.js
const mongoose = require("mongoose");

const AdminKycSchema = new mongoose.Schema(
  {
    kyc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicKyc",
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    risk: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    adminNote: {
      type: String,
      trim: true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    reviewedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminKyc", AdminKycSchema);
