const FeeRule = require("../models/FeeRule");

/**
 * CREATE FEE RULE
 * POST /api/fees
 */
exports.createFeeRule = async (req, res) => {
  try {
    const { ruleName, type, structure, tiers, status } = req.body;

    // Basic validation
    if (!ruleName || !type || !structure || !tiers || !Array.isArray(tiers)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and tiers must be an array",
      });
    }

    // Validate tiers
    for (const tier of tiers) {
      if (
        tier.min === undefined ||
        tier.max === undefined ||
        tier.fee === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Each tier must have min, max, and fee",
        });
      }
      if (tier.min > tier.max) {
        return res.status(400).json({
          success: false,
          message: "Tier min cannot be greater than max",
        });
      }
    }

    const feeRule = await FeeRule.create({
      ruleName,
      type,
      structure,
      tiers,
      status: status || "Active",
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
    const { ruleName, type, structure, tiers, status } = req.body;

    // Validate tiers if present
    if (tiers && Array.isArray(tiers)) {
      for (const tier of tiers) {
        if (
          tier.min === undefined ||
          tier.max === undefined ||
          tier.fee === undefined
        ) {
          return res.status(400).json({
            success: false,
            message: "Each tier must have min, max, and fee",
          });
        }
        if (tier.min > tier.max) {
          return res.status(400).json({
            success: false,
            message: "Tier min cannot be greater than max",
          });
        }
      }
    }

    const fee = await FeeRule.findByIdAndUpdate(
      req.params.id,
      { ruleName, type, structure, tiers, status },
      { new: true },
    );

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
    console.error("Update Fee Rule Error:", error);
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
      { new: true },
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
    console.error("Disable Fee Rule Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
