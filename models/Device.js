const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    device: String,
    ip: String,
    lastLogin: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", DeviceSchema);
