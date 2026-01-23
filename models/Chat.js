const mongoose = require("mongoose");

// Each chat message
const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin"], // explicitly "user" or "admin"
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // track if admin/user has read the message
});

// Main chat thread for a user
const ChatSchema = new mongoose.Schema(
  {
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      }, // optional, if you have user accounts
      name: { type: String, required: true },
      email: { type: String, required: true },
      online: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: ["Active", "Waiting", "Solved"],
      default: "Waiting",
    },
    assignedTo: { type: String, default: null }, // admin username or id
    lastMessageAt: { type: Date, default: Date.now }, // track last activity
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
