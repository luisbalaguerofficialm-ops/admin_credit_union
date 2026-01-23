const jwt = require("jsonwebtoken");

/* =========================
   AUTHENTICATION
========================= */
exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* =========================
   ADMIN OR SUPER ADMIN
   (USE THIS AS protectAdmin)
========================= */
exports.protectAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const role = req.user.role;

  if (role !== "Admin" && role !== "SuperAdmin") {
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
