const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin.controller");
const { protect, superAdminOnly } = require("../middlewares/auth.middleware");
const logActivity = require("../middlewares/activity.middleware");

router.get("/activity", protect, superAdminOnly, controller.getAdminActivity);

router.post(
  "/create",
  protect,
  superAdminOnly,
  logActivity("CREATE_ADMIN"),
  controller.createAdmin
);

router.get("/all", protect, superAdminOnly, controller.getAdmins);

module.exports = router;
