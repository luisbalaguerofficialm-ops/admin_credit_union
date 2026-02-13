// admin_credit_backend/models/AdminFundingRequest.js
const mongoose = require("mongoose");

const adminFundingRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    reviewNote: {
      type: String,
      trim: true,
      default: "",
    },

    // Store actual admin ID instead of just string
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Your Admin model name
    },

    reviewedRole: {
      type: String,
      enum: ["admin", "superadmin"],
    },

    reviewedAt: {
      type: Date,
    },

    originalRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundingRequest", // must match collection name
    },

    transactionReference: {
      type: String,
      unique: true,
      sparse: true, // only required when generated
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Generate transaction reference automatically before save
 */
adminFundingRequestSchema.pre("save", function (next) {
  if (!this.transactionReference) {
    this.transactionReference =
      "AFR-" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

module.exports = mongoose.model(
  "AdminFundingRequest",
  adminFundingRequestSchema,
);
