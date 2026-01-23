const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    action: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    metadata: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);
