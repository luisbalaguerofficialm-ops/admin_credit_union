const express = require("express");
const router = express.Router();

const {
  getAllAccounts,
  getAccountById,
  updateAccountStatus,
} = require("../controllers/account.controller");

const { adjustBalance } = require("../controllers/balance.controller");

const {
  setTransactionLimit,
} = require("../controllers/transactionLimit.controller");

// ACCOUNT MANAGEMENT
router.get("/", getAllAccounts);
router.get("/:id", getAccountById);
router.patch("/:id/status", updateAccountStatus);

// BALANCE ADJUSTMENT
router.post("/:id/adjust-balance", adjustBalance);

// TRANSACTION LIMITS
router.post("/:id/transaction-limits", setTransactionLimit);

module.exports = router;
