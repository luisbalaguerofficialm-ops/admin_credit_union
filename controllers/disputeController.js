const Dispute = require("../models/Dispute");

// GET all disputes with optional search and filters
exports.getDisputes = async (req, res) => {
  try {
    const { search, type, status } = req.query;
    let filter = {};

    if (search) {
      filter["$or"] = [
        { "user.name": { $regex: search, $options: "i" } },
        { disputeId: { $regex: search, $options: "i" } },
      ];
    }

    if (type && type !== "All Types") filter.type = type;
    if (status && status !== "All Status") filter.status = status;

    const disputes = await Dispute.find(filter).sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single dispute by ID
exports.getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE dispute status
exports.updateDisputeStatus = async (req, res) => {
  try {
    const { status, priority, notes } = req.body;
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });

    if (status) dispute.status = status;
    if (priority) dispute.priority = priority;
    if (notes) dispute.notes = notes;

    await dispute.save();
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
