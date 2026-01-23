const AdminActivity = require("../models/AdminActivity");

const logActivity = (action) => {
  return async (req, res, next) => {
    await AdminActivity.create({
      adminId: req.user.id,
      action,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    next();
  };
};

module.exports = logActivity;
