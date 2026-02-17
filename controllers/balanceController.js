const Account = require("../models/Account");
const AuditLog = require("../models/AuditLog");

exports.adjustBalance = async (req, res) => {
  try {
    const { type, amount, reason } = req.body;
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (type === "credit") {
      account.totalBalance += amount;
      account.availableBalance += amount;
    } else {
      if (account.availableBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      account.totalBalance -= amount;
      account.availableBalance -= amount;
    }
    req.io.emit("dashboard:update", {
      type: "balance_adjustment",
    });

    await account.save();

    await AuditLog.create({
      action: "BALANCE_ADJUSTMENT",
      account: account._id,
      performedBy: req.admin?._id,
      metadata: { type, amount, reason },
    });

    res.json({ message: "Balance updated successfully", account });
  } catch (err) {
    res.status(500).json({ message: "Balance adjustment failed" });
  }
};
