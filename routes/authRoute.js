// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.get("/super-admin-exists", controller.checkSuperAdminExists);
router.post("/register-super-admin", controller.registerSuperAdmin);
router.post("/login", controller.loginAdmin);

module.exports = router;
