const jwt = require("jsonwebtoken");

/* =========================
   BASE AUTH (TOKEN CHECK)
========================= */
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Attach decoded token
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =========================
   ADMIN AUTH (ALIAS)
   (prevents undefined middleware bugs)
========================= */
exports.protectAdmin = exports.protect;

/* =========================
   ADMIN OR SUPER ADMIN
========================= */
exports.adminOrSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!["Admin", "SuperAdmin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

/* =========================
   ADMIN ONLY
========================= */
exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  next();
};

/* =========================
   SUPER ADMIN ONLY
========================= */
exports.superAdminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "SuperAdmin") {
    return res.status(403).json({ message: "SuperAdmin only" });
  }

  next();
};
