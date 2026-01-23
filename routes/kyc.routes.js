const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kyc.controller");

// ADMIN ROUTES ONLY
router.get("/", kycController.getAllKyc);
router.patch("/:id", kycController.updateKycStatus);

module.exports = router;
