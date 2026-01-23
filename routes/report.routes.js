const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");

router.get("/revenue", reportController.getRevenueReport);
router.get("/transactions", reportController.getTransactionReport);
router.get("/settlements", reportController.getSettlementReport);
router.get("/users", reportController.getUserActivityReport);
router.get("/downloads", reportController.getDownloadHistory);

module.exports = router;
