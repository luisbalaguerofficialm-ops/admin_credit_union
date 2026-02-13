const mongoose = require("mongoose");

const KycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    country: { type: String, required: true },

    idType: {
      type: String,
      enum: ["passport", "drivers_license", "national_id"],
      required: true,
    },
    idNumber: { type: String, required: true },

    idFront: { type: String, required: true },
    idBack: { type: String, required: true },
    selfie: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    aml: {
      type: String,
      default: "None",
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

    note: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Kyc", KycSchema);
