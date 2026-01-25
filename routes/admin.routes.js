const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin.controller");
const { protect, superAdminOnly } = require("../middlewares/auth.middleware");
const logActivity = require("../middlewares/activity.middleware");
const uploadAvatar = require("../middlewares/upload.middleware");

/**
 * ADMIN ACTIVITY LOGS
 * GET /api/admin/activity
 */
router.get("/activity", protect, superAdminOnly, controller.getAdminActivity);

/**
 * CREATE ADMIN
 * POST /api/admin/create
 */
router.post(
  "/create",
  protect,
  superAdminOnly,
  logActivity("CREATE_ADMIN"),
  controller.createAdmin,
);

/**
 * GET ALL ADMINS
 * GET /api/admin/all
 */
router.get("/all", protect, superAdminOnly, controller.getAdmins);

/**
 * GET ADMIN BY ID
 * GET /api/admin/:id
 */
router.get("/:id", protect, superAdminOnly, controller.getAdminById);

/**
 * UPDATE ADMIN
 * PUT /api/admin/:id
 */
router.put(
  "/:id",
  protect,
  superAdminOnly,
  logActivity("UPDATE_ADMIN"),
  controller.updateAdmin,
);

/**
 * DELETE ADMIN
 * DELETE /api/admin/:id
 */
router.delete(
  "/:id",
  protect,
  superAdminOnly,
  logActivity("DELETE_ADMIN"),
  controller.deleteAdmin,
);

router.put(
  "/me/avatar",
  protect,
  uploadAvatar.single("avatar"),
  controller.uploadAvatar,
);

module.exports = router;
