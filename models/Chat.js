const mongoose = require("mongoose");

// ------------------------------
// Message Schema
// ------------------------------
const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin"], // explicitly "user" or "admin"
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // track if admin/user has read
});

// ------------------------------
// Chat Schema
// ------------------------------
const ChatSchema = new mongoose.Schema(
  {
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // optional for guest users
      },
      name: { type: String, required: true }, // required for validation
      email: { type: String, required: true }, // required for validation
      online: { type: Boolean, default: true },
    },
    title: { type: String, required: true }, // optional if you want chats to have titles
    description: { type: String, required: true }, // optional chat description
    status: {
      type: String,
      enum: ["Active", "Waiting", "Solved"],
      default: "Waiting",
    },
    assignedTo: { type: String, default: null }, // admin username or id
    lastMessageAt: { type: Date, default: Date.now }, // track last activity
    messages: [MessageSchema], // array of messages
  },
  { timestamps: true },
);

module.exports = mongoose.model("Chat", ChatSchema);
