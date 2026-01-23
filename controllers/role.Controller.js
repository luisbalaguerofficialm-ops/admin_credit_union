const Role = require("../models/Role");

// GET all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ updatedAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE new role
exports.createRole = async (req, res) => {
  try {
    const { name, type, adminsAssigned, permissions } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole)
      return res.status(400).json({ message: "Role already exists" });

    const role = new Role({
      name,
      type: type || "System",
      adminsAssigned: adminsAssigned || 0,
      permissions: permissions || [],
    });

    await role.save();
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE role
exports.updateRole = async (req, res) => {
  try {
    const { name, type, adminsAssigned, status, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (name) role.name = name;
    if (type) role.type = type;
    if (adminsAssigned !== undefined) role.adminsAssigned = adminsAssigned;
    if (status) role.status = status;
    if (permissions) role.permissions = permissions;

    await role.save();
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    await role.deleteOne();
    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
