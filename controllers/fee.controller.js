const FeeRule = require("../models/FeeRule");

/**
 * CREATE FEE RULE
 * POST /api/fees
 */
exports.createFeeRule = async (req, res) => {
  try {
    const { ruleName, type, structure, amount, minLimit, maxLimit, status } =
      req.body;

    // Basic validation
    if (
      !ruleName ||
      !type ||
      !structure ||
      !amount ||
      minLimit === undefined ||
      maxLimit === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (Number(minLimit) > Number(maxLimit)) {
      return res.status(400).json({
        success: false,
        message: "Min limit cannot be greater than max limit",
      });
    }

    const feeRule = await FeeRule.create({
      ruleName,
      type,
      structure,
      amount,
      minLimit,
      maxLimit,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Fee rule created successfully",
      data: feeRule,
    });
  } catch (error) {
    console.error("Create Fee Rule Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * GET ALL FEE RULES
 * GET /api/fees
 */
exports.getFeeRules = async (req, res) => {
  try {
    const fees = await FeeRule.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: fees.length,
      data: fees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * UPDATE FEE RULE
 * PUT /api/fees/:id
 */
exports.updateFeeRule = async (req, res) => {
  try {
    const fee = await FeeRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee rule not found",
      });
    }

    res.json({
      success: true,
      message: "Fee rule updated",
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * DISABLE FEE RULE
 * PATCH /api/fees/:id/disable
 */
exports.disableFeeRule = async (req, res) => {
  try {
    const fee = await FeeRule.findByIdAndUpdate(
      req.params.id,
      { status: "Disabled" },
      { new: true }
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee rule not found",
      });
    }

    res.json({
      success: true,
      message: "Fee rule disabled",
      data: fee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
