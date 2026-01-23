const Admin = require("../models/Admin");
const AdminActivity = require("../models/AdminActivity");

/**
 * POST /api/admin/create
 * SuperAdmin only
 */
exports.createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: role || "Admin",
  });

  res.status(201).json({
    success: true,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
};

/**
 * GET /api/admin/all
 */
exports.getAdmins = async (req, res) => {
  const admins = await Admin.find().select("-password");
  res.json(admins);
};

/**
 * GET /api/admin/activity
 */
exports.getAdminActivity = async (req, res) => {
  const logs = await AdminActivity.find()
    .populate("adminId", "name email role")
    .sort({ createdAt: -1 });

  res.json(logs);
};
