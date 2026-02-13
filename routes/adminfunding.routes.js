// admin/routes/adminFundingRoutes.js
const express = require("express");
const router = express.Router();
const {
  protect,
  adminOnly,
  adminOrSuperAdmin, // admin-only access middleware
} = require("../middlewares/auth.middleware");

const {
  getAllFundingRequests,
  approveFundingRequest,
  rejectFundingRequest,
  getAllUserWallets,
} = require("../controllers/adminFunding.controller");

// ===============================
// Funding Requests (Admin Access)
// ===============================

// Get all user funding requests
router.get(
  "/funding-requests",
  protect,
  adminOrSuperAdmin, // allow both Admin and SuperAdmin to view funding requests
  getAllFundingRequests,
);

// Approve a funding request
router.patch(
  "/funding-requests/:id/approve",
  protect,
  adminOrSuperAdmin, // allow both Admin and SuperAdmin to approve
  approveFundingRequest,
);

// Reject a funding request
router.patch(
  "/funding-requests/:id/reject",
  protect,
  adminOrSuperAdmin, // allow both Admin and SuperAdmin to reject
  rejectFundingRequest,
);

// ===============================
// User Wallets
// ===============================

// Get all user wallets
router.get(
  "/wallets",
  protect,
  adminOrSuperAdmin, // allow both Admin and SuperAdmin to view wallets
  getAllUserWallets,
);

module.exports = router;
