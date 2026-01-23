const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    channel: { type: String, enum: ["InApp", "SMS", "Email"], required: true },
    variables: [{ type: String }],
    modifiedBy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
