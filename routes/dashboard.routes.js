const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboard.controller");

const {
  getTransactionChart,
  getRecentTransactions,
} = require("../controllers/transaction.controller");

const { getRecentActivities } = require("../controllers/activity.controller");

router.get("/stats", getDashboardStats);
router.get("/transactions/chart", getTransactionChart);
router.get("/transactions/recent", getRecentTransactions);
router.get("/activities", getRecentActivities);

module.exports = router;
