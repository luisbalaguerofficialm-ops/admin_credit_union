const mongoose = require("mongoose");

const KycSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },

    idType: String,
    idNumber: String,

    idFront: String,
    idBack: String,
    selfie: String,

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
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
  { timestamps: true }
);

module.exports = mongoose.model("Kyc", KycSchema);
