// models/PublicKyc.js
const mongoose = require("mongoose");

const PublicKycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one KYC per user
    },

    idType: {
      type: String,
      required: true,
      trim: true,
    },

    idNumber: {
      type: String,
      required: true,
      trim: true,
    },

    idType: {
      type: String,
      enum: ["passport", "drivers_license", "national_id"],
      required: true,
    },

    idFront: { type: String, required: true },
    idBack: { type: String, required: true },
    selfie: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    country: {
      type: String,
      required: true,
    },

    docs: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PublicKyc", PublicKycSchema);
