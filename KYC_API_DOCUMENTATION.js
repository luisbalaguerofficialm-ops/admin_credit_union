/**
 * KYC ENDPOINTS DOCUMENTATION
 *
 * These endpoints handle KYC verification status updates and automatically
 * send professional HTML emails using Resend API
 */

// ============================================
// ENDPOINT: Update KYC Status
// ============================================

/**
 * PATCH /api/kyc/:id
 *
 * Update the status of a KYC verification and automatically send email notification
 *
 * Authentication: Required (protect, superAdminOnly)
 *
 * Path Parameters:
 *   - id: String (MongoDB ObjectId) - The KYC record ID
 *
 * Request Body:
 * {
 *   "status": "approved" | "rejected",
 *   "adminNote": "Optional reason or message (required if rejected)"
 * }
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "KYC status updated successfully",
 *   "kyc": {
 *     "_id": "64d5a1b2c3d4e5f6g7h8i9j0",
 *     "userId": "64d5a1b2c3d4e5f6g7h8i9j1",
 *     "name": "John Doe",
 *     "status": "approved",
 *     "note": "All documents verified",
 *     "createdAt": "2024-01-25T10:30:00Z",
 *     "updatedAt": "2024-01-25T14:45:00Z"
 *   }
 * }
 *
 * Errors:
 *   - 400: Invalid status value
 *   - 404: KYC record not found
 *   - 403: Unauthorized (not SuperAdmin)
 *   - 500: Server error
 *
 * Side Effects:
 *   - Updates KYC status in database
 *   - Updates associated User KYC status
 *   - Sends email notification to user
 *   - Emits real-time Socket.IO update to user
 *   - Logs activity (if activity logging is enabled)
 *
 * Email Templates Sent:
 *   - If approved: Professional KYC Approved email with:
 *     ✅ Green gradient header
 *     ✅ Congratulations message
 *     ✅ Access confirmation details
 *     ✅ Next steps
 *     ✅ Dashboard link button
 *
 *   - If rejected: Professional KYC Rejected email with:
 *     ⚠️ Red gradient header
 *     ⚠️ Reason for rejection
 *     ⚠️ Steps to resubmit
 *     ⚠️ Resubmit button
 *     ⚠️ Support information
 *
 * Example Request (Approval):
 *
 *   PATCH /api/kyc/64d5a1b2c3d4e5f6g7h8i9j0
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *   Content-Type: application/json
 *
 *   {
 *     "status": "approved",
 *     "adminNote": "All documents verified and confirmed"
 *   }
 *
 * Example Request (Rejection):
 *
 *   PATCH /api/kyc/64d5a1b2c3d4e5f6g7h8i9j0
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *   Content-Type: application/json
 *
 *   {
 *     "status": "rejected",
 *     "adminNote": "Document clarity is insufficient. Please provide clearer scans of both sides of your ID."
 *   }
 *
 * Backend Flow:
 *
 *   1. Validate KYC status is "approved" or "rejected"
 *   2. Fetch KYC record and populate user data
 *   3. Update KYC status in database
 *   4. Update User.kycStatus field
 *   5. Emit real-time update via Socket.IO
 *   6. Send appropriate email notification:
 *      - Approved: Professional approval email
 *      - Rejected: Professional rejection email with reason
 *   7. Return updated KYC record
 *
 * Email Service Integration:
 *
 *   File: controllers/kyc.controller.js
 *   Function: updateKycStatus
 *
 *   Uses:
 *   - sendEmail() from utils/sendEmail.js (Resend API wrapper)
 *   - kycApproved() template from utils/kycEmailTemplates.js
 *   - kycRejected() template from utils/kycEmailTemplates.js
 *   - emailService helper from utils/emailService.js (optional)
 *
 * Email Configuration (.env):
 *
 *   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
 *   RESEND_FROM="Credixa <no-reply@yourdomain.com>"
 *   APP_NAME="Credixa"
 *   APP_URL="https://credixa.co"
 *
 * Testing:
 *
 *   1. Create/fetch a KYC record ID
 *   2. Get admin JWT token by logging in
 *   3. Make PATCH request with valid status
 *   4. Verify email in Resend dashboard
 *   5. Check user receives email
 *
 * Rate Limiting:
 *
 *   No rate limiting on this endpoint
 *   Recommendation: Limit to prevent abuse
 *   Consider: 10 requests per minute per admin user
 *
 * Performance Notes:
 *
 *   - Database: 2 queries (update KYC, update User)
 *   - Email: Async, non-blocking (won't fail KYC update if email fails)
 *   - Socket.IO: Broadcast to user room
 *   - Response time: ~500ms (with email) to ~100ms (without email)
 *
 * Future Enhancements:
 *
 *   ✓ Add email templates
 *   ✓ Add Socket.IO real-time updates
 *   □ Add SMS notifications
 *   □ Add email retries
 *   □ Add audit logging
 *   □ Add document storage reference
 *   □ Add callback webhooks
 */

// ============================================
// GET /api/kyc
// ============================================

/**
 * GET /api/kyc
 *
 * Fetch all KYC records for admin review
 *
 * Authentication: Required (protect, adminOrSuperAdmin)
 *
 * Query Parameters: None
 *
 * Response (200 OK):
 * {
 *   "success": true,
 *   "count": 5,
 *   "data": [
 *     {
 *       "_id": "64d5a1b2c3d4e5f6g7h8i9j0",
 *       "userId": "64d5a1b2c3d4e5f6g7h8i9j1",
 *       "name": "John Doe",
 *       "status": "Pending",
 *       "risk": "Low",
 *       "createdAt": "2024-01-25T10:30:00Z"
 *     },
 *     ...more records
 *   ]
 * }
 *
 * Errors:
 *   - 401: Unauthorized
 *   - 403: Admin access required
 *   - 500: Server error
 */

// ============================================
// API INTEGRATION CHECKLIST
// ============================================

/*
✅ Checklist for using KYC Email System:

1. Environment Setup:
   [ ] Resend API key obtained from https://resend.com
   [ ] Added RESEND_API_KEY to .env
   [ ] Added RESEND_FROM with valid domain
   [ ] Added APP_NAME (e.g., "Credixa")
   [ ] Added APP_URL (e.g., "https://credixa.co")

2. Dependencies:
   [ ] resend package installed
   [ ] dotenv configured
   [ ] email templates created

3. Email Templates:
   [ ] kycApproved template exists
   [ ] kycRejected template exists
   [ ] kycPending template exists (optional)
   [ ] All templates use HTML/CSS

4. Controller Integration:
   [ ] kyc.controller.js updated
   [ ] Email sending wrapped in try-catch
   [ ] Email failures don't block KYC update
   [ ] Proper error logging

5. Testing:
   [ ] Test with approved status
   [ ] Test with rejected status
   [ ] Verify emails in Resend dashboard
   [ ] Check email content formatting
   [ ] Verify links work in email

6. Production:
   [ ] Test with real email addresses
   [ ] Monitor Resend dashboard
   [ ] Set up email bounce handling
   [ ] Add admin notification on email failures
   [ ] Monitor email delivery rates

7. Documentation:
   [ ] Share email templates with marketing
   [ ] Document customization options
   [ ] Create admin guide for KYC process
   [ ] Train admins on status update flow
*/

module.exports = {
  // This file is documentation only
  // See kyc.controller.js for actual implementation
};
