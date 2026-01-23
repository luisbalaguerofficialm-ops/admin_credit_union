const Template = require("../models/Template");

// Create Template
exports.createTemplate = async (req, res) => {
  try {
    const { name, content, channel, variables, modifiedBy } = req.body;
    const template = new Template({
      name,
      content,
      channel,
      variables,
      modifiedBy,
    });
    await template.save();
    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ updatedAt: -1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template)
      return res.status(404).json({ message: "Template not found" });

    const { name, content, channel, variables } = req.body;
    if (name) template.name = name;
    if (content) template.content = content;
    if (channel) template.channel = channel;
    if (variables) template.variables = variables;

    await template.save();
    res.json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template)
      return res.status(404).json({ message: "Template not found" });

    await template.deleteOne();
    res.json({ message: "Template deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
