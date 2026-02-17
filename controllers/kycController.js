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
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: kycs.length,
      data: kycs,
    });
  } catch (err) {
    console.error("Fetch KYC error:", err);
    return res.status(500).json({
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

    // ✅ Validate status
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid KYC status",
      });
    }

    // ✅ Find KYC record
    const kyc = await Kyc.findById(req.params.id).populate("user");

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
    }

    // ✅ Prevent duplicate action
    if (kyc.status === status) {
      return res.status(400).json({
        success: false,
        message: `KYC already ${kyc.status}. No further action allowed.`,
      });
    }

    // ======================================
    // UPDATE KYC RECORD
    // ======================================
    kyc.status = status;
    kyc.adminNote = adminNote || "";
    await kyc.save({ validateBeforeSave: false });

    // ======================================
    // SYNC USER ACCOUNT
    // ======================================
    const updateData = { kycStatus: status };

    // Use selfie as profile image when approved
    if (status === "approved" && kyc.selfie) {
      updateData.profileImage = kyc.selfie;
    }

    await User.findByIdAndUpdate(kyc.user._id, updateData, { new: true });

    // ======================================
    // SEND EMAIL NOTIFICATION
    // ======================================
    try {
      if (status === "approved") {
        await sendEmail({
          to: kyc.user.email,
          subject: "KYC Approved ✅",
          html: kycApproved(kyc.user.firstName),
        });
      }

      if (status === "rejected") {
        await sendEmail({
          to: kyc.user.email,
          subject: "KYC Rejected ❌",
          html: kycRejected(kyc.user.firstName, adminNote),
        });
      }
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Do NOT block success because of email failure
    }

    // 🔄 Fetch updated record
    const updatedKyc = await Kyc.findById(req.params.id).populate("user");

    return res.status(200).json({
      success: true,
      message: "KYC status updated successfully",
      data: updatedKyc,
    });
  } catch (err) {
    console.error("Update KYC error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update KYC status",
    });
  }
};
