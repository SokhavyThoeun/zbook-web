/**
 * Coupon Model
 * For discount codes and promotions
 */

if (global.usingMockDB) {
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.Coupon;
} else {
  const mongoose = require('mongoose');

  const couponSchema = new mongoose.Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
      },
      discountPercent: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
      },
      maxUses: {
        type: Number,
        default: null, // null = unlimited
      },
      usedCount: {
        type: Number,
        default: 0,
      },
      minOrderAmount: {
        type: Number,
        default: 0,
      },
      validFrom: {
        type: Date,
        default: Date.now,
      },
      validUntil: {
        type: Date,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      applicableCategories: [{
        type: String,
      }],
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model('Coupon', couponSchema);
}
