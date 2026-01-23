const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["System", "Custom"], default: "System" },
    adminsAssigned: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    permissions: [{ type: String }], // e.g., ["read_users", "edit_users"]
  },
  { timestamps: true } // includes createdAt & updatedAt
);

module.exports = mongoose.model("Role", RoleSchema);
