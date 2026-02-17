// admin/controllers/AdminFunding.controller.js

const AdminWallet = require("../models/AdminWallet");
const AdminFundingRequest = require("../models/AdminFundingRequest");

/**
 * GET ALL FUNDING REQUESTS (from admin DB)
 * GET /api/admin/funding-requests
 */
exports.getAllFundingRequests = async (req, res) => {
  try {
    const requests = await AdminFundingRequest.find()
      .populate("user", "name email")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) {
    console.error("Get all funding requests error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * APPROVE FUNDING REQUEST
 * PATCH /api/admin/funding-requests/:id/approve
 */
exports.approveFundingRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { reviewNote } = req.body;

    const request = await AdminFundingRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed",
      });
    }

    // Find or create wallet
    let wallet = await AdminWallet.findOne({ user: request.user });

    if (!wallet) {
      wallet = await AdminWallet.create({
        user: request.user,
      });
    }

    // Use wallet method (safe)
    await wallet.addFunds(request.amount, req.user.role.toLowerCase());

    // Update funding request
    request.status = "approved";
    request.reviewNote = reviewNote || "";
    request.reviewedBy = req.user._id;
    request.reviewedRole = req.user.role.toLowerCase();
    request.reviewedAt = new Date();

    await request.save();

    res.json({
      success: true,
      message: "Funding request approved successfully",
      request,
    });
  } catch (err) {
    console.error("Approve funding request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * REJECT FUNDING REQUEST
 * PATCH /api/admin/funding-requests/:id/reject
 */
exports.rejectFundingRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { reviewNote } = req.body;

    const request = await AdminFundingRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed",
      });
    }

    request.status = "rejected";
    request.reviewNote = reviewNote || "";
    request.reviewedBy = req.user._id;
    request.reviewedRole = req.user.role.toLowerCase();
    request.reviewedAt = new Date();

    await request.save();

    res.json({
      success: true,
      message: "Funding request rejected successfully",
      request,
    });
  } catch (err) {
    console.error("Reject funding request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET ALL ADMIN USER WALLETS
 * GET /api/admin/wallets
 */
exports.getAllUserWallets = async (req, res) => {
  try {
    const wallets = await AdminWallet.find()
      .populate("user", "name email")
      .sort({ updatedAt: -1 });

    res.json({ success: true, wallets });
  } catch (err) {
    console.error("Get all user wallets error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
