const express = require("express");
const router = express.Router();

const controllers = require("../controllers/addFunds.Controller");
const middleware = require("../middlewares/auth.middleware");

const {
  createFundingRequest,
  getMyFundingRequests,
  getAllFundingRequests,
  reviewFundingRequest,
} = controllers;

const { protect, adminOnly } = middleware;

/**
 * USER ROUTES
 */
router.post("/funding-request", protect, createFundingRequest);
router.get("/funding-request/me", protect, getMyFundingRequests);

/**
 * ADMIN ROUTES
 */
router.get("/funding-request", protect, adminOnly, getAllFundingRequests);
router.put("/funding-request/:id", protect, adminOnly, reviewFundingRequest);

module.exports = router;
