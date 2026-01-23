const User = require("../models/User");

// GET all users with filters
exports.getUsers = async (req, res) => {
  try {
    const { search, status, risk } = req.query;
    let filter = {};

    if (search) {
      filter["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { _id: search },
      ];
    }

    if (status && status !== "All Status") filter.status = status;
    if (risk && risk !== "All Risk Level") filter.risk = risk;

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, kyc, balance, status, risk } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const user = new User({ name, email, phone, kyc, balance, status, risk });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, kyc, balance, status, risk } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (kyc) user.kyc = kyc;
    if (balance !== undefined) user.balance = balance;
    if (status) user.status = status;
    if (risk) user.risk = risk;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
