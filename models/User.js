const mongoose = require("mongoose");

// Notification settings sub-schema
const notificationSettingsSchema = new mongoose.Schema({
  system: { type: Boolean, default: true },
  login: { type: Boolean, default: true },
  fraud: { type: Boolean, default: true },
  updates: { type: Boolean, default: true },
  failedActions: { type: Boolean, default: true },
  criticalErrors: { type: Boolean, default: true },
});

// API key sub-schema
const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

// Session sub-schema
const sessionSchema = new mongoose.Schema({
  device: String,
  location: String,
  lastActive: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    // General profile
    fullName: { type: String, required: true },
    role: {
      type: String,
      default: "SuperAdmin",
      enum: ["SuperAdmin", "Admin", "Staff"],
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: { type: String },
    avatar: { type: String }, // Base64 or URL

    // Settings
    notifications: { type: notificationSettingsSchema, default: () => ({}) },
    apiKeys: [apiKeySchema],
    sessions: [sessionSchema],

    // KYC / Banking info
    kyc: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    // Admin-controlled balance (mirrors Wallet)
    balance: { type: Number, default: 0 }, // total available balance
    currency: { type: String, default: "USD" },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
