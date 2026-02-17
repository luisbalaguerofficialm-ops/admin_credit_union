const express = require("express");
const router = express.Router();
const {
  createFeeRule,
  getFeeRules,
  updateFeeRule,
  disableFeeRule,
} = require("../controllers/feeController");

// Create fee rule
router.post("/", createFeeRule);

// Get all fee rules
router.get("/", getFeeRules);

// Update fee rule
router.put("/:id", updateFeeRule);

// Disable fee rule
router.patch("/:id/disable", disableFeeRule);

module.exports = router;
