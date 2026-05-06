/**
 * Order Model
 * Defines the structure for order documents
 * Uses Mongoose or in-memory mock based on global.usingMockDB
 */

// Check before requiring mongoose
if (global.usingMockDB) {
  // Return mock model
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.Order;
} else {
  const mongoose = require('mongoose');

  const orderItemSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    bookTitle: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerUnit: Number,
    totalPrice: Number,
  });

  const orderSchema = new mongoose.Schema(
    {
      orderNumber: {
        type: String,
        unique: true,
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      items: [orderItemSchema],
      totalQuantity: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      shippingCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      tax: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      shippingAddress: {
        street: String,
        city: String,
        country: String,
        postalCode: String,
      },
      shippingPhone: String,
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      paymentMethod: {
        type: String,
        enum: ['credit-card', 'bank-transfer', 'cash-on-delivery', 'mobile-money', 'aba-qr', 'acleda-qr'],
        default: 'cash-on-delivery',
      },
      trackingNumber: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      notes: String,
      adminNotes: String,
    },
    {
      timestamps: true,
    }
  );

  orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
      const count = await this.constructor.countDocuments();
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `ORD-${timestamp}-${count + 1}`;
    }
    next();
  });

  module.exports = mongoose.model('Order', orderSchema);
}
