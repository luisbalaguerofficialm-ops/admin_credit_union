const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");

const {
  getTransactionChart,
  getRecentTransactions,
} = require("../controllers/transactionController");

const { getRecentActivities } = require("../controllers/activityController");

router.get("/stats", getDashboardStats);
router.get("/transactions/chart", getTransactionChart);
router.get("/transactions/recent", getRecentTransactions);
router.get("/activities", getRecentActivities);

module.exports = router;
