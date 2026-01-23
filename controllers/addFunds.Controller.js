const Wallet = require("../models/Wallet");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const FundingRequest = require("../models/AdminFunds");

/**
 * =====================================================
 * USER: CREATE FUNDING REQUEST
 * POST /api/funding-request
 * =====================================================
 */
exports.createFundingRequest = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const request = await FundingRequest.create({
      user: req.user.id,
      amount,
      method: method || "Bank Transfer",
      reference,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Funding request submitted",
      request,
    });
  } catch (error) {
    console.error("Create Funding Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create funding request",
    });
  }
};

/**
 * =====================================================
 * USER: GET MY FUNDING REQUESTS
 * GET /api/funding-request/me
 * =====================================================
 */
exports.getMyFundingRequests = async (req, res) => {
  try {
    const requests = await FundingRequest.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get My Funding Requests Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch funding history",
    });
  }
};

/**
 * =====================================================
 * ADMIN: GET ALL FUNDING REQUESTS
 * GET /api/funding-request
 * =====================================================
 */
exports.getAllFundingRequests = async (req, res) => {
  try {
    const requests = await FundingRequest.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get All Funding Requests Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch funding requests",
    });
  }
};

/**
 * =====================================================
 * ADMIN: REVIEW FUNDING REQUEST
 * PUT /api/funding-request/:id
 * =====================================================
 */
exports.reviewFundingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, note } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be approve or reject",
      });
    }

    const request = await FundingRequest.findById(id).populate("user");
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Funding request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    // ❌ REJECT
    if (action === "reject") {
      request.status = "rejected";
      request.reviewNote = note || "Rejected by admin";
      request.reviewedAt = new Date();
      await request.save();

      return res.status(200).json({
        success: true,
        message: "Funding request rejected",
        request,
      });
    }

    // ✅ APPROVE
    const amount = Number(request.amount);
    const userId = request.user._id;

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0 });
    }

    wallet.balance += amount;
    await wallet.save();

    const transaction = await Transaction.create({
      user: userId,
      type: "Deposit",
      amount,
      status: "Completed",
      description: "Bank funding approved by admin",
      reference: request._id,
    });

    request.status = "approved";
    request.reviewNote = note || "Approved by admin";
    request.reviewedAt = new Date();
    await request.save();

    const io = req.app.get("io");
    if (io) {
      emitDashboardUpdate(io, userId);
    }

    res.status(200).json({
      success: true,
      message: "Funding request approved",
      wallet,
      transaction,
      request,
    });
  } catch (error) {
    console.error("Review Funding Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
