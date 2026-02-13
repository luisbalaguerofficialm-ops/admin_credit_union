const Kyc = require("../models/Kyc");
const User = require("../models/User");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const { sendEmail } = require("../utils/sendEmail");
const { kycApproved, kycRejected } = require("../utils/kycEmailTemplates");

/**
 * ======================================
 * GET ALL KYC (ADMIN INBOX)
 * ======================================
 */
exports.getAllKyc = async (req, res) => {
  try {
    const kycs = await Kyc.find()
      .populate("user", "email firstName lastName kycStatus profileImage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: kycs.length,
      data: kycs,
    });
  } catch (err) {
    console.error("Fetch KYC error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch KYC records",
    });
  }
};

/**
 * ======================================
 * UPDATE KYC STATUS (ADMIN ACTION)
 * ======================================
 */
exports.updateKycStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid KYC status",
      });
    }

    const kyc = await Kyc.findById(req.params.id).populate("user");

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
    }

    if (kyc.status === status) {
      return res.status(400).json({
        success: false,
        message: `KYC already ${kyc.status}. No further action allowed.`,
      });
    }

    // ✅ Update KYC
    kyc.status = status;
    kyc.adminNote = adminNote || "";
    await kyc.save({ validateBeforeSave: false });

    // ✅ Sync User
    const updateData = {
      kycStatus: status,
    };

    // Set profile image from selfie
    if (status === "approved" && kyc.selfie) {
      updateData.profileImage = kyc.selfie;
    }

    await User.findByIdAndUpdate(kyc.user._id, updateData);

    // 🔄 Re-fetch updated record
    const updatedKyc = await Kyc.findById(req.params.id).populate("user");

    res.json({
      success: true,
      message: "KYC status updated successfully",
      kyc: updatedKyc,
    });
  } catch (err) {
    console.error("Update KYC error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update KYC status",
    });
  }
};
