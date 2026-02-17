const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Routes
router.get("/", transactionController.getTransactions);
router.get("/:id", transactionController.getTransactionById);
router.patch("/:id/status", transactionController.updateTransactionStatus);

module.exports = router;
