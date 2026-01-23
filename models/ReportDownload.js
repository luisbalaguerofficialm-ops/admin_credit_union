const mongoose = require("mongoose");

const reportDownloadSchema = new mongoose.Schema(
  {
    reportName: String,
    downloadedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportDownload", reportDownloadSchema);
