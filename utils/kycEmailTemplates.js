// utils/kycEmailTemplates.js
exports.kycApproved = (name) => `
  <h2>KYC Approved ✅</h2>
  <p>Hello ${name},</p>
  <p>Your KYC verification has been approved.</p>
`;

exports.kycRejected = (name, reason) => `
  <h2>KYC Rejected ❌</h2>
  <p>Hello ${name},</p>
  <p>Your KYC was rejected.</p>
  <p><strong>Reason:</strong> ${reason || "Not specified"}</p>
`;
