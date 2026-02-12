const mongoose = require("mongoose");

const KycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },

    idType: String,
    idNumber: String,

    idFront: String,
    idBack: String,
    selfie: String,

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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Kyc", KycSchema);
