const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

router.get("/super-admin-exists", controller.checkSuperAdminExists);
router.post("/register-super-admin", controller.registerSuperAdmin);
router.post("/login", controller.loginAdmin);

module.exports = router;
