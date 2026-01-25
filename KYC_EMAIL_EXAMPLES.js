/**
 * EXAMPLE: How to Use KYC Email Templates with Resend API
 *
 * This file demonstrates how to integrate and test the KYC email templates
 */

// ============================================
// Example 1: Using the Email Service
// ============================================

const emailService = require("./utils/emailService");

async function sendKycApprovalExample() {
  try {
    const result = await emailService.sendKycApprovalEmail(
      "user@example.com",
      "John Doe",
      "Credixa",
    );
    console.log("✅ Email sent successfully:", result.id);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
}

async function sendKycRejectionExample() {
  try {
    const result = await emailService.sendKycRejectionEmail(
      "user@example.com",
      "John Doe",
      "Document clarity is insufficient. Please provide a clearer scan of your ID.",
      "Credixa",
    );
    console.log("✅ Rejection email sent:", result.id);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
  }
}

// ============================================
// Example 2: Direct Template Usage in Controller
// ============================================

const { sendEmail } = require("./utils/sendEmail");
const { kycApproved, kycRejected } = require("./utils/kycEmailTemplates");

async function updateKycStatusExample(status, userEmail, userName, adminNote) {
  try {
    if (status === "approved") {
      const html = kycApproved(userName, process.env.APP_NAME || "Credixa");

      await sendEmail({
        to: userEmail,
        subject: `✅ Your ${process.env.APP_NAME || "Credixa"} KYC Verification Has Been Approved!`,
        html: html,
      });

      console.log("✅ KYC approval notification sent");
    }

    if (status === "rejected") {
      const html = kycRejected(
        userName,
        adminNote,
        process.env.APP_NAME || "Credixa",
      );

      await sendEmail({
        to: userEmail,
        subject: `⚠️ Your ${process.env.APP_NAME || "Credixa"} KYC Verification Status Update`,
        html: html,
      });

      console.log("✅ KYC rejection notification sent");
    }
  } catch (error) {
    console.error("Email error:", error);
  }
}

// ============================================
// Example 3: How It's Used in kyc.controller.js
// ============================================

/*
exports.updateKycStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    
    // ... validation and database updates ...
    
    // 📧 SEND EMAIL
    if (kyc.user.email) {
      const appName = process.env.APP_NAME || "Credixa";
      
      try {
        if (status === "approved") {
          await sendEmail({
            to: kyc.user.email,
            subject: `✅ Your ${appName} KYC Verification Has Been Approved!`,
            html: kycApproved(kyc.user.fullName || kyc.user.firstName, appName),
          });
        }

        if (status === "rejected") {
          await sendEmail({
            to: kyc.user.email,
            subject: `⚠️ Your ${appName} KYC Verification Status Update`,
            html: kycRejected(kyc.user.fullName || kyc.user.firstName, adminNote, appName),
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
    res.status(500).json({
      success: false,
      message: "Failed to update KYC status",
    });
  }
};
*/

// ============================================
// Example 4: Testing with cURL
// ============================================

/*
# Test KYC Status Update Endpoint
curl -X PATCH http://localhost:5000/api/kyc/YOUR_KYC_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "adminNote": "All documents verified successfully"
  }'

# Expected Response
{
  "success": true,
  "message": "KYC status updated successfully",
  "kyc": {
    "_id": "...",
    "status": "approved",
    "note": "All documents verified successfully",
    ...
  }
}

# Email will be sent to user automatically
*/

// ============================================
// Example 5: Environment Variables Needed
// ============================================

/*
Required in .env file:

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM="Credixa <no-reply@credixa.co>"
APP_NAME="Credixa"
APP_URL="https://credixa.co"
*/

// ============================================
// Example 6: Test Email Send (Development)
// ============================================

async function testEmailSend() {
  try {
    console.log("📧 Testing KYC Approval Email...");

    const { sendEmail } = require("./utils/sendEmail");
    const { kycApproved } = require("./utils/kycEmailTemplates");

    const result = await sendEmail({
      to: "test@example.com",
      subject: "✅ Test: Your Credixa KYC Verification Has Been Approved!",
      html: kycApproved("Test User", "Credixa"),
    });

    console.log("✅ Test email sent! ID:", result.id);
    console.log("📊 Check Resend dashboard for delivery status");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// ============================================
// Export for use in other files
// ============================================

module.exports = {
  sendKycApprovalExample,
  sendKycRejectionExample,
  updateKycStatusExample,
  testEmailSend,
};
