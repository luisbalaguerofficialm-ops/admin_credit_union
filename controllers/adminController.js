const Admin = require("../models/Admin");
const AdminActivity = require("../models/AdminActivity");
const bcrypt = require("bcryptjs");

/**
 * POST /api/admin/create
 * SuperAdmin only
 */
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

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
  } catch (error) {
    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/all
 */
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};

/**
 * GET /api/admin/:id
 */
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin" });
  }
};

/**
 * PUT /api/admin/:id
 */
exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent duplicate email
    if (email && email !== admin.email) {
      const exists = await Admin.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      admin.email = email;
    }

    if (name) admin.name = name;
    if (role) admin.role = role;

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.json({
      success: true,
      message: "Admin updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update admin",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/:id
 */
exports.deleteAdmin = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin" });
  }
};

/**
 * GET /api/admin/me
 * Used by Settings page
 */
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * PUT /api/admin/me
 * Update logged-in admin profile
 */
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, department, avatar, notifications } = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (department) admin.department = department;
    if (avatar) admin.avatar = avatar;
    if (notifications) admin.notifications = notifications;

    await admin.save();

    res.json({
      success: true,
      message: "Profile updated",
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * GET /api/admin/activity
 */
exports.getAdminActivity = async (req, res) => {
  try {
    const logs = await AdminActivity.find()
      .populate("adminId", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin activity" });
  }
};

/**
 * PUT /api/admin/me/avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.avatar = req.file.path; // Cloudinary URL
    await admin.save();

    res.json({
      success: true,
      avatar: admin.avatar,
    });
  } catch (error) {
    res.status(500).json({
      message: "Avatar upload failed",
      error: error.message,
    });
  }
};
