const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin.controller");
const { protect, superAdminOnly } = require("../middlewares/auth.middleware");
const logActivity = require("../middlewares/activity.middleware");
const uploadAvatar = require("../middlewares/upload.middleware");

/* =====================================
   SPECIFIC ROUTES FIRST
===================================== */

// ADMIN ACTIVITY LOGS
router.get("/activity", protect, superAdminOnly, controller.getAdminActivity);

// CREATE ADMIN
router.post(
  "/create",
  protect,
  superAdminOnly,
  logActivity("CREATE_ADMIN"),
  controller.createAdmin,
);

// GET ALL ADMINS
router.get("/all", protect, superAdminOnly, controller.getAdmins);

// UPDATE CURRENT ADMIN AVATAR
router.put(
  "/me/avatar",
  protect,
  uploadAvatar.single("avatar"),
  controller.uploadAvatar,
);

/* =====================================
   DYNAMIC ROUTES LAST
===================================== */

// GET ADMIN BY ID
router.get("/:id", protect, superAdminOnly, controller.getAdminById);

// UPDATE ADMIN
router.put(
  "/:id",
  protect,
  superAdminOnly,
  logActivity("UPDATE_ADMIN"),
  controller.updateAdmin,
);

// DELETE ADMIN
router.delete(
  "/:id",
  protect,
  superAdminOnly,
  logActivity("DELETE_ADMIN"),
  controller.deleteAdmin,
);

module.exports = router;
