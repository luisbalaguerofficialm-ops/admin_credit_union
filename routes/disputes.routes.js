const express = require("express");
const router = express.Router();
const disputeController = require("../controllers/dispute.Controller");

// Routes mapped to controller functions
router.get("/", disputeController.getDisputes);
router.get("/:id", disputeController.getDisputeById);
router.patch("/:id/status", disputeController.updateDisputeStatus);

module.exports = router;
