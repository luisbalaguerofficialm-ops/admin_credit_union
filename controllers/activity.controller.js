const AdminActivity = require("../models/AdminActivity");

exports.getRecentActivities = async (req, res) => {
  const activities = await AdminActivity.find()
    .sort({ createdAt: -1 })
    .limit(6);

  res.json(activities);
};
