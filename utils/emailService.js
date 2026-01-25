// utils/emailService.js
/**
 * Comprehensive Email Service for KYC and Notifications
 * Uses Resend API for reliable email delivery
 */

const { sendEmail } = require("./sendEmail");
const { kycApproved, kycRejected, kycPending } = require("./kycEmailTemplates");

/**
 * Send KYC Approval Email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's full name
 * @param {string} appName - Application name (default: Credixa)
 */
exports.sendKycApprovalEmail = async (
  userEmail,
  userName,
  appName = "Credixa",
) => {
  try {
    const result = await sendEmail({
      to: userEmail,
      subject: `✅ Your ${appName} KYC Verification Has Been Approved!`,
      html: kycApproved(userName, appName),
    });

    console.log("✅ KYC Approval email sent:", result.id);
    return result;
  } catch (error) {
    console.error("❌ Failed to send KYC approval email:", error.message);
    throw error;
  }
};

/**
 * Send KYC Rejection Email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's full name
 * @param {string} reason - Reason for rejection
 * @param {string} appName - Application name (default: Credixa)
 */
exports.sendKycRejectionEmail = async (
  userEmail,
  userName,
  reason,
  appName = "Credixa",
) => {
  try {
    const result = await sendEmail({
      to: userEmail,
      subject: `⚠️ Your ${appName} KYC Verification Status Update`,
      html: kycRejected(userName, reason, appName),
    });

    console.log("✅ KYC Rejection email sent:", result.id);
    return result;
  } catch (error) {
    console.error("❌ Failed to send KYC rejection email:", error.message);
    throw error;
  }
};

/**
 * Send KYC Pending Email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's full name
 * @param {string} appName - Application name (default: Credixa)
 */
exports.sendKycPendingEmail = async (
  userEmail,
  userName,
  appName = "Credixa",
) => {
  try {
    const result = await sendEmail({
      to: userEmail,
      subject: `⏳ Your ${appName} KYC Verification is Under Review`,
      html: kycPending(userName, appName),
    });

    console.log("✅ KYC Pending email sent:", result.id);
    return result;
  } catch (error) {
    console.error("❌ Failed to send KYC pending email:", error.message);
    throw error;
  }
};
