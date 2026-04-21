/**
 * Coupon Controller
 * Handles discount code validation and management
 */

const Coupon = require('../models/Coupon');

// Validate coupon code
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code',
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    }).exec();

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
      });
    }

    // Check expiry
    if (new Date() > new Date(coupon.validUntil)) {
      return res.status(400).json({
        success: false,
        message: 'Coupon has expired',
      });
    }

    // Check start date
    if (new Date() < new Date(coupon.validFrom)) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not yet valid',
      });
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        message: 'Coupon usage limit reached',
      });
    }

    // Check minimum order amount
    if (orderAmount && coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minOrderAmount} required`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: orderAmount
          ? Math.round(orderAmount * (coupon.discountPercent / 100) * 100) / 100
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all coupons (admin only)
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

// Create coupon (admin only)
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, maxUses, minOrderAmount, validFrom, validUntil, applicableCategories } = req.body;

    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() }).exec();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists',
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountPercent,
      maxUses,
      minOrderAmount,
      validFrom: validFrom || new Date(),
      validUntil,
      applicableCategories,
    });

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Update coupon (admin only)
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).exec();
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    const updateData = {};
    const fields = ['discountPercent', 'maxUses', 'minOrderAmount', 'validFrom', 'validUntil', 'isActive', 'applicableCategories'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    await Coupon.updateOne({ _id: req.params.id }, { $set: updateData });

    res.status(200).json({
      success: true,
      data: { ...coupon, ...updateData },
    });
  } catch (error) {
    next(error);
  }
};

// Delete coupon (admin only)
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).exec();
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    await Coupon.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
