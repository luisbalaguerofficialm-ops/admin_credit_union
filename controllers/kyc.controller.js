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
      .populate("user", "email firstName lastName kycStatus")
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

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid KYC status" });
    }

    const kyc = await Kyc.findById(req.params.id).populate("user");

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC record not found",
      });
    }

    kyc.status = status;
    kyc.note = adminNote;
    await kyc.save();

    // 🔥 UPDATE USER KYC STATUS (CRITICAL)
    await User.findByIdAndUpdate(kyc.user._id, {
      kycStatus: status,
    });

    // 📡 REAL-TIME UPDATE → USER
    const io = req.app.get("io");
    io.to(kyc.user._id.toString()).emit("kyc:status", {
      status,
      adminNote,
    });

    // 📧 SEND EMAIL
    if (kyc.user.email) {
      const appName = process.env.APP_NAME || "Credixa";

      try {
        if (status === "approved") {
          await sendEmail({
            to: kyc.user.email,
            subject: `✅ Your ${appName} KYC Verification Has Been Approved!`,
            html: kycApproved(
              kyc.user.fullName || kyc.user.firstName || "User",
              appName,
            ),
          });
        }

        if (status === "rejected") {
          await sendEmail({
            to: kyc.user.email,
            subject: `⚠️ Your ${appName} KYC Verification Status Update`,
            html: kycRejected(
              kyc.user.fullName || kyc.user.firstName || "User",
              adminNote,
              appName,
            ),
          });
        }
      } catch (emailError) {
        console.error("KYC email sending error:", emailError);
        // Don't fail the KYC update if email fails
      }
    }

    res.json({
      success: true,
      message: "KYC status updated successfully",
      kyc,
    });
  } catch (err) {
    console.error("Update KYC error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update KYC status",
    });
  }
};
