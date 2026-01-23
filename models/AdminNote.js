const mongoose = require("mongoose");

const AdminNoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: String,
    admin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminNote", AdminNoteSchema);
