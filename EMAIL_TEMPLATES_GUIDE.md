<!-- EMAIL_TEMPLATES_GUIDE.md -->

# KYC Email Templates Guide

This document describes the professional HTML email templates for KYC (Know Your Customer) verification notifications using the Resend API.

## Overview

Three email templates are available in `/utils/kycEmailTemplates.js`:

1. **KYC Approved** - Sent when a user's KYC verification is approved
2. **KYC Rejected** - Sent when a user's KYC verification is rejected with a reason
3. **KYC Pending** - Sent when KYC verification is submitted and under review

## Features

All templates include:

- ✅ Professional, modern HTML design with gradient headers
- ✅ Mobile-responsive layout
- ✅ Clear, accessible styling
- ✅ Brand customization support
- ✅ Call-to-action buttons
- ✅ Footer with legal information
- ✅ Optimized for Resend API delivery

## Template Details

### 1. KYC Approved Email

**Purpose:** Notify user that their identity verification has been successfully approved.

**HTML Features:**

- Green gradient header
- Success icon (✅)
- Congratulations message
- Verification status badge
- Details section showing:
  - Approval status
  - Approval date
  - User account name
- List of what users can now do
- Call-to-action button to dashboard
- Support contact information

**Usage Example:**

```javascript
const { kycApproved } = require("./utils/kycEmailTemplates");

const html = kycApproved("John Doe", "Credixa");

await sendEmail({
  to: "user@example.com",
  subject: "✅ Your Credixa KYC Verification Has Been Approved!",
  html: html,
});
```

### 2. KYC Rejected Email

**Purpose:** Notify user that their identity verification was not approved with the reason.

**HTML Features:**

- Red/pink gradient header
- Warning icon (⚠️)
- Professional rejection message
- Highlighted rejection reason in a distinct box
- Rejection status badge
- Helpful steps for resubmission:
  - Review the rejection reason
  - Ensure documents are clear and valid
  - Resubmit with corrected documents
  - Timeline for re-review (24-48 hours)
- Call-to-action button to resubmit documents
- Support contact information

**Usage Example:**

```javascript
const { kycRejected } = require("./utils/kycEmailTemplates");

const html = kycRejected(
  "Jane Smith",
  "Document clarity is insufficient. Please provide a clearer scan of your ID.",
  "Credixa",
);

await sendEmail({
  to: "user@example.com",
  subject: "⚠️ Your Credixa KYC Verification Status Update",
  html: html,
});
```

### 3. KYC Pending Email

**Purpose:** Acknowledge receipt of KYC verification and set expectations.

**HTML Features:**

- Orange/yellow gradient header
- Hourglass icon (⏳)
- Acknowledgment message
- Under review status
- Expected review timeline (24-48 hours)
- Information about limited feature access
- Professional styling with consistent branding

**Usage Example:**

```javascript
const { kycPending } = require("./utils/kycEmailTemplates");

const html = kycPending("Alex Johnson", "Credixa");

await sendEmail({
  to: "user@example.com",
  subject: "⏳ Your Credixa KYC Verification is Under Review",
  html: html,
});
```

## Integration with Email Service

A helper service is provided in `/utils/emailService.js` for easy integration:

```javascript
const emailService = require("./utils/emailService");

// Send KYC Approval
await emailService.sendKycApprovalEmail(
  "user@example.com",
  "John Doe",
  "Credixa",
);

// Send KYC Rejection
await emailService.sendKycRejectionEmail(
  "user@example.com",
  "John Doe",
  "Document quality is insufficient",
  "Credixa",
);

// Send KYC Pending
await emailService.sendKycPendingEmail(
  "user@example.com",
  "John Doe",
  "Credixa",
);
```

## Controller Integration

In `controllers/kyc.controller.js`:

```javascript
const emailService = require("../utils/emailService");

// When updating KYC status
if (status === "approved") {
  await emailService.sendKycApprovalEmail(
    kyc.user.email,
    kyc.user.fullName,
    process.env.APP_NAME || "Credixa",
  );
}

if (status === "rejected") {
  await emailService.sendKycRejectionEmail(
    kyc.user.email,
    kyc.user.fullName,
    adminNote,
    process.env.APP_NAME || "Credixa",
  );
}
```

## Environment Variables Required

Make sure these are set in your `.env` file:

```
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Credixa <no-reply@yourdomain.com>"
APP_NAME="Credixa"
APP_URL="https://credixa.co"
```

## Email Styling

### Colors Used

- **Success (Approved):** Green (#27ae60)
- **Warning (Rejected):** Red (#e74c3c)
- **Pending:** Orange (#f5af19)
- **Primary Brand:** Purple (#667eea)
- **Accent:** Purple gradient (#667eea to #764ba2)

### Responsive Design

- Mobile-optimized layout
- Maximum width: 600px
- Padding and margins for readability
- Readable font sizes (14px minimum)

### Typography

- Font family: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- Line height: 1.6
- Professional, clean appearance

## Customization Options

All templates accept custom parameters:

```javascript
// Customize app name
kycApproved("User Name", "MyApp");

// Customize rejection reason
kycRejected("User Name", "Custom reason message", "MyApp");

// Customize pending message
kycPending("User Name", "MyApp");
```

## Testing with Resend

To test emails with Resend:

1. Go to https://resend.com/dashboard
2. Copy your API key
3. Add to `.env`: `RESEND_API_KEY=your_key`
4. Run email send functions
5. Check dashboard for delivery status

## Best Practices

✅ **Do:**

- Always include user's full name
- Provide clear call-to-action buttons
- Include support contact information
- Use professional, friendly tone
- Test emails before deployment
- Monitor delivery with Resend dashboard

❌ **Don't:**

- Use ALL CAPS for entire messages
- Include too many links
- Make rejection emails seem personal
- Skip the support contact information
- Send duplicate emails

## Error Handling

Email failures should be logged but not fail the KYC update:

```javascript
try {
  await emailService.sendKycApprovalEmail(...);
} catch (emailError) {
  console.error("Email sending failed:", emailError);
  // Continue with KYC process
}
```

## Support

For Resend API support: https://resend.com/docs
For template customization, edit `/utils/kycEmailTemplates.js`
