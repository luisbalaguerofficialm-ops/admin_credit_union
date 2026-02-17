const express = require("express");
const router = express.Router();

const {
  getAllAccounts,
  getAccountById,
  updateAccountStatus,
} = require("../controllers/accountController");

const { adjustBalance } = require("../controllers/balanceController");

const {
  setTransactionLimit,
} = require("../controllers/transactionLimitController");

// ACCOUNT MANAGEMENT
router.get("/", getAllAccounts);
router.get("/:id", getAccountById);
router.patch("/:id/status", updateAccountStatus);

// BALANCE ADJUSTMENT
router.post("/:id/adjust-balance", adjustBalance);

// TRANSACTION LIMITS
router.post("/:id/transaction-limits", setTransactionLimit);

module.exports = router;
