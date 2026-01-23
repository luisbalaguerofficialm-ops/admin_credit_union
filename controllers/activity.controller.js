const ActivityLog = require("../models/ActivityLog");

exports.getRecentActivities = async (req, res) => {
  const activities = await ActivityLog.find().sort({ createdAt: -1 }).limit(6);

  res.json(activities);
};
