const express = require("express");
const router = express.Router();
const controller = require("../controllers/userProfileController");

router.get("/:id/profile", controller.getUserProfile);
router.get("/:id/wallet", controller.getUserWallet);
router.get("/:id/transactions", controller.getUserTransactions);
router.get("/:id/devices", controller.getUserDevices);
router.get("/:id/notes", controller.getUserNotes);
router.post("/:id/notes", controller.addAdminNote);

module.exports = router;
