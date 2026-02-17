const express = require("express");
const router = express.Router();

const kycController = require("../controllers/kycController");
const {
  protect,
  adminOrSuperAdmin,
  superAdminOnly,
} = require("../middlewares/authMiddleware");

/* =========================
   KYC ROUTES
========================= */

// ✅ GET all KYC - Admin + SuperAdmin
router.get("/", protect, adminOrSuperAdmin, kycController.getAllKyc);

// ✅ PATCH KYC status - SuperAdmin only
router.patch("/:id", protect, superAdminOnly, kycController.updateKycStatus);

module.exports = router;
