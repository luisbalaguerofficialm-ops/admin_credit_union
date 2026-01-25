const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * GET /api/auth/super-admin-exists
 */
exports.checkSuperAdminExists = async (req, res) => {
  const exists = await Admin.exists({ role: "SuperAdmin" });
  res.json({ exists: !!exists });
};

/**
 * POST /api/auth/register-super-admin
 */
exports.registerSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Admin.exists({ role: "SuperAdmin" });
  if (exists) {
    return res
      .status(400)
      .json({ success: false, message: "Super Admin already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: "SuperAdmin",
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
 * POST /api/auth/login
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "14d" },
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
