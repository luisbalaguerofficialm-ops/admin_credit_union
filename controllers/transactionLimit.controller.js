const TransactionLimit = require("../models/TransactionLimit");
const AuditLog = require("../models/AuditLog");

exports.setTransactionLimit = async (req, res) => {
  try {
    const { type, daily, monthly, reason } = req.body;

    const limit = await TransactionLimit.findOneAndUpdate(
      { account: req.params.id, type },
      {
        daily,
        monthly,
        reason,
        setBy: req.admin?._id,
      },
      { upsert: true, new: true }
    );

    await AuditLog.create({
      action: "SET_TRANSACTION_LIMIT",
      account: req.params.id,
      performedBy: req.admin?._id,
      metadata: { type, daily, monthly },
    });

    res.json({ message: "Transaction limit saved", limit });
  } catch (err) {
    res.status(500).json({ message: "Failed to save limits" });
  }
};
