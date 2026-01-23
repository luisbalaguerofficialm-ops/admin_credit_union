const User = require("../models/User");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update notifications
exports.updateNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.notifications = { ...user.notifications, ...req.body };
    await user.save();
    res.json(user.notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create API key
exports.createApiKey = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newKey = {
      name,
      key: Math.random().toString(36).substr(2, 16),
    };
    user.apiKeys.push(newKey);
    await user.save();
    res.json(newKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update API key active status
exports.updateApiKey = async (req, res) => {
  try {
    const { active } = req.body;
    const user = await User.findById(req.params.id);
    const apiKey = user.apiKeys.id(req.params.keyId);
    if (!apiKey) return res.status(404).json({ error: "API key not found" });

    apiKey.active = active;
    await user.save();
    res.json(apiKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete API key
exports.deleteApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const apiKey = user.apiKeys.id(req.params.keyId);
    if (!apiKey) return res.status(404).json({ error: "API key not found" });

    apiKey.remove();
    await user.save();
    res.json({ message: "API key deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get sessions
exports.getSessions = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user.sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.sessions.id(req.params.sessionId).remove();
    await user.save();
    res.json({ message: "Session removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
