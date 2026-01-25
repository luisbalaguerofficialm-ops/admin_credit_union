// utils/kycEmailTemplates.js

const baseStyle = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
`;

exports.kycApproved = (name, appName = "Credixa") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      ${baseStyle}
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h2 {
      color: #27ae60;
      font-size: 24px;
      margin: 10px 0;
    }
    .message-box {
      background-color: #f0fdf4;
      border-left: 4px solid #27ae60;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .details {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .detail-item {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
    .detail-label {
      font-weight: 600;
      color: #667eea;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: 600;
      transition: opacity 0.3s;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appName}</h1>
      <p style="margin: 10px 0; opacity: 0.9;">Identity Verification Approved</p>
    </div>

    <div class="content">
      <div class="success-icon">✅</div>
      
      <h2>Congratulations, ${name}!</h2>
      
      <p style="font-size: 16px; margin-bottom: 20px;">
        Great news! Your KYC (Know Your Customer) identity verification has been successfully approved.
      </p>

      <div class="message-box">
        <p style="margin: 0;">
          Your account is now fully verified and you can enjoy unrestricted access to all features and services on ${appName}.
        </p>
      </div>

      <div class="details">
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span style="color: #27ae60; font-weight: 600;">✓ Verified</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Approval Date:</span>
          <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Account:</span>
          <span>${name}</span>
        </div>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        <strong>What's next?</strong>
      </p>
      <ul style="color: #666; font-size: 14px; padding-left: 20px;">
        <li>You can now access all premium features</li>
        <li>Initiate transactions with increased limits</li>
        <li>Enjoy enhanced security and protection</li>
        <li>Access your full account dashboard</li>
      </ul>

      <hr class="divider">

      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://credixa.co'}" class="cta-button">
          Visit Your Dashboard
        </a>
      </p>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        If you have any questions or need assistance, our support team is here to help. 
        Please don't hesitate to reach out to us.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      </p>
      <p style="margin: 5px 0;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
`;

exports.kycRejected = (name, reason, appName = "Credixa") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      ${baseStyle}
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .warning-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h2 {
      color: #e74c3c;
      font-size: 24px;
      margin: 10px 0;
    }
    .message-box {
      background-color: #fef2f2;
      border-left: 4px solid #e74c3c;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .details {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .detail-item {
      margin: 10px 0;
    }
    .detail-label {
      font-weight: 600;
      color: #667eea;
      display: block;
      margin-bottom: 5px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
      font-weight: 600;
      transition: opacity 0.3s;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
    .divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appName}</h1>
      <p style="margin: 10px 0; opacity: 0.9;">Identity Verification Status</p>
    </div>

    <div class="content">
      <div class="warning-icon">⚠️</div>
      
      <h2>KYC Verification Not Approved</h2>
      
      <p style="font-size: 16px; margin-bottom: 20px;">
        Thank you for submitting your identity verification documents. Unfortunately, we were unable to approve your KYC verification at this time.
      </p>

      <div class="message-box">
        <p style="margin: 0;">
          We take security and compliance very seriously. Please review the reason below and resubmit your documents if you believe this was in error.
        </p>
      </div>

      <div class="details">
        <div class="detail-item">
          <span class="detail-label">Status:</span>
          <span style="color: #e74c3c; font-weight: 600;">✗ Not Approved</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Reason for Rejection:</span>
          <span style="background-color: #fff5f5; padding: 10px; border-radius: 4px; display: block; margin-top: 5px; color: #c0392b;">
            ${reason || "Your documents do not meet our verification requirements."}
          </span>
        </div>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        <strong>What should you do?</strong>
      </p>
      <ul style="color: #666; font-size: 14px; padding-left: 20px;">
        <li>Review the rejection reason carefully</li>
        <li>Ensure your documents are clear, valid, and match your profile</li>
        <li>Resubmit your KYC with the corrected documents</li>
        <li>Please wait 24-48 hours for re-review</li>
      </ul>

      <hr class="divider">

      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://credixa.co'}/kyc/resubmit" class="cta-button">
          Resubmit Your Documents
        </a>
      </p>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        If you need clarification or believe this is a mistake, please contact our support team. We're here to help!
      </p>
    </div>

    <div class="footer">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      </p>
      <p style="margin: 5px 0;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
`;

exports.kycPending = (name, appName = "Credixa") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      ${baseStyle}
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    h2 {
      color: #f5af19;
      font-size: 24px;
      margin: 10px 0;
    }
    .message-box {
      background-color: #fffbf0;
      border-left: 4px solid #f5af19;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appName}</h1>
      <p style="margin: 10px 0; opacity: 0.9;">KYC Verification Received</p>
    </div>

    <div class="content">
      <div style="font-size: 48px; margin-bottom: 20px;">⏳</div>
      
      <h2>Your Verification is Under Review</h2>
      
      <p style="font-size: 16px; margin-bottom: 20px;">
        Hello ${name},
      </p>

      <p style="font-size: 16px; margin-bottom: 20px;">
        Thank you for submitting your KYC verification documents. We have received your submission and it is currently under review by our compliance team.
      </p>

      <div class="message-box">
        <p style="margin: 0;">
          <strong>Expected Review Time:</strong> 24-48 hours
        </p>
        <p style="margin: 10px 0 0 0;">
          We will notify you as soon as the verification is complete.
        </p>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        In the meantime, you can still access your account and explore available features. Some premium features may be limited until your verification is approved.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} ${appName}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;
